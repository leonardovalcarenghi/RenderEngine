(function (global, factory) {
  global.RenderEngine = factory();
})(this, function () {
  // Conteiner principal para renderização das páginas:
  var PageContainer = document.createElement("div");

  // Base URL:
  var Base = "";

  var Settings = {
    files: {
      html: "view",
      css: "style",
      js: "script",
    },
    render: {
      view: "view",
      style: "style",
      script: "script",
    },
    logs: true,
    cache: false,
  };

  function RenderEngine(options = {}) {
    PageContainer = null;

    var defaults = {
      files: {
        html: "view",
        css: "style",
        js: "script",
      },
      render: {
        view: "view",
        style: "style",
        script: "script",
      },
      logs: true,
      cache: false,
    };

    options = options || {};

    Object.keys(defaults).forEach(function (key) {
      Settings[key] = options[key] || defaults[key];
    });

    // console.log('Settings', Settings);

    return this;
  }

  // Definir container principal para renderização das páginas:
  RenderEngine.prototype.SetBase = function (path) {
    Base = path || "";
    return this;
  };

  RenderEngine.prototype.SetPageContainer = function (container) {
    PageContainer = container || null;
    return this;
  };

  // Renderizar Página:
  RenderEngine.prototype.Page = async function (path, container) {
    container = container || PageContainer;
    container.innerHTML = "";

    // HTML //
    try {
      const file = Settings.files.html;
      const tag = Settings.render.view;
      const html = await this._get(`${Base}/${path}/${file}.html`);
      const view = document.createElement(tag);
      view.setAttribute("type", "text/html");
      view.innerHTML = html;
      container.append(view);
    } catch (error) {
      console.log("erro ao renderizar a página");
      throw "Não foi possível localizar a página solicitada.";
    }

    // CSS /
    try {
      const file = Settings.files.css;
      const tag = Settings.render.style;
      const css = await this._get(`${Base}/${path}/${file}.css`);
      const style = document.createElement(tag);
      style.setAttribute("rel", "stylesheet");
      style.innerHTML = css;
      container.append(style);
    } catch (error) {
      // console.log('erro ao buscar style');
    }

    // JS /
    try {
      const file = Settings.files.js;
      const tag = Settings.render.script;
      const js = await this._get(`${Base}/${path}/${file}.js`);
      const script = document.createElement(tag);
      script.setAttribute("type", "text/javascript");
      script.innerHTML = js;

      // const pageFunction = new Function('', js);
    } catch (error) {
      // console.log('erro ao buscar script');
    }

    return this;
  };

  RenderEngine.prototype.ImportComponentAsync = async function (path) {
    const component = await this.__getComponentAsElement(path);
    const name = component.getAttribute("name");

    const obj = {
      name,
      render: (container, data) => {
        const elements = [];
        if (Array.isArray(data)) {
          data.forEach((DATA) => {
            const elementRendered = _render(container, component, DATA);
            elements.push({ data: DATA, element: elementRendered });
          });
        } else {
          const elementRendered = _render(container, component, data);
          elements[0] = { data, element: elementRendered };
        }
        return elements;
      },
      // renderBefore: (container, data) => {return this.renderBefore(component, container, data); },
    };

    return { ...obj };
  };

  // Importar Componente:
  RenderEngine.prototype.ImportComponent = function (path) {
    const component = _getComponentAsElement(path);
    const name = component.getAttribute("name");

    const obj = {
      name,
      render: (container, data) => {
        const elements = [];
        if (Array.isArray(data)) {
          data.forEach((DATA) => {
            const elementRendered = _render(container, component, DATA);
            elements.push({ data: DATA, element: elementRendered });
          });
        } else {
          const elementRendered = _render(container, component, data);
          elements[0] = { data, element: elementRendered };
        }
        return elements;
      },
      // renderBefore: (container, data) => {return this.renderBefore(component, container, data); },
    };

    return { ...obj };
  };

  RenderEngine.prototype.__getComponentAsElement = async function (path) {
    const component = await fetch(`${Base}/${path}.html`).then((data) => {
      return data.text();
    });
    const element = document.createElement("div");
    element.innerHTML = component;

    const htmlElement = element.querySelector("component");
    return htmlElement;
  };

  const _getComponentAsElement = function (path) {
    const request = new XMLHttpRequest();
    request.open("GET", `${Base}/${path}.html`, false);
    request.send(null);
    if (request.status === 200) {
      const element = document.createElement("div");
      element.innerHTML = request.responseText;

      const htmlElement = element.querySelector("component");
      return htmlElement;
    }
  };

  const _render = function (
    container = document.querySelector(""),
    component = document.querySelector(""),
    data = {}
  ) {
    const identifier = _newIdentifier();
    const name =
      component.getAttribute("name").replaceAll("-", "") ||
      `component-${identifier}`;

    // Bases:
    const view = component.querySelector("view");
    const script = component.querySelector("script");
    const style = component.querySelector("style");

    // Compilar:
    const compiledComponent = _compile(
      identifier,
      name,
      data,
      view,
      script,
      style
    );

    // Atributos:
    const componentAttributes = [].slice.call(view.attributes);
    componentAttributes.forEach((attr) => {
      compiledComponent.setAttribute(attr.name, attr.value);
    });

    container.appendChild(compiledComponent);
    return compiledComponent;
  };

  const _compile = function (identifier, name, data, view, script, style) {
    const props = _getScopeData(data, identifier, name);
    const [keys, values] = _getDataUnstructured(data);

    const functionContent = _mountComponentFunctionScope(
      identifier,
      name,
      view,
      script,
      style
    ); // Montar conteúdo da função.

    const scopeFunction = new Function(["props", ...keys], functionContent); // Criar função via JS
    const [component, events] = scopeFunction(props, ...values); // Executar função e retornar componente compilado.
    _callComponentEvents(events);
    // _addEventListenersInComponent(component, $scope); // declarar eventos nos elementos.
    return component;
  };

  const _getDataUnstructured = function (data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    return [keys, values];
  };

  const _getScopeData = function (data, identifier, name) {
    const view = document.createElement("div");
    view.setAttribute("component-identifier", identifier);

    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.setAttribute("style-component-identifier", identifier);

    return {
      name,
      view,
      style,
      ...data,      
    };
  };

  const _getElementsInView = function (view) {
    const names = [];
    [...view.querySelectorAll("[name]")].forEach((element) => {
      const name = element.getAttribute("name");
      names.push(name);
    });
    return names;
  };

  const _callComponentEvents = function (events = {}) {
    const componentDidMount = events?.componentDidMount;
    if (typeof componentDidMount === "function") {
      componentDidMount();
    }

    const componentDidUpdate = events?.componentDidUpdate;
  };

  const _mountComponentFunctionScope = function (
    identifier,
    name,
    view,
    script = null,
    style = null
  ) {
    view = view.innerHTML
      .toString()
      .replaceAll("&lt;", "<")
      .replaceAll("&gt;", ">")
      .replaceAll("{{", "${ ")
      .replaceAll("}}", " }");

    if (style) {
      style = style.innerHTML
        .toString()
        .replaceAll("component", `[component-identifier="${identifier}"]`)
        .replaceAll("&lt;", "<")
        .replaceAll("&gt;", ">")
        .replaceAll("{{", "${ ")
        .replaceAll("}}", " }");
    }

    script = script?.innerHTML.toString();

    let internalFunctions = (() => {
      const internalInitialize = function (component) {};

      const DeclareEventListeners = function () {
        const mouseEvents = [
          "onclick",
          "onmouseover",
          "onmouseout",
          "onmousedown",
          "onmouseup",
          "onmousemove",
        ];
        const keyboardEvents = ["onkeydown", "onkeyup", "onkeypress"];
        const formEvents = ["onfocus", "onsubmit", "onblur", "onchange"];
        const events = [...mouseEvents, ...keyboardEvents, ...formEvents];

        const isFunctionProp = function (data) {
          try {
            const isF = typeof eval(data);
            return isF == "function";
          } catch (error) {
            return false;
          }
        };

        events.forEach((event_name) => {
          view.querySelectorAll(`[${event_name}]`).forEach((element) => {
            const eventRef = element.getAttribute(event_name);
            const isFunction = isFunctionProp(eventRef);
            element.removeAttribute(event_name);
            if (isFunction) {
              const eventType = event_name.substring(2);
              const eventFunction = eval(`${eventRef}`);
              element.addEventListener(eventType, (event) => {
                return eventFunction(event, view);
              });
            }
          });
        });
      };

      const $CONSOLE = function () {
        console.log(...arguments);
        return "";
      };

      const $IF = function (condition, caseTrue, caseFalse) {
        if (condition == true) {
          return typeof caseTrue === "function" ? caseTrue() : caseTrue;
        } else {
          return typeof caseFalse === "function" ? caseFalse() : caseFalse;
        }
      };

      const $RENDER = function (component, data = {}) {
        const result = component.render(document.createElement("div"), data);
        const html = result.map((e) => e.element.innerHTML).join(" ");
        return html;
      };

      const $MAP = function (array = [], linq) {
        return array.map(linq).join(" ");
      };

      const instanceElementsInView = function () {};
    }).toString();
    internalFunctions = internalFunctions.slice(
      internalFunctions.indexOf("{") + 1,
      internalFunctions.lastIndexOf("}")
    );

    return ` 

            const {name, view, style} = props;
            let _firstRender = true;        

            ${script || ""}

            ${internalFunctions}

            function Render(){
                view.innerHTML = \`${view}\`;
                style.innerHTML = \`${style}\`;                 
                if (view.contains(style) == false){ view.appendChild(style); } 
                if (!_firstRender){ typeof componentDidUpdate === "function" ? componentDidUpdate() : (_=>{}); } else{ _firstRender = false; }
                DeclareEventListeners();
            }

            function RemoveMe(){
                view.remove();
            }

            Render();              

            {
                const events = {
                    componentDidMount: typeof(componentDidMount) === "function" ? componentDidMount : null,
                    componentDidUpdate: typeof(componentDidUpdate) === "function" ? componentDidUpdate : null,
                };
                return [view, events];    
            }           
            
                
        `;
  };

  RenderEngine.prototype.__newIdentifier = function () {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
      .replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      })
      .replaceAll("-", "");
  };

  const _newIdentifier = function () {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
      .replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      })
      .replaceAll("-", "");
  };

  // Requisição GET:
  RenderEngine.prototype._get = function (url) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.open("GET", url, true);
      req.send(null);
      req.onload = () => {
        if (req.status == 404) {
          reject(null);
        } else {
          resolve(req.responseText);
        }
      };
      req.onerror = () => {
        reject(null);
      };
    });
  };

  return RenderEngine;
});
