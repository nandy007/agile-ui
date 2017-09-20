(function (factory) {
    const aui = factory();
    if ((typeof module === "object" || typeof module === "function") && typeof module.exports === "object") {
        module.exports = aui;
    }
    
    const modName = window.__AGILE_UI_ID__ || 'aui';

    if (typeof window.define === "function" && window.define.amd) {
        window.define(modName, [], function () {
            return aui;
        });
    }

    if(!window[modName]) window[modName] = aui;

})(function(){
    return {
        'AuiComponent': require('./libs/AuiComponent')
    };
})