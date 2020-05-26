(function (factory) {
    
    module.exports = function(util){
        const XElement = factory(util);
        return XElement;
    };
})(function (util) {
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    function IElement(anestor) {
        this.anestor = anestor;  // util.getAnestor(anestor);;
    }

    IElement.prototype = {
        // bindModule: function ($el) {
        //     const Component = this.$anestor = util.getAnestor(anestor);
        //     const component = $el.component = typeof Component === 'function' ? new Component($el) : {};
        //     component.template = Component.template || '';
        //     this.$el = component.$el = $el;
        //     this.createdCallback();
        // },
        // emit: function (funcName, args, cb, isAsync) {
        //     const component = this.$el.component, func = component[funcName];
        //     if(!(cb||func)) return;
        //     var _func = function () {
        //         cb && cb();
        //         func && func.apply(component, args);
        //     };

        //     if(isAsync){
        //         setTimeout(_func, 1);
        //     }else{
        //         _func();
        //     }
            
        // },
        // createdCallback: function () {
        //     const _this = this.$el;
        //     const template = _this.component.template, createdSync = _this.component.createdSync;
        //     const isAsync = typeof createdSync==='undefined'?true:!createdSync;
        //     this.emit('created', arguments, function () {
        //         if (template) {
        //             util.createComp(_this, template);
        //         }
        //     }, isAsync);
        // },
        create: function () {
            var ielement = this;
            var SimpleElement = function (_HTMLElement) {
                _inherits(SimpleElement, _HTMLElement);

                function SimpleElement() {
                    _classCallCheck(this, SimpleElement);

                    var _this = _possibleConstructorReturn(this, (SimpleElement.__proto__ || Object.getPrototypeOf(SimpleElement)).call(this));
                    
                    _this.bindModule();

                    return _this;
                }

                return SimpleElement;
            }(ielement.anestor.extendElement || HTMLElement);

            const sp = SimpleElement.prototype;

            sp.bindModule = function () {
                if(this.component) return;
                const Component = this.$anestor = util.getAnestor(ielement.anestor, this);
                const component = this.component = typeof Component === 'function' ? new Component(this) : {};
                component.template = Component.template || '';
                component.$el = this;
                this.createdCallback();
            };
            sp.emit = function (funcName, args, cb, isAsync) {
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
                }
                
            };
            sp.createdCallback = function () {
                const _this = this;
                const template = _this.component.template, createdSync = _this.component.createdSync;
                const isAsync = typeof createdSync==='undefined'?true:!createdSync;
                this.emit('created', arguments, function () {
                    if (template) {
                        util.createComp(_this, template);
                    }
                }, isAsync);
            };

            // 向文档插入实例
            sp.connectedCallback = function () {
                this.emit('attached', arguments);
            };
            // 从文档中移除实例
            sp.disconnectedCallback = function () {
                this.emit('detached', arguments);
            };
            // 从旧文档移到新文档中
            sp.adoptedCallback = function(){//oldDocument, newDocument
                this.emit('adopted', arguments);
            };
            // 添加，移除，或修改一个属性
            sp.attributeChangedCallback = function () {//attrName, oldVal, newVal
                this.emit('attributeChanged', arguments);
            };

            return SimpleElement;
        }
    }

    return function(anestor){
        const XElement = new IElement(anestor).create();
        XElement.observedAttributes = anestor.observedAttributes || [];
        return XElement;
    };
});


