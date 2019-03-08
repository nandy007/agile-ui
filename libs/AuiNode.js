

(function (factory) {
    const AuiNode = factory();
    module.exports = AuiNode;
})(function () {

    function addEvent (elem, type, callback) {
        elem.addEventListener ?
                elem.addEventListener(type, callback, false) :
                elem.attachEvent('on' + type, callback);
    }

    function lisetenDom(dom){
        if(dom){
            addEvent(dom, 'DOMNodeInserted', function(e){
                // var target = e.target;
                var target = e.relatedNode;
                AuiNode.create(target);
            });
            addEvent(dom, 'DOMNodeRemoved', function(e){
                var target = e.relatedNode;
                AuiNode.remove(target);
            });
        }else{
            addEvent(window, 'load', function(e){
                lisetenDom(document.querySelector('body'));
            });
        }
    }
    

    

    function AuiNode(el, anestor) {

        this.el = el;
        this.$anestor = anestor;

        this.create();

    }

    AuiNode.nodes = {};

    AuiNode.cache = function(anestor){
        var tag = (anestor.fullTag||'').toLowerCase();
        if(!tag) {
            tag = 'aui-' + anestor.tag.toLowerCase();
        }

        console.debug(tag)
            
        AuiNode.nodes[tag] = anestor;
    };

    AuiNode.getTag = function(el){
        var tag = (el.tagName||'').toLowerCase();
        return tag;
    };

    AuiNode.getEls = function(el){
        try{
            if(!el) return [];
            var selectors = [];
            for(var k in AuiNode.nodes){
                selectors.push(k);
            }
            var els = Array.prototype.slice.call((el.querySelectorAll && el.querySelectorAll(selectors.join(',')))||[]);

            var tagName = AuiNode.getTag(el);
            var anestor = AuiNode.nodes[tagName];
            if(anestor) els.unshift(el);
            return els;
        }catch(e){
            return [];
        }
        
    };

    AuiNode.create = function(el){
        
        var els = AuiNode.getEls(el);

        for(var i=0, len=els.length;i<len;i++){
            var curEl = els[i];
            if(!curEl) continue;
            if(curEl.auiNode){
                curEl.auiNode.emit('adopted', []);
                continue;
            }
            var tagName = AuiNode.getTag(curEl);
            var anestor = AuiNode.nodes[tagName];
            if(!anestor) continue;
            new AuiNode(curEl, anestor);
        }

    };

    AuiNode.remove = function(el){

        var els = AuiNode.getEls(el);

        for(var i=0, len=els.length;i<len;i++){
            var curEl = els[i];
            if(!curEl) continue;
            var auiNode = curEl.auiNode;
            if(!auiNode) continue;
            auiNode.emit('detached', []);
        }
    };

    AuiNode.prototype = {
        bindModule: function() {
            const Component = this.$anestor, el = this.el;

            const component = el.component = typeof Component === 'function' ? new Component(el) : {};

            el.auiNode = this;

            component.template = Component.template || '';
            component.$el = el;

            // this.createdCallback();
        },
        emit: function(funcName, args, cb, isAsync) {
            const component = this.el.component, func = component[funcName];
            if(!(cb||func)) return;
            var _func = function () {
                cb && cb();
                func && func.apply(component, args);
            };

            if(isAsync){
                setTimeout(_func, 1);
            }else{
                _func();
            }
        },
        _emit: function(){
            var funcName = arguments[0];
            if(!this._queue) this._queue = [];
            if(funcName!=='created' && !this.isCreated){
                this._queue.push(arguments);
                return;
            }else{
                this._emit.apply(this, arguments);
                var queue;
                while(queue=(this._queue||[]).shift()){
                    this._emit.apply(this, arguments);
                }
            }
        },
        createdCallback: function(){
            
            const el = this.el, _this = this;
            const template = el.component.template, createdSync = el.component.createdSync;
            const isAsync = typeof createdSync==='undefined'?true:!createdSync;
            this.emit('created', [], function () {
                if (template) {
                    const $fragment = document.createDocumentFragment();
                    Array.from(el.childNodes).forEach(function ($child) {
                        $fragment.appendChild($child);
                    });

                    el.innerHTML = template;
                    const $child = el.querySelector('child');
                    if ($child) {
                        el.slotParent = $child.parentNode;
                        $child.parentNode.replaceChild($fragment, $child);
                    }
                }
                _this.isCreated = true;
            }, false);
            _this.attachedCallback();
        },
        attachedCallback: function(){
            this.emit('attached', []);
        },
        create: function(){
            this.bindModule();
            this.attributeChangedObserver();
            this.createdCallback();
        },
        attributeChangedObserver: function(){
            var _this = this, el = this.el;
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;//浏览器兼容
            var config = { attributes: true, attributeFilter: this.$anestor.observedAttributes }//配置对象
            var observer = new MutationObserver(function(mutations) {//构造函数回调
                mutations.forEach(function(record) {
                    if(record.type == "attributes"){//监听属性
                        _this.emit('attributeChanged', [record.attributeName, record.oldValue, el.getAttribute(record.attributeName)]);
                    }
                    // if(record.type == 'childList'){//监听结构发生变化
                    //     //do any code
                    // }
                });
            });
            observer.observe(el, config);
            
        }
    };

    lisetenDom(document.querySelector('body'));

    return AuiNode;
});