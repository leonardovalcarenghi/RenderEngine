(function (global, factory) {
    global.Valcom = factory();
    global['$'] = global.Valcom;
}(this, (function () {

    const _this = Valcom.prototype;
    let _query = "";
    let _queryResults = [];

    function Valcom(query) {
        _query = query;
        _queryResults = [...document.querySelectorAll(query)];

        return _this;

    }

    // Exibir / Ocultar / Remover //
    Valcom.prototype.Show = function () {
        _queryResults.forEach(element => { element.style.display = "block"; });
        return _queryResults;
    }

    Valcom.prototype.Hide = function () {
        _queryResults.forEach(element => { element.style.display = "none"; });
        return _queryResults;
    }

    Valcom.prototype.Remove = function () {
        _queryResults.forEach(element => { element.remove(); });
        return _queryResults;
    }

    // Personalização //

    Valcom.prototype.SetColor = function (color = 'black') {
        _queryResults.forEach(element => { element.style.color = color || "black"; });
        return _queryResults;
    }

    Valcom.prototype.SetBackgroundColor = function (color = 'white') {
        _queryResults.forEach(element => { element.style.backgroundColor = color || "white"; });
        return _queryResults;
    }

    Valcom.prototype.SetFontSize = function (size = '14px') {
        _queryResults.forEach(element => { element.style.fontSize = size || "14px"; });
        return _queryResults;
    }



    // Class //
    Valcom.prototype.AddClass = function (className) {
        _queryResults.forEach(element => { element.classList.add(className); });
        return _queryResults;
    }

    Valcom.prototype.RemoveClass = function (className) {
        _queryResults.forEach(element => { element.classList.remove(className); });
        return _queryResults;
    }


    // Atributos //
    Valcom.prototype.GetAttribute = function (attrName) {
        const results = _queryResults.map(element => element.getAttribute(attrName));
        return results ? results[0] : null;
    }

    Valcom.prototype.SetAttribute = function (attrName, value) {
        _queryResults.forEach(element => { element.setAttribute(attrName, value); });
        return _queryResults;
    }

    Valcom.prototype.RemoveAttribute = function (attrName) {
        _queryResults.forEach(element => { element.removeAttribute(attrName); });
        return _queryResults;
    }



    return Valcom;


})));

