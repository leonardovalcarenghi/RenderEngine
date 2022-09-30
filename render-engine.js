(function (global, factory) {
    global.RenderEngine = factory();
}(this, (function () {

    // Conteiner principal para renderização das páginas:
    var PageContainer = document.createElement('div');

    // Base URL:
    var Base = '';

    // Render Templating:
    var RenderTemplating;
    var RenderTemplatingMethod;

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

    // Atribuir um RenderTemplating como serviço de renderização de dados em um HTML:
    RenderEngine.prototype.SetRenderTemplating = function (object, method = '') {
        RenderTemplating = object || null;
        RenderTemplatingMethod = method || null;
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
            console.log('erro ao buscar script');
        }

        return this;
    };

    RenderEngine.prototype.Component = function (container, component, data) {



        container.appendChild(componentHTML);

    }

    // Importar Componente:
    RenderEngine.prototype.ImportComponent = async function (path) {

        const component = await this.__getComponentAsElement(path);
        const name = component.getAttribute('name');

        const obj = {
            name,
            render: (container, data) => {
                const elements = [];
                if (Array.isArray(data)) {
                    data.forEach(DATA => {
                        const elementRendered = this.__render(container, DATA, component);
                        elements.push({ data: DATA, element: elementRendered });
                    });

                } else {
                    const elementRendered = this.__render(container, data, component);
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


    RenderEngine.prototype.__render = function (container, data, component) {


        // Informações //
        const identifier = this.__newIdentifier();
        const name = component.getAttribute('name');

        // Visualização //
        const view = component.querySelector('view');
        const viewAttributes = [].slice.call(view.attributes);
        const viewCompiled = this.__compileView(identifier, view, data);
        viewCompiled.setAttribute('component-name', name);
        viewAttributes.forEach(attr => { viewCompiled.setAttribute(attr.name, attr.value); });



        // viewCompiled.setAttribute('class', attrClass);

        // Estilo //
        const style = component.querySelector('style');
        if (style) {
            const styleCompiled = this.__compileStyle(identifier, style, data);
            viewCompiled.appendChild(styleCompiled);
        }

        container.appendChild(viewCompiled);
        return viewCompiled;

    }

    // RenderEngine.prototype.__renderBefore = function (component, container, data) {

    // }





    RenderEngine.prototype.__compileView = function (identifier, view, data) {

        const element = document.createElement('div');
        element.setAttribute('component-identifier', identifier);


        const viewContent = view.innerHTML.toString()
            .replaceAll('&gt;', '>')
            .replaceAll('{{', '${ ')
            .replaceAll('}}', ' }')


        // Scope //
        const keys = Object.keys(data);
        const values = Object.values(data);
        const $scope = {
            ...data,
            $setScope: (key, value) => {
                $scope[key] = value;
            }
        }

        // Compilador //
        const _functionBody = this.__compileFunctionContent(identifier, viewContent);
        const _function = new Function(['$scope', ...keys], _functionBody);
        const _functionResult = _function($scope, ...values);

        element.innerHTML = _functionResult;
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

        const keys = Object.keys($scope);
        keys.forEach(K => { if (K['0'] == '$') { delete $scope[K] } })

        const mouseEvents = ['onclick', 'onmouseover', 'onmouseout', 'onmousedown', 'onmouseup', 'onmousemove'];
        const keyboardEvents = ['onkeydown', 'onkeyup', 'onkeypress'];
        const formEvents = ['onfocus', 'onsubmit', 'onblur', 'onchange'];
        const events = [...mouseEvents, ...keyboardEvents, ...formEvents];


        events.forEach(event_name => {

            component.querySelectorAll(`[${event_name}]`).forEach(element => {

                const attrEvent = element.getAttribute(event_name);
                const eventListener = event_name.substring(2);
                const _function = $scope[attrEvent] || eval(attrEvent);
                const isFunction = (typeof _function === 'function');
                if (attrEvent && isFunction) {
                    element.removeAttribute(event_name);
                    element.addEventListener(eventListener, (e) => { return _function(e, component, $scope); });
                }

            });

        });      

    }

    RenderEngine.prototype.__compileFunctionContent = function (identifier, content) {

        return ` 

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