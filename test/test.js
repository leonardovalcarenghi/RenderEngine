alert('carregou')

function Component(props) {


    function componentDidMount() {
        console.log("COMPONENTE MONTADO E RENDERIZADO");
    }

    function componentDidUpdate() {
        console.log("COMPONENTE ATUALIZADO");
    }

    function clicar() {

    }

    return (
        <div>
            <GamepadButton></GamepadButton>
        </div >
    )

}




function useState(initialValue = null) {

    let stateValue = { initialValue };

    return [stateValue, (value) => { stateValue = value; }];

}

const _newIdentifier = function () {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
        .replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        })
        .replaceAll("-", "");
};

const useState = (initialValue) => {

    const identifier = _newIdentifier();
    window[identifier] = initialValue;
    
    const setValue = newValue => window[identifier] = newValue;
    return [window[identifier], setValue];

}

// let functionInString = Component.toString();
// let functionContent = functionInString.slice(0, functionInString.lastIndexOf("return"));
// let returnFunctionBody = functionInString.slice(functionInString.indexOf("return ("), functionInString.lastIndexOf(")") + 1);

// let newFunction = `${functionContent} return ``${functionInString}`` `;