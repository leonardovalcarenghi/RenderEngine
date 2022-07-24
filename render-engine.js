(function (global, factory) {
    global.RenderEngine = factory();
}(this, (function () {

    // Conteiner principal para renderização das páginas:
    var PageContainer = document.createElement('div');

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
            console.log('erro ao buscar script');
        }

        return this;
    };

    // Renderizar Componente:
    RenderEngine.prototype.Component = function () {
        return this;
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