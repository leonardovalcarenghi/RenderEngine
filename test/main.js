
var Render = new RenderEngine();

window.onload = function () {

    const containerSecondary = document.getElementById('ContainerSecondary');
    const mainContainer = document.getElementById('MainContainer');
    Render.SetPageContainer(mainContainer);

    // Definir base de url:
    Render.SetBase('.');

    // Renderizar Página:
    Render.Page('/pages/page01');
    // Render.Page('/pages/page01', containerSecondary);

    // Renderizar Componente:
    // Render.Component();


    window.onhashchange = function () {
        const hash = window.location.hash.substring(1);

        if (hash == 'pagina-01') {
            Render.Page('/pages/page01');
        }

        if (hash == 'pagina-02') {
            Render.Page('/pages/page02');
        }

        if (hash == 'pagina-03') {
            Render.Page('/pages/page03');
        }
    }

}