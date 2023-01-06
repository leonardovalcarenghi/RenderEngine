(function (global, factory) {
    global.RenderEngine = factory();
}(this, (function () {

    // Conteiner principal para renderização das páginas:
    var PageContainer = document.createElement('div');

    // Base URL:
    var Base = '';

    var Settings = {
        files: {
            html: 'view',
            css: 'style',
            js: 'script'
        },
        render: {
            view: 'view',
            style: 'style',
            script: 'script'
        },
        logs: true,
        cache: false
    }

    function RenderEngine(options = {}) {

        PageContainer = null;

        var defaults = {
            files: {
                html: 'view',
                css: 'style',
                js: 'script'
            },
            render: {
                view: 'view',
                style: 'style',
                script: 'script'
            },
            logs: true,
            cache: false
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
        Base = path || '';
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
            view.setAttribute('type', 'text/html');
            view.innerHTML = html;
            container.append(view);
        }
        catch (error) {
            console.log('erro ao renderizar a página');
            throw 'Não foi possível localizar a página solicitada.'
        }

        // CSS /
        try {
            const file = Settings.files.css;
            const tag = Settings.render.style;
            const css = await this._get(`${Base}/${path}/${file}.css`);
            const style = document.createElement(tag);
            style.setAttribute('rel', 'stylesheet');
            style.innerHTML = css;
            container.append(style);
        }
        catch (error) {
            console.log('erro ao buscar style');
        }

        // JS /
        try {
            const file = Settings.files.js;
            const tag = Settings.render.script;
            const js = await this._get(`${Base}/${path}/${file}.js`);
            const script = document.createElement(tag);
            script.setAttribute('type', 'text/javascript');
            script.innerHTML = js;

            // const pageFunction = new Function('', js);
        }
        catch (error) {
            // console.log('erro ao buscar script');
        }

        return this;
    };

    RenderEngine.prototype.Component = function (container, component, data) {



        container.appendChild(componentHTML);

    }

    RenderEngine.prototype.ImportComponentAsync = async function (path) {
        const component = await this.__getComponentAsElement(path);
        const name = component.getAttribute('name');

        const obj = {
            name,
            render: (container, data) => {
                const elements = [];
                if (Array.isArray(data)) {
                    data.forEach(DATA => {
                        const elementRendered = _render(container, component, DATA);
                        elements.push({ data: DATA, element: elementRendered });
                    });

                } else {
                    const elementRendered = _render(container, component, data);
                    elements[0] = { data, element: elementRendered };
                }
                return elements;
            }
            // renderBefore: (container, data) => {return this.renderBefore(component, container, data); },            
        };

        return { ...obj };
    }

    // Importar Componente:
    RenderEngine.prototype.ImportComponent = function (path) {

        const component = _getComponentAsElement(path);
        const name = component.getAttribute('name');

        const obj = {
            name,
            render: (container, data) => {
                const elements = [];
                if (Array.isArray(data)) {
                    data.forEach(DATA => {
                        const elementRendered = _render(container, component, DATA);
                        elements.push({ data: DATA, element: elementRendered });
                    });

                } else {
                    const elementRendered = _render(container, component, data);
                    elements[0] = { data, element: elementRendered };
                }
                return elements;
            }
            // renderBefore: (container, data) => {return this.renderBefore(component, container, data); },            
        };

        return { ...obj };

    }




    RenderEngine.prototype.__getComponentAsElement = async function (path) {
        const component = await fetch(`${Base}/${path}.html`).then(data => { return data.text(); });
        const element = document.createElement('div');
        element.innerHTML = component;

        const htmlElement = element.querySelector('component')
        return htmlElement;
    }


    const _getComponentAsElement = function (path) {
        const request = new XMLHttpRequest();
        request.open('GET', `${Base}/${path}.html`, false);
        request.send(null);
        if (request.status === 200) {
            const element = document.createElement('div');
            element.innerHTML = request.responseText;

            const htmlElement = element.querySelector('component')
            return htmlElement;
        }
    }

    const _render = function (container = document.querySelector(""), component = document.querySelector(""), data = {}) {

        const identifier = _newIdentifier();
        const name = component.getAttribute("name") || `component-${identifier}`;

        // Bases:
        const view = component.querySelector("view");
        const script = component.querySelector("script");
        const style = component.querySelector("style");

        const compiledView = _compileView(identifier, data, view, script);
        const compiledStyle = style ? _compileStyle(identifier, data, style) : null;
        if (compiledStyle) { compiledView.appendChild(compiledStyle); }

        // Atributos:
        const componentAttributes = [].slice.call(view.attributes);
        componentAttributes.forEach(attr => { compiledView.setAttribute(attr.name, attr.value); });

        container.appendChild(compiledView);
        return compiledView;
    }


    // RenderEngine.prototype.__render = function (container, data, component) {


    //     // Informações //
    //     const identifier = this.__newIdentifier();
    //     const name = component.getAttribute('name');

    //     // Visualização //
    //     const script = component.querySelector('script');
    //     const view = component.querySelector('view');
    //     const viewAttributes = [].slice.call(view.attributes);
    //     const viewCompiled = this.__compileView(identifier, view, script, data);
    //     viewCompiled.setAttribute('component-name', name);
    //     viewAttributes.forEach(attr => { viewCompiled.setAttribute(attr.name, attr.value); });



    //     // viewCompiled.setAttribute('class', attrClass);

    //     // Estilo //
    //     const style = component.querySelector('style');
    //     if (style) {
    //         const styleCompiled = this.__compileStyle(identifier, style, data);
    //         viewCompiled.appendChild(styleCompiled);
    //     }

    //     container.appendChild(viewCompiled);
    //     return viewCompiled;

    // }

    // RenderEngine.prototype.__renderBefore = function (component, container, data) {

    // }


    const _compileView = function (identifier, data, view, script) {

        const nameOfElements = _getElementsInView(view);
        const $scope = _getScopeData(data, nameOfElements);
        const [keys, values] = _getDataUnstructured(data);

        const functionContent = _mountComponentFunctionScope(identifier, view, script); // Montar conteúdo da função.
        const scopeFunction = new Function(['$SCOPE', ...keys, ...nameOfElements], functionContent); // Criar função via JS
        const [component, _this] = scopeFunction($scope, ...values); // Executar função e retornar componente compilado.
        _addEventListenersInComponent(component, $scope); // declarar eventos nos elementos.     
        _callEventsInComponent(component, $scope); // chamar função interna dizendo q o componente foi montado.        
        return component;

    }

    const _compileStyle = function (identifier, data, style) {

        const $scope = _getScopeData(data);
        const [keys, values] = _getDataUnstructured(data);
        const functionContent = _mountStyleFunctionScope(identifier, style)
        const scopeFunction = new Function(['$SCOPE', ...keys], functionContent);
        const element = scopeFunction($scope, ...values);
        return element;

    }

    const _getDataUnstructured = function (data) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        return [keys, values];
    }

    const _getScopeData = function (data, nameOfElements = []) {
        return {
            ...data,
            elements: nameOfElements,
            $set: (key, value) => {
                $scope[key] = value;
                return "";
            }
        }
    }

    const _getElementsInView = function (view) {

        const names = [];
        [...view.querySelectorAll("[name]")].forEach(element => {
            const name = element.getAttribute("name");
            names.push(name);
        });
        return names;

    }

    const _mountComponentFunctionScope = function (identifier, view, script = null) {

        view = view.innerHTML.toString()
            .replaceAll('&lt;', '<')
            .replaceAll('&gt;', '>')
            .replaceAll('{{', '${ ')
            .replaceAll('}}', ' }')

        script = script?.innerHTML.toString();


        let internalFunctions = (function () {

            const internalInitialize = function (component) {

            }

            const $CONSOLE = function () {
                console.log(...arguments);
                return '';
            }

            const $IF = function (condition, caseTrue, caseFalse) {
                if (condition == true) { return caseTrue } else { return caseFalse; }
            }

            const $RENDER = function (path, data = {}) {
                const component = Render.ImportComponent(path);
                const result = component.render(document.createElement("div"), data);
                return result[0].element.innerHTML;
            }

            const $MAP = function (array = [], linq) {
                return array.map(linq);
            }

            const instanceElementsInView = function () {

                $SCOPE.elements.forEach((name) => {

                    const element = $VIEW.querySelectorAll(`[name="${name}"]`)


                    eval(`var ${name} = 123;`)
                    // window["abc123"] = element

                    if (typeof (name) === 'undefined') {

                    }



                })

                // [...$VIEW.querySelectorAll("[name]")].forEach(element => {
                //     const name = element.getAttribute("name");
                //     _this[name] = element;
                // });
            }


        }).toString();
        internalFunctions = internalFunctions.slice(internalFunctions.indexOf("{") + 1, internalFunctions.lastIndexOf("}"));



        return `

          
            // const _args = Array.slice(arguments);
            // console.log("_args", _args)
            const _this = this;
            const $VIEW = document.createElement("div");
            $VIEW.setAttribute('component-identifier', "${identifier}");

            ${script}

            ${internalFunctions}          

            $VIEW.innerHTML = \`${view}\`;   
            instanceElementsInView();
            return [$VIEW, this];        
        `;

    }

    const _mountStyleFunctionScope = function (identifier, style) {

        style = style.innerHTML.toString()
            .replaceAll('component', `[component-identifier="${identifier}"]`)
            .replaceAll('{{', '${')
            .replaceAll('}}', '}');

        return `
            const $style = document.createElement("style");
            $style.setAttribute('type', 'text/css');
            $style.setAttribute('style-component-identifier', "${identifier}");
 
            $style.innerHTML = \`${style}\`;
            return $style;        
        `;
    }

    const _callEventsInComponent = function (component, $scope) {

        if (typeof ($scope.componentDidMount) === "function") { $scope.componentDidMount(component); }


        const in_dom = document.body.contains(component);
        const observer = new MutationObserver(function (mutations) {

            if (document.body.contains(element)) {
                if (!in_dom) {
                    console.log("element inserted");
                }
                in_dom = true;
            } else if (in_dom) {
                in_dom = false;
                console.log("element removed");
            }


        });

        observer.observe(document.body, { childList: true });




    }

    const _addEventListenersInComponent = function (component, $scope) {
        const mouseEvents = ['onclick', 'onmouseover', 'onmouseout', 'onmousedown', 'onmouseup', 'onmousemove'];
        const keyboardEvents = ['onkeydown', 'onkeyup', 'onkeypress'];
        const formEvents = ['onfocus', 'onsubmit', 'onblur', 'onchange'];
        const events = [...mouseEvents, ...keyboardEvents, ...formEvents];

        events.forEach(event_name => {
            component.querySelectorAll(`[${event_name}]`).forEach(element => {
                const eventRef = element.getAttribute(event_name);
                const eventType = event_name.substring(2);
                const eventFunction = $scope[eventRef];
                const isFunction = (typeof eventFunction === 'function');
                element.removeAttribute(event_name);
                if (isFunction) {
                    element.addEventListener(eventType, (event) => { return eventFunction(event, component, $scope); });
                }
            });
        });
    }


    const _observerElementInDOM = new MutationObserver(function (mutations_list) {
        mutations_list.forEach(function (mutation) {
            mutation.removedNodes.forEach(function (removed_node) {
                if (removed_node.id == 'child') {
                    console.log('#child has been removed');
                    observer.disconnect();
                }
            });
        });
    });





    RenderEngine.prototype.__compileView = function (identifier, view, script, data) {

        const element = document.createElement('div');
        element.setAttribute('component-identifier', identifier);




        const viewContent = view.innerHTML.toString()
            .replaceAll('&gt;', '>')
            .replaceAll('{{', '${ ')
            .replaceAll('}}', ' }')


        const scriptCode = script?.innerHTML.toString();

        // Scope //

        const keys = Object.keys(data);
        keys.forEach(KEY => {
            const ref = data[KEY];
            if (typeof (ref) === 'string') {
                // const span = document.createElement('span');
                // span.innerHTML = ref;
                // data[KEY] = span.outerHTML;
                // data[`ELEMENT_${KEY}`] = span;
            }
        });

        const values = Object.values(data);

        // const keys = _getKeysOfScope(data);
        // const values = _getValuesOfKeysOfScope(data);
        const $scope = {
            ...data,
            $set: (key, value) => {

                // const element = data[`ELEMENT_${key}`]
                // if (element) { element.innerHTML = value; }

                $scope[key] = value;
                return "";

            }
        }

        // Elementos:
        // const _viewElements = view.querySelectorAll("[name]");
        // console.log("_viewElements",_viewElements);
        // console.log("---------------------------------------------")




        // Compilador //
        const _functionBody = this.__compileFunctionContent(identifier, viewContent, scriptCode);
        const _function = new Function(['$scope', ...keys], _functionBody);
        element.innerHTML = _function($scope, ...values);



        this.__initializeEventsInComponent(element, $scope);
        return element;

    }


    RenderEngine.prototype.__compileStyle = function (identifier, style, data) {

        let styleContent = style.innerHTML.toString();
        styleContent = styleContent
            .replaceAll('component', `[component-identifier="${identifier}"]`)
            .replaceAll('{{', '${')
            .replaceAll('}}', '}');

        const keys = Object.keys(data);
        const values = Object.values(data);
        // keys.forEach(KEY => { styleContent = styleContent.replaceAll(KEY, `$scope.${KEY}`); });

        const $scope = {
            ...data,
            $setScope: (key, value) => {

            }
        }

        const _functionBody = this.__compileFunctionContent(identifier, styleContent);
        const _function = new Function(['$scope', ...keys], _functionBody);
        const _functionResult = _function($scope, ...values);

        const element = document.createElement('style');
        element.setAttribute('type', 'text/css');
        element.innerHTML = _functionResult;
        return element;

    }



    RenderEngine.prototype.__initializeEventsInComponent = function (component, $scope) {



        if (typeof ($scope.___componentDidMount) === "function") {

            $scope.___componentDidMount(component);

        }

        const keys = Object.keys($scope);
        const mouseEvents = ['onclick', 'onmouseover', 'onmouseout', 'onmousedown', 'onmouseup', 'onmousemove'];
        const keyboardEvents = ['onkeydown', 'onkeyup', 'onkeypress'];
        const formEvents = ['onfocus', 'onsubmit', 'onblur', 'onchange'];
        const events = [...mouseEvents, ...keyboardEvents, ...formEvents];

        events.forEach(event_name => {
            component.querySelectorAll(`[${event_name}]`).forEach(element => {
                const eventRef = element.getAttribute(event_name);
                const eventType = event_name.substring(2);
                const eventFunction = $scope[eventRef];
                const isFunction = (typeof eventFunction === 'function');
                element.removeAttribute(event_name);
                if (isFunction) {
                    element.addEventListener(eventType, (event) => { return eventFunction(event, component, $scope); });
                }
            });
        });

    }

    RenderEngine.prototype.__compileFunctionContent = function (identifier, content, script) {

        return `
            ${script}
            const $___console = function () {
                console.log(...arguments);
                return '';
            }

            return \`${content}\`;        
        `;

    }

    RenderEngine.prototype.__newIdentifier = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }).replaceAll('-', '');
    }

    const _newIdentifier = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }).replaceAll('-', '');
    }

    RenderEngine.prototype.ImportComponent__ = function (path) {
        if (!RenderTemplating) { throw 'Para renderizar um componente é necessário instânciar um Render Templating.' }
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this._get(`${Base}/${path}.html`);


                const element = document.createElement('div');
                element.innerHTML = response;

                const name = element.querySelector('component').getAttribute('name');

                const component = document.createElement('div');







                const style = element.querySelector('style');

                const props = {
                    name,
                    html: component.innerHTML,
                    style: style.innerHTML,
                    render: function (container, data) {


                        var template = Handlebars.compile(component);

                        if (Array.isArray(data)) {

                            data.forEach(D => {
                                var htmlCompiled = template(D);
                                container.append(htmlCompiled);
                            })


                        } else {
                            var htmlCompiled = template(data);
                            container.append(htmlCompiled);
                        }



                    }
                }

                resolve(props);
            }
            catch (error) {
                throw 'Não foi possível localizar o componente.', error
            }
        });
    };


    // Requisição GET:
    RenderEngine.prototype._get = function (url) {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();
            req.open('GET', url, true);
            req.send(null);
            req.onload = () => {
                if (req.status == 404) {
                    reject(null);
                } else {
                    resolve(req.responseText);
                }
            }
            req.onerror = () => { reject(null); }
        });
    };

    return RenderEngine;

})));

