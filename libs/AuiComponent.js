

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

        this.$anestor = anestor;

        this.isCreated = false;

        this.setTag();

        this.addStyle();

        this.initExtendElement();

        this.bind();

        this.hookGlobal();
    }

    AuiComponent.create = function (anestor, template) {
        var useOld = typeof anestor.useOld==='undefined'?AuiComponent.useOld:anestor.useOld;
        if(useOld){
            return require('./AuiComponent.old').create(anestor, template);
        }
        if(!anestor.tag) anestor.tag = anestor.name;
        if(!anestor.template) anestor.template = template || '';
        if(anestor.isNode){
            var AuiNode = require('./AuiNode');
            return AuiNode.cache(anestor);
        }
        var aui = new AuiComponent(anestor);
        return aui.isCreated;
    };

    AuiComponent.isEs5 = !window.customElements ? true : false;
    AuiComponent.useOld = false;

    AuiComponent.cssPretreatment = {
        text: function(content, cb){
            cb(content);
        }
    };

    AuiComponent.addCssPretreatment = function(k, func){
        AuiComponent.cssPretreatment[k] = func;
    };

    AuiComponent.prototype = {
        createName: function(){
            // 把所有-字母转为字母大写
            return this.getTag().replace('aui', '').replace(/\-(.)/g, function(s,s1){
                return s1.toUpperCase();
            });
        },
        hookGlobal: function(){
            if(typeof window==='object'){
                if(!window.auicomponents) window.auicomponents = {};
                var name = this.createName();
                auicomponents[name] = this.$anestor;
            }
        },
        getTag: function(){
            return this._tag;
        },
        setTag: function(){
            const anestor = this.$anestor;
            this._tag = anestor.fullTag&&anestor.fullTag.indexOf('-')>-1?anestor.fullTag.toLowerCase() : formateName(anestor.fullTag || anestor.tag);
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

        initExtendElement: function(){
            var anestor = this.$anestor;
            var extendElement = anestor.extendElement, extendTag;
            if(typeof extendElement==='string'){
                extendTag = extendElement;
                let ele = document.createElement(extendTag);
                anestor.extendElement = (new Function(`return ${ele.constructor.name};`))();
                ele = null;
            }else if(!extendElement){
                anestor.extendElement = HTMLElement;
            }
            
            if(!extendTag){
                extendTag = anestor.extendElement.tag;
            }

            this.extendTag = extendTag;
        },

        bind: function () {

            var tag = this.getTag();

            if (!tag || this.isCreated) return;

            var anestor = this.$anestor;

            var XElement = require('./XElement')(AuiComponent.isEs5)(anestor);

            // 如果组件已经被定义则不重复定义
            if (customElements.get(tag)) return;
            // 否则定义组件
            customElements.define(tag, XElement, {extends: this.extendTag});

            this.isCreated = true;
        }
    };

    require('@webcomponents/custom-elements');

    return AuiComponent;
});