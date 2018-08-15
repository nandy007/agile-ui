!(function (factory) {
    const aui = factory();
    if ((typeof module === "object" || typeof module === "function") && typeof module.exports === "object") {
        module.exports = aui;
    }
    
    const modName = window.__AGILE_UI_NAME__;
    const modId = window.__AGILE_UI_ID__ || 'aui';

    if (typeof window.define === "function" && window.define.amd) {
        //window.define(modName, [], function () {
        const params = [function () {
            return aui;
        }];
        if(modName) params.unshift(modName);
        window.define.apply(window.define, params);
    }

    if(!window[modId]) window[modId] = aui;

})(function(){
    return {
        'AuiComponent': require('./libs/AuiComponent')
    };
});