// const useState = (defaultValue = null) => {

//     const _newGuid = function () {
//         return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//             var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//             return v.toString(16);
//         });
//     }



//     let guid = _newGuid().replaceAll('-', '');
//     console.log('guid', guid);
//     window[guid] = {}

//     // const state = {};
//     let _this = this;
//     let _value = defaultValue;


//     Object.defineProperty(window, guid, {
//         get() {
//             console.log("acessou var value");
//             return _value;
//         },
//         set(value) {
//             console.log("alterou a var");
//             _value = value;
//         }
//     });


//     _set = (value) => {
//         window[guid] = value;
//         return value;
//     }


//     // Object.defineProperty(object1, 'property1', {
//     //     value: 42,
//     //     writable: false
//     // });



//     // _value = (ddd) => {
//     //     return obj.value;
//     // }


//     // const dataaaa = {
//     //     get latest() {
//     //         return obj.value;
//     //     }
//     // }

//     return [((x) => { return x })(window[guid]), _set];

// }


// Object.defineProperty(window, 'value', {
//     get() {
//         console.log("acessou var window");
//         return "leonardo value";
//     }
// });



// const [nome, setNome] = useState('leonardo');
// // const [variavel2, setVariavel2] = useState('leonardo2');


// // console.log("variavel:", variavel);

// // setVariavel('abcde');


// // console.log("variavel de novo:", variavel)

// async function _getComponent(path) {
//     const data = await fetch(`${"."}/${path}.html`).then(data => { return data.text(); });
//     const element = document.createElement('div');
//     element.innerHTML = data;
//     const component = element.querySelector('component');
//     const view = component.querySelector('view');
//     const style = component.querySelector('style');
//     return [view, style];
// }

// async function $ImportComponent(path) {


//     const [view, style] = await _getComponent(path);

//     // console.log("component", component);
//     console.log("view", view);
//     console.log("style", style);

//     return {
//         view,
//         style,
//         $Render: function (container, data = {}) {

//             _render(data, view, style, container);


//             const results = [];

//             return results;
//         }
//     };
// }


// function _render(data, view, style, container) {

//     data["identifier"] = "123";
//     view = view.cloneNode(true);
//     style = style.cloneNode(true);

//     _compileElements(data, view);
//     _compileStyle(data, style);

// }


// function _compileElements(data, view) {

//     const elements = [...view.querySelectorAll("*")];
//     elements.forEach(ELEMENT => { _compileElement(data, ELEMENT); });

// }


// function _compileElement(data, element = document.createElement("div")) {

//     console.log("    element",     element);

//     const attrs = [...element.attributes];
//     console.log("    attrs",     attrs);

//     attrs.forEach(ATTR=>{

//         console.log("-----> ATTR",     ATTR);

//     })


//     const elementHTML = element.outerHTML;


   
//     console.log("    element.children",     element.children);
//     console.log("    element.childNodes",     element.childNodes);

//     const keys = Object.keys(data);
//     const values = Object.values(data);
//     const keysInElement = [];

//     keys.forEach(KEY => {
//         if (elementHTML.includes(KEY)) { keysInElement.push(KEY); }
//     });

//     console.log('keysInElement', keysInElement);
//     console.log("----------");



//     const $scope = {
//         ...data,
//         $set: (key, value) => {

//         }
//     };

//     const _functionBody = __compileFunctionContent(elementHTML);
//     const _function = new Function(['$scope', ...keys], _functionBody);
//     const htmlCompiled = _function($scope, ...values);
//     // console.log("htmlCompiled", htmlCompiled);

//     element.innerHTML = htmlCompiled;
//     return [element, $scope];
// }

// function _compileStyle(data, style) {

// }




// window.addEventListener("load", async function () {



//     const cliquei = function (e, $scope, component) {
//         console.log(e, $scope, component);
//         console.log("Clicou no botão");
//     }

//     const container = document.getElementById("MainContainer");
//     const data = { fulaninho: 'leonardo', cliquei };
//     const component = await $ImportComponent("/components/component");
//     console.log("component impoted", component);

//     const results = component.$Render(container, data);
//     console.log("results", results);

// });




// function RenderComponent(component = document.createElement("div"), data = {}) {

//     component = component.cloneNode(true);


//     _CompileElements(component, data);
//     __initializeEventsInComponent(component, data);


//     const $scope = {

//         set: (key, value) => {

//             let KEY = data[key];
//             if (typeof (KEY) === "string") {
//                 data[key] = value;
//                 _CompileElements(component, data);
//             }

//         }

//     }



//     document.getElementById("MainContainer").append(component);
//     return [$scope, component];

// }



// function _CompileElements(component = document.createElement("div"), data) {

//     const elements = [...component.querySelectorAll("*")];
//     elements.forEach(ELEMENT => {

//         const [element, $scope] = _compile(ELEMENT, data);
//         // console.log("element", element)
//         // console.log("$scope", $scope)

//     });

// }


// function _compile(element = document.createElement("div"), data) {

//     const html = element.innerHTML;
//     const keys = Object.keys(data);
//     const values = Object.values(data);
//     const $scope = {
//         ...data
//     };

//     const _functionBody = __compileFunctionContent(html);
//     const _function = new Function(['$scope', ...keys], _functionBody);
//     const htmlCompiled = _function($scope, ...values);
//     // console.log("htmlCompiled", htmlCompiled);

//     element.innerHTML = htmlCompiled;
//     return [element, $scope];

// }



// function __compileFunctionContent(content) {
//     content = content.toString()
//         .replaceAll('&gt;', '>')
//         .replaceAll('{{', '${ ')
//         .replaceAll('}}', ' }')

//     return `    return \`${content}\`;  `;

// }


// function __initializeEventsInComponent(component, $scope) {

//     const keys = Object.keys($scope);
//     // keys.forEach(K => { if (K['0'] == '$') { delete $scope[K] } })

//     const mouseEvents = ['onclick', 'onmouseover', 'onmouseout', 'onmousedown', 'onmouseup', 'onmousemove'];
//     const keyboardEvents = ['onkeydown', 'onkeyup', 'onkeypress'];
//     const formEvents = ['onfocus', 'onsubmit', 'onblur', 'onchange'];
//     const events = [...mouseEvents, ...keyboardEvents, ...formEvents];


//     events.forEach(event_name => {

//         component.querySelectorAll(`[${event_name}]`).forEach(element => {


//             const eventRef = element.getAttribute(event_name);
//             const eventType = event_name.substring(2);
//             const eventFunction = $scope[eventRef];
//             const isFunction = (typeof eventFunction === 'function');
//             element.removeAttribute(event_name);

//             // console.log("eventRef", eventRef);
//             // console.log("eventType", eventType);
//             // console.log("eventFunction", eventFunction);
//             // console.log("isFunction", isFunction);
//             // console.log("-------------------------------------");

//             if (isFunction) {
//                 element.addEventListener(eventType, (event) => { return eventFunction(event, component, $scope); });
//             }

//         });

//     });

// }