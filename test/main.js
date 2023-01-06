
var Container;
var Render = new RenderEngine();



window.onload = async function () {

    Container = document.getElementById('MainContainer');

    Render.SetPageContainer(Container);     // container principal da página.
    Render.SetBase('.');                    // definir base de url:

    Routing();
}



window.onhashchange = function () {
    Routing();
}


async function Routing() {
    const hash = window.location.hash.substring(1);

    if (hash == 'pagina-01') {
        // Renderizar Página:
        await Render.Page('/pages/page01');
        Page01();
    }

    if (hash == 'pagina-02') {
        // Renderizar Página:
        await Render.Page('/pages/page02');
        Page02();
    }

    if (hash == 'pagina-03') {
        // Renderizar Página:
        Render.Page('/pages/page03');
        Page03();
    }
}


async function Page01() {

    // Renderizar Componente:    
    const card = await Render.ImportComponent('/components/card');

    const abc = 'Teste scope';

    const onClick = (e, component, $scope) => {
        console.log('Informações', $scope);
        console.log('abc', abc);
    }

    const onKeyUp = (e, component, $scope) => {
        component.querySelector('h1').innerHTML = e.target.value;
    }

    const events = { onClick, onKeyUp }

    const list = [
        {
            id: 1,
            name: 'Leonardo',
            lastName: 'Valcarenghi',
            email: 'leonardo@email.com',
            age: 24,
            gender: 'male',
            height: 184,
            weight: 112,
            ...events
        },
        {
            id: 2,
            name: 'Rafael',
            lastName: 'Silva',
            email: '',
            ...events
        },
        {
            id: 3,
            name: 'João',
            lastName: 'Fernandes',
            email: 'joao@email.com.br',
            ...events
        },
    ];

    const elements = card.render(Container, list);
    console.log("elements", elements)
}

async function Page02() {

    const postComponent = await Render.ImportComponent("/components/post");
    const imageComponent = await Render.ImportComponent("/components/image");
    const posts = [{ fulaninho: 'Leonardo' }, { fulaninho: 'Rafael' }].map(x => { return { ...x, imageComponent } });
    postComponent.render(Container, posts);


}


async function Page03() {
    const component = await Render.ImportComponent("/components/component");
    const data1 = { pessoa: "LEONARDO" };
    const data2 = { pessoa: "AMANDA" };
    const data3 = { pessoa: "JOÃO" };
    const list = [data1, {}, data2, data3, {}, {}];
    component.render(Container, list);

}

// var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'))
// var dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
//     return new bootstrap.Dropdown(dropdownToggleEl)
// })



function NewGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


String.prototype.toPascalCase = function () {
    return this.replace(/[a-zA-ZÀ-ü]+/g, (word) => {
        return word.length > 2 ? (word[0].toUpperCase() + word.slice(1).toLowerCase()) : word.toLowerCase();
    }).replace('_', ' ');
};

String.prototype.isNullOrEmpty = function () {
    return (!this || this.trim() === '') ? true : false;
};

String.prototype.onlyNumbers = function () {
    return this.replace(/[^0-9]/g, '');
}


function teste() {
    arguments['abc'] = '123'
    console.log('arguments', arguments);
}
