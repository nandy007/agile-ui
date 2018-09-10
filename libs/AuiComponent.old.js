

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

    function createElement(anestor){
        var tagName = formateName(anestor.tag);
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
        
        var pp = Object.create(anestor.extendElement.prototype);
        pp.$anestor = anestor;
        pp.bindModule = function() {
            const Component = this.$anestor;

            const component = this.component = typeof Component === 'function' ? new Component(this) : {};

            component.template = Component.template || '';
            component.$el = this;

            // this.createdCallback();
        };
        pp.emit = function(funcName, args, cb, isAsync) {
            const component = this.component, func = component[funcName];
            if(!(cb||func)) return;
            var _func = function () {
                cb && cb();
                func && func.apply(component, args);
            };

            if(isAsync){
                setTimeout(_func, 1);
            }else{
                _func();
            };
        };

        // 创建元素实例
        pp.createdCallback= function(...args) {
            this.bindModule();
            const _this = this;
            const template = _this.component.template, createdSync = _this.component.createdSync;
            const isAsync = typeof createdSync==='undefined'?true:!createdSync;
            this.emit('created', args, function () {

                if (template) {

                    const $fragment = document.createDocumentFragment();
                    Array.from(_this.childNodes).forEach(function ($child) {
                        $fragment.appendChild($child);
                    });

                    _this.innerHTML = template;
                    const $child = _this.querySelector('child');
                    if ($child) {
                        $child.parentNode.replaceChild($fragment, $child);
                    }
                }

            }, isAsync);
        };

        // 向文档插入实例
        pp.attachedCallback= function(...args) {
            this.emit('attached', args);
        };
        // 从文档中移除实例
        pp.detachedCallback = function(...args) {
            this.emit('detached', args);
        };
        // 从旧文档移到新文档中
        // pp.adoptedCallback = function(...args){//oldDocument, newDocument
        //     this.emit('adopted', args);
        // };
        // 添加，移除，或修改一个属性
        pp.attributeChangedCallback = function(...args) {//attrName, oldVal, newVal
            this.emit('attributeChanged', args);
        };
        
        document.registerElement(tagName, { prototype: pp, extends: extendTag });

        return {
            isCreated: true
        };
    }

    var AuiComponent = {
        create: function(anestor, template){
            if(!anestor.tag) anestor.tag = anestor.name;
            if(!anestor.template) anestor.template = template || '';
            var aui = createElement(anestor);
            return aui.isCreated;
        }
    };


    return AuiComponent;
})