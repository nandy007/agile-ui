

(function (factory) {
    const AuiComponent = factory();
    module.exports = AuiComponent;
})(function () {
    function formateName(name) {
        if (!name) return '';
        name = name.toLowerCase();
        if (name.indexOf('aui-') === 0) {
            return name;
        }
        return 'aui-' + name;
    }

    function AuiComponent(anestor) {
        this.isCreated = false;

        this.tag = anestor.tag;

        this.$anestor = anestor;

        this.addStyle();

        this.bind();
    }

    AuiComponent.create = function (anestor) {
        var aui = new AuiComponent(anestor);
        return aui.isCreated;
    };

    AuiComponent.isEs5 = !window.customElements ? true : false;

    AuiComponent.cssPretreatment = {
        text: function(content, cb){
            cb(content);
        }
    };

    AuiComponent.addCssPretreatment = function(k, func){
        AuiComponent.cssPretreatment[k] = func;
    };

    AuiComponent.prototype = {
        get tag() {
            return this._tag;
        },

        set tag(name) {
            this._tag = formateName(name);
        },

        addStyle: function () {
            var style = this.$anestor.style;
            if (!style) return;
            var type, content = style, cssPretreatment;
            if(typeof style==='object'){
                type = style.type;
                content = style.content || '';
            }
            cssPretreatment = AuiComponent.cssPretreatment[type] || AuiComponent.cssPretreatment['text'];

            cssPretreatment.call(this, content, function(css){
                var $style = document.createElement('style');
                $style.type = 'text/css';
                $style.innerHTML = css;
                document.getElementsByTagName('HEAD').item(0).appendChild($style);
            });
        },

        bind: function () {

            if (!this.tag || this.isCreated) return;

            var anestor = this.$anestor;

            var XElement = require('./XElement')(AuiComponent.isEs5)(anestor);

            // 如果组件已经被定义则不重复定义
            if (customElements.get(this.tag)) return;
            // 否则定义组件
            customElements.define(this.tag, XElement);

            this.isCreated = true;
        }
    };

    require('@webcomponents/custom-elements');

    return AuiComponent;
})