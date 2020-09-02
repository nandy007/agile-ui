(function (global) {

    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    
    class AuiShell extends HTMLElement {

        constructor() {
            super();
            this.init();
        }

        init(){
            const cls = AuiMng.getCls(this.tagName);
            const component = new cls(this);
            this.component = component;
        }

        // 向文档插入实例
        connectedCallback(...args) {
            this.component._initComponent();
            this.component._emit('attached', args);
        }
        // 从文档中移除实例
        disconnectedCallback(...args) {
            this.component._emit('detached', args);
        }
        // 从旧文档移到新文档中
        adoptedCallback(...args){//oldDocument, newDocument
            this.component._emit('adopted', args);
        }
        // 添加，移除，或修改一个属性
        attributeChangedCallback(...args) {//attrName, oldVal, newVal
            this.component._emit('attributeChanged', args);
        }

    }

    const AuiMng = {
        _cache: {},
        register(tagName, cls){
            tagName = tagName.toLowerCase();
            AuiMng._cache[tagName] = cls;
            customElements.define(tagName, AuiShell);
        },
        getCls(tagName){
            tagName = tagName.toLowerCase();
            return AuiMng._cache[tagName];
        }
    };


    class AuiComponent {

        static _styleCache = {};

        constructor(el){
            this.el = el;
        }

        get tagName(){
            if(this._tagName) return this._tagName;
            return this._tagName = this.el.tagName.toLowerCase();
        }

        _emit(evtName, args){
            this[evtName] && this[evtName](...(args||[]));
        }

        _observer(dom, callback, options){
            const observer = new MutationObserver(callback);
            observer.observe(dom, options || {
                // childList: true, // 子节点的变化
                // attributes: true, // 属性的变化
                // subtree: true, // 后代节点的变化
            });
            return observer;
        }

        _defineProperty(obj, prop){
            for(let name in prop){
                let options = prop[name];
                if(options && !options.hasOwnProperty('configurable')){
                    options.configurable = true;
                }else{
                    options = {};
                }
                Object.defineProperty(obj, name, options);
            }
        }

        _observeChildren(){
            const observer = this._observer(this.el, (mutations)=>{
                // observer.disconnect();
                mutations.forEach(record => {
                    if(record.type==='childList'){
                        this._initChildren(record.addedNodes);
                    }
                });
            }, {
                childList: true
            });
        }

        _isTrueChild(node){
            // const el = this.el, childNodes = Array.prototype.slice.call(this.origin.childNodes, 0);
            // const curIndex = childNodes.indexOf(node);
            // const endIndex = childNodes.indexOf(el._end);
            // return curIndex > endIndex;
            return node._ignore ? false : true;
        }

        _initChildren(nodes){
            const isAdd = this._noChild ? false : true;
            const fragment = isAdd && document.createDocumentFragment();
            (nodes || []).forEach(node=>{
                if(!this._isTrueChild(node)) return;
                if(isAdd){
                    fragment.appendChild(node);
                }else{
                    this.removeChild(node);
                }
            });
            if(fragment){
                this.childEl.appendChild(fragment);
            }
        }

        _initComponent(){
            if(this.isInit){
                return;
            }

            this.isInit = true;

            this._createStyle();

            this.delay().then(()=>{
                this._createUI();
                this._hook();
                this._emit('created');
            });
        }

        _createStyle(){
            const style = this.styleTemplate && this.styleTemplate();
            if(!style) return;
            if(AuiComponent[this.tagName]) return;
            const headEl = document.querySelector('head');
            const styleEl = document.createElement('style');
            styleEl.setAttribute('type', 'text/css');
            styleEl.setAttribute('refer', this.tagName);
            if(styleEl.styleSheet){
                styleEl.styleSheet.cssText = style;
            }else{
                styleEl.appendChild(document.createTextNode(style));
            }
            headEl.appendChild(styleEl);
            AuiComponent[this.tagName] = true;
        }

        delay(ms) {
            return new Promise(function (resolve) {
                setTimeout(resolve, ms);
            });
        }

        _createUI(){

            const uiTemplate = this.uiTemplate && this.uiTemplate();

            if(!uiTemplate) return this._noUI = true;

            const el = this.el;

            let tplEl = this.tplEl = document.createElement('div');
            tplEl.innerHTML = uiTemplate;
            let childEl = tplEl.querySelector('child');
            this.childEl = childEl;


            this.render && this.render(tplEl);

            childEl = this.childEl = this.tplEl.querySelector('child');

            let innerEl, innerFragment = document.createDocumentFragment();
            while(innerEl=this.tplEl.firstChild){
                innerFragment.append(innerEl);
            }
            
            if(childEl){
                var curEl, curFragment = document.createDocumentFragment();
                while(curEl = el.firstChild){
                    curFragment.append(curEl);
                }
                childEl.append(curFragment);
            }else{
                el.innerHTML = '';
            }
            el.append(innerFragment);

            
        }

        get _noChild(){
            return this.childEl ? false : true;
        }

        _hookNoUI(){

        }

        _hook(){


            if(this._noUI){
                this._hookNoUI();
                return;
            }

            if(this._noChild){
                return;
            }

            const el = this.el;

            const origin = {};

            const originArr = [
                'appendChild',
                // 'cloneNode',
                'hasChildNodes',
                // 'insertAfter',
                // 'insertBefore',
                // 'replaceChild',
                // 'innerHTML',
                // 'textContent',
                // 'parentNode',
                'childNodes',
                'children',
                'firstChild',
                'lastChild'
            ];

            originArr.forEach(item => {
                origin[item] = el[item];
            });

            const childEl = this.childEl;

            el.appendChild = (...args)=>{
                return childEl.appendChild(...args);
            };
            el.hasChildNodes = (...args)=>{
                return childEl.hasChildNodes(...args);
            };
            // el.insertAfter = (...args)=>{
            //     return childEl.insertAfter(...args);
            // };
            // el.insertBefore = (...args)=>{
            //     return childEl.insertBefore(...args);
            // };
            // el.replaceChild = (...args)=>{
            //     return childEl.replaceChild(...args);
            // };

            this._defineProperty(el, {
                'childNodes': {
                    get(){
                        return childEl.childNodes;
                    }
                },
                'children': {
                    get(){
                        return childEl.children;
                    }
                },
                'firstChild': {
                    get(){
                        return childEl.firstChild;
                    }
                },
                'lastChild': {
                    get(){
                        return childEl.lastChild;
                    }
                }

            });

            this.origin = origin;

            // this._hookChild();
            // this._hookParent();

        }

        _hookChild(){
            const originArr = [
                'cloneNode',
                // 'tagName',
                'parentNode'
            ];
            const el = this.el, childEl = this.childEl;

            const childOrigin = {};

            originArr.forEach(item => {
                childOrigin[item] = childEl[item];
            });

            childEl.cloneNode = (...args)=>{
                return el.cloneNode(...args);
            };


            this._defineProperty(childEl, {
                'tagName': {
                    get(){
                        return el.tagName;
                    }
                },
                'parentNode': {
                    get(){
                        return el.parentNode;
                    }
                }
            });
            
            this.childOrigin = childOrigin;

            this._hookParent();
            
        }

        _hookParent(){
            const el = this.el, childEl = this.childEl;

            const prop = 'parentNode', origin = `_${prop}Origin`;
            
            this._observer(childEl, (mutations)=>{
                mutations.forEach(record => {
                    if(record.type==='childList'){
                        record.addedNodes.forEach((node)=>{
                            node[origin] = node[prop];
                            this._defineProperty(node, {
                                'parentNode': {
                                    get(){
                                        return el;
                                    }
                                }
                            });
                        });
                        record.removedNodes.forEach((node)=>{
                            this._defineProperty(node, {
                                'parentNode': null
                            });
                        })
                    }
                });
            }, {
                childList: true
            });
        }
    }

    global.AuiComponent = AuiComponent;
    global.AuiMng = AuiMng;

})(window);