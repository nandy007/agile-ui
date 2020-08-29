/*!
 * Agile UI HTML5组件化框架
 * Version: 0.3.18.1598688160148
 * Author: nandy007
 * License MIT @ https://github.com/nandy007/agile-ui
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {


var util = module.exports = {
    getAnestor: function (anestor, el) {
        return (typeof anestor.getReplacement === 'function' ? anestor.getReplacement(el) : anestor.replacement) || anestor;
    },
    insertAfter: function (newElement, targetElement) {
        var parent = targetElement.parentNode;
        if (parent.lastChild == targetElement) {
            parent.appendChild(newElement);
        } else {
            parent.insertBefore(newElement, targetElement.nextSibling);
        }
    },
    addChild: function ($child, jsDom) {
        var $parent = $child.parentNode,
            $start = document.createComment(''),
            $end = document.createComment('');
        $start.refer = $end.refer = jsDom;
        $parent.insertBefore($start, $child);
        util.insertAfter($end, $child);
        jsDom.slotParent = $parent;
        jsDom.slotPosition = {
            start: $start,
            end: $end
        };
    },
    createComp: function (jsDom, template) {
        const $fragment = document.createDocumentFragment();
        Array.from(jsDom.childNodes).forEach(function ($child) {
            $fragment.appendChild($child);
        });

        jsDom.innerHTML = template;
        const $child = jsDom.querySelector('child');
        if ($child) {
            util.addChild($child, jsDom);
            $child.parentNode.replaceChild($fragment, $child);
        }
    }
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(2);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

!function (factory) {
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
        if (modName) params.unshift(modName);
        window.define.apply(window.define, params);
    }

    if (!window[modId]) window[modId] = aui;
}(function () {
    return {
        'AuiComponent': __webpack_require__(3)
    };
});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {



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
        var useOld = typeof anestor.useOld === 'undefined' ? AuiComponent.useOld : anestor.useOld;
        if (useOld) {
            return __webpack_require__(4).create(anestor, template);
        }
        if (!anestor.tag) anestor.tag = anestor.name;
        if (!anestor.template) anestor.template = template || '';
        if (anestor.isNode) {
            var AuiNode = __webpack_require__(5);
            return AuiNode.cache(anestor);
        }
        var aui = new AuiComponent(anestor);
        return aui.isCreated;
    };

    AuiComponent.isEs5 = !window.customElements ? true : false;
    AuiComponent.useOld = false;

    AuiComponent.cssPretreatment = {
        text: function (content, cb) {
            cb(content);
        }
    };

    AuiComponent.addCssPretreatment = function (k, func) {
        AuiComponent.cssPretreatment[k] = func;
    };

    AuiComponent.prototype = {
        createName: function () {
            // 把所有-字母转为字母大写
            return this.getTag().replace('aui', '').replace(/\-(.)/g, function (s, s1) {
                return s1.toUpperCase();
            });
        },
        hookGlobal: function () {
            if (typeof window === 'object') {
                if (!window.auicomponents) window.auicomponents = {};
                var name = this.createName();
                if (!auicomponents[name]) auicomponents[name] = this.$anestor;
            }
        },
        getTag: function () {
            return this._tag;
        },
        setTag: function () {
            const anestor = this.$anestor;
            this._tag = anestor.fullTag && anestor.fullTag.indexOf('-') > -1 ? anestor.fullTag.toLowerCase() : formateName(anestor.fullTag || anestor.tag);
        },

        addStyle: function () {
            var style = this.$anestor.style;
            if (!style) return;
            var type,
                content = style,
                cssPretreatment;
            if (typeof style === 'object') {
                type = style.type;
                content = style.content || '';
            }
            cssPretreatment = AuiComponent.cssPretreatment[type] || AuiComponent.cssPretreatment['text'];

            cssPretreatment.call(this, content, function (css) {
                var $style = document.createElement('style');
                $style.type = 'text/css';
                $style.innerHTML = css;
                document.getElementsByTagName('HEAD').item(0).appendChild($style);
            });
        },

        initExtendElement: function () {
            var anestor = this.$anestor;
            var extendElement = anestor.extendElement,
                extendTag;
            if (typeof extendElement === 'string') {
                extendTag = extendElement;
                let ele = document.createElement(extendTag);
                anestor.extendElement = new Function(`return ${ele.constructor.name};`)();
                ele = null;
            } else if (!extendElement) {
                anestor.extendElement = HTMLElement;
            }

            if (!extendTag) {
                extendTag = anestor.extendElement.tag;
            }

            this.extendTag = extendTag;
        },

        bind: function () {

            var tag = this.getTag();

            if (!tag || this.isCreated) return;

            var anestor = this.$anestor;

            var XElement = __webpack_require__(6)(AuiComponent.isEs5)(anestor);

            // 如果组件已经被定义则不重复定义
            if (customElements.get(tag)) return;
            // 否则定义组件
            customElements.define(tag, XElement, { extends: this.extendTag });

            this.isCreated = true;
        }
    };

    __webpack_require__(10);

    return AuiComponent;
});

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {



(function (factory) {
    const AuiComponent = factory();
    module.exports = AuiComponent;
})(function () {
    var util = __webpack_require__(0);
    function formateName(name) {
        if (!name) return '';
        name = name.toLowerCase();
        if (name.indexOf('aui-') === 0) {
            return name;
        }
        return 'aui-' + name;
    }

    function createElement(anestor) {
        var tagName = anestor.fullTag && anestor.fullTag.indexOf('-') > -1 ? anestor.fullTag.toLowerCase() : formateName(anestor.fullTag || anestor.tag);
        var extendElement = anestor.extendElement,
            extendTag;
        if (typeof extendElement === 'string') {
            extendTag = extendElement;
            let ele = document.createElement(extendTag);
            anestor.extendElement = new Function(`return ${ele.constructor.name};`)();
            ele = null;
        } else if (!extendElement) {
            anestor.extendElement = HTMLElement;
        }

        if (!extendTag) {
            extendTag = anestor.extendElement.tag;
        }

        var pp = Object.create(anestor.extendElement.prototype);
        pp.$anestor = anestor;
        pp.bindModule = function () {
            const Component = this.$anestor;

            const component = this.component = typeof Component === 'function' ? new Component(this) : {};

            component.template = Component.template || '';
            component.$el = this;

            // this.createdCallback();
        };
        pp.emit = function (funcName, args, cb, isAsync) {
            const component = this.component,
                  func = component[funcName];
            if (!(cb || func)) return;
            var _func = function () {
                cb && cb();
                func && func.apply(component, args);
            };

            if (isAsync) {
                setTimeout(_func, 1);
            } else {
                _func();
            };
        };

        // 创建元素实例
        pp.createdCallback = function (...args) {
            this.bindModule();
            const _this = this;
            const template = _this.component.template,
                  createdSync = _this.component.createdSync;
            const isAsync = typeof createdSync === 'undefined' ? true : !createdSync;
            this.emit('created', args, function () {

                if (template) {

                    // const $fragment = document.createDocumentFragment();
                    // Array.from(_this.childNodes).forEach(function ($child) {
                    //     $fragment.appendChild($child);
                    // });

                    // _this.innerHTML = template;
                    // const $child = _this.querySelector('child');
                    // if ($child) {
                    //     $child.parentNode.replaceChild($fragment, $child);
                    // }

                    util.createComp(_this, template);
                }
            }, isAsync);
        };

        // 向文档插入实例
        pp.attachedCallback = function (...args) {
            this.emit('attached', args);
        };
        // 从文档中移除实例
        pp.detachedCallback = function (...args) {
            this.emit('detached', args);
        };
        // 从旧文档移到新文档中
        // pp.adoptedCallback = function(...args){//oldDocument, newDocument
        //     this.emit('adopted', args);
        // };
        // 添加，移除，或修改一个属性
        pp.attributeChangedCallback = function (...args) {
            //attrName, oldVal, newVal
            this.emit('attributeChanged', args);
        };

        document.registerElement(tagName, { prototype: pp, extends: extendTag });

        return {
            isCreated: true
        };
    }

    var AuiComponent = {
        create: function (anestor, template) {
            if (!anestor.tag) anestor.tag = anestor.name;
            if (!anestor.template) anestor.template = template || '';
            var aui = createElement(anestor);
            return aui.isCreated;
        }
    };

    return AuiComponent;
});

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {



(function (factory) {
    const AuiNode = factory();
    module.exports = AuiNode;
})(function () {
    var util = __webpack_require__(0);
    var createElement = document.createElement;
    document.createElement = function () {
        var target = createElement.apply(document, arguments);
        AuiNode.createSingle(target);
        return target;
    };

    function addEvent(elem, type, callback) {
        elem.addEventListener ? elem.addEventListener(type, callback, false) : elem.attachEvent('on' + type, callback);
    }

    function lisetenDom(dom) {
        if (dom) {
            addEvent(dom, 'DOMNodeInserted', function (e) {
                // var target = e.target;
                var target = e.relatedNode;
                AuiNode.create(target);
            });
            addEvent(dom, 'DOMNodeRemoved', function (e) {
                var target = e.relatedNode;
                AuiNode.remove(target);
            });
        } else {
            addEvent(window, 'load', function (e) {
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

    AuiNode.cache = function (anestor) {
        var tag = (anestor.fullTag || '').toLowerCase();
        if (!tag) {
            tag = 'aui-' + anestor.tag.toLowerCase();
        }

        AuiNode.nodes[tag] = anestor;
    };

    AuiNode.getTag = function (el) {
        var tag = (el.tagName || '').toLowerCase();
        return tag;
    };

    AuiNode.getEls = function (el) {
        try {
            if (!el) return [];
            var selectors = [];
            for (var k in AuiNode.nodes) {
                selectors.push(k);
            }
            var els = Array.prototype.slice.call(el.querySelectorAll && el.querySelectorAll(selectors.join(',')) || []);

            var tagName = AuiNode.getTag(el);
            var anestor = AuiNode.nodes[tagName];
            if (anestor) els.unshift(el);
            return els;
        } catch (e) {
            return [];
        }
    };

    AuiNode.create = function (el) {

        var els = AuiNode.getEls(el);

        for (var i = 0, len = els.length; i < len; i++) {
            var curEl = els[i];
            if (!curEl) continue;
            if (curEl.auiNode) {
                curEl.auiNode.emit('adopted', []);
                continue;
            }
            var tagName = AuiNode.getTag(curEl);
            var anestor = AuiNode.nodes[tagName];
            if (!anestor) continue;
            new AuiNode(curEl, anestor);
        }
    };

    AuiNode.createSingle = function (curEl) {
        var tagName = AuiNode.getTag(curEl);
        var anestor = AuiNode.nodes[tagName];
        if (!anestor) return;
        new AuiNode(curEl, anestor);
    };

    AuiNode.remove = function (el) {

        var els = AuiNode.getEls(el);

        for (var i = 0, len = els.length; i < len; i++) {
            var curEl = els[i];
            if (!curEl) continue;
            var auiNode = curEl.auiNode;
            if (!auiNode) continue;
            auiNode.emit('detached', []);
        }
    };

    AuiNode.prototype = {
        bindModule: function () {
            const Component = this.$anestor,
                  el = this.el;

            const component = el.component = typeof Component === 'function' ? new Component(el) : {};

            el.auiNode = this;

            component.template = Component.template || '';
            component.$el = el;

            // this.createdCallback();
        },
        emit: function (funcName, args, cb, isAsync) {
            const component = this.el.component,
                  func = component[funcName];
            if (!(cb || func)) return;
            var _func = function () {
                cb && cb();
                func && func.apply(component, args);
            };

            if (isAsync) {
                setTimeout(_func, 1);
            } else {
                _func();
            }
        },
        _emit: function () {
            var funcName = arguments[0];
            if (!this._queue) this._queue = [];
            if (funcName !== 'created' && !this.isCreated) {
                this._queue.push(arguments);
                return;
            } else {
                this._emit.apply(this, arguments);
                var queue;
                while (queue = (this._queue || []).shift()) {
                    this._emit.apply(this, arguments);
                }
            }
        },
        createdCallback: function () {

            const el = this.el,
                  _this = this;
            const template = el.component.template,
                  createdSync = el.component.createdSync;
            const isAsync = typeof createdSync === 'undefined' ? true : !createdSync;
            this.emit('created', [], function () {
                if (template) {
                    // const $fragment = document.createDocumentFragment();
                    // Array.from(el.childNodes).forEach(function ($child) {
                    //     $fragment.appendChild($child);
                    // });

                    // el.innerHTML = template;
                    // const $child = el.querySelector('child');
                    // if ($child) {
                    //     el.slotParent = $child.parentNode;
                    //     $child.parentNode.replaceChild($fragment, $child);
                    // }
                    util.createComp(el, template);
                }
                _this.isCreated = true;
            }, isAsync);
            _this.attachedCallback();
        },
        attachedCallback: function () {
            this.emit('attached', []);
        },
        create: function () {
            this.bindModule();
            this.attributeChangedObserver();
            this.createdCallback();
        },
        attributeChangedObserver: function () {
            var _this = this,
                el = this.el;
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver; //浏览器兼容
            var config = { attributes: true, attributeFilter: this.$anestor.observedAttributes //配置对象
            };var observer = new MutationObserver(function (mutations) {
                //构造函数回调
                mutations.forEach(function (record) {
                    if (record.type == "attributes") {
                        //监听属性
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

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

(function (factory) {
    const XElement = factory();
    module.exports = XElement;
})(function () {
    var util = __webpack_require__(0);
    return function (isEs5) {
        return isEs5 ? __webpack_require__(7)(util) : __webpack_require__(8)(util);
    };
});

/***/ }),
/* 7 */
/***/ (function(module, exports) {

(function (factory) {

    module.exports = function (util) {
        const XElement = factory(util);
        return XElement;
    };
})(function (util) {
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }
    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }
    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    function IElement(anestor) {
        this.anestor = anestor; // util.getAnestor(anestor);;
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
                if (this.component) return;
                const Component = this.$anestor = util.getAnestor(ielement.anestor, this);
                const component = this.component = typeof Component === 'function' ? new Component(this) : {};
                component.template = Component.template || '';
                component.$el = this;
                this.createdCallback();
            };
            sp.emit = function (funcName, args, cb, isAsync) {
                const component = this.component,
                      func = component[funcName];
                if (!(cb || func)) return;
                var _func = function () {
                    cb && cb();
                    func && func.apply(component, args);
                };

                if (isAsync) {
                    Promise.resolve().then(function () {
                        _func();
                    });
                } else {
                    _func();
                }
            };
            sp.createdCallback = function () {
                const _this = this;
                const template = _this.component.template,
                      createdSync = _this.component.createdSync;
                const isAsync = typeof createdSync === 'undefined' ? true : !createdSync;
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
            sp.adoptedCallback = function () {
                //oldDocument, newDocument
                this.emit('adopted', arguments);
            };
            // 添加，移除，或修改一个属性
            sp.attributeChangedCallback = function () {
                //attrName, oldVal, newVal
                this.emit('attributeChanged', arguments);
            };

            return SimpleElement;
        }
    };

    return function (anestor) {
        const XElement = new IElement(anestor).create();
        XElement.observedAttributes = anestor.observedAttributes || [];
        return XElement;
    };
});

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// 直接指向aui生成的模块
module.exports = __webpack_require__(9);

/***/ }),
/* 9 */
/***/ (function(module, exports) {

const __mod__ = {exports:{}};
const __str__ = ['// ie等不支持class定义，故通过字符串方式实例化function调用',
'(function (factory) {',
'    module.exports = function(util){',
'        const XElement = factory(util);',
'        return XElement;',
'    };',
'})(function (util) {',
'    function createElement(_HTMLElement){',
'        return class IElement extends _HTMLElement {',
'            constructor() {',
'                super();',
'            }',
'            bindModule() {',
'                if(this.component) return;',
'                const Component = this.$anestor;',
'                const component = this.component = typeof Component === \'function\' ? new Component(this) : {};',
'                component.template = Component.template || \'\';',
'                component.$el = this;',
'                this.createdCallback();',
'            }',
'            emit(funcName, args, cb, isAsync) {',
'                this.bindModule();',
'                const component = this.component, func = component[funcName];',
'                if(!(cb||func)) return;',
'                var _func = function () {',
'                    cb && cb();',
'                    func && func.apply(component, args);',
'                };',
'                if(isAsync){',
'                    Promise.resolve().then(function(){',
'                        _func();',
'                    });',
'                }else{',
'                    _func();',
'                };',
'            }',
'            // 创建元素实例',
'            createdCallback(...args) {',
'                const _this = this;',
'                const template = _this.component.template, createdSync = _this.component.createdSync;',
'                const isAsync = typeof createdSync===\'undefined\'?true:!createdSync;',
'                this.emit(\'created\', args, function () {',
'                    if (template) {',
'                        util.createComp(_this, template);',
'                    }',
'                }, isAsync);',
'            }',
'            // 向文档插入实例',
'            connectedCallback(...args) {',
'                this.emit(\'attached\', args);',
'            }',
'            // 从文档中移除实例',
'            disconnectedCallback(...args) {',
'                this.emit(\'detached\', args);',
'            }',
'            // 从旧文档移到新文档中',
'            adoptedCallback(...args){//oldDocument, newDocument',
'                this.emit(\'adopted\', args);',
'            }',
'            // 添加，移除，或修改一个属性',
'            attributeChangedCallback(...args) {//attrName, oldVal, newVal',
'                this.emit(\'attributeChanged\', args);',
'            }',
'        };',
'    }',
'    return function (anestor) {',
'        const IElement = createElement(anestor.extendElement || HTMLElement);',
'        class XElement extends IElement {',
'            get $anestor() {',
'                return util.getAnestor(anestor, this);',
'            }',
'            static get observedAttributes() { return anestor.observedAttributes || []; }',
'        }',
'        return XElement;',
'    };',
'});'].join("\n");;
(new Function("module", __str__))(__mod__);
module.exports = __mod__.exports;

/***/ }),
/* 10 */
/***/ (function(module, exports) {

(function(){
/*

 Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
'use strict';var aa=new Set("annotation-xml color-profile font-face font-face-src font-face-uri font-face-format font-face-name missing-glyph".split(" "));function g(a){var b=aa.has(a);a=/^[a-z][.0-9_a-z]*-[\-.0-9_a-z]*$/.test(a);return!b&&a}function l(a){var b=a.isConnected;if(void 0!==b)return b;for(;a&&!(a.__CE_isImportDocument||a instanceof Document);)a=a.parentNode||(window.ShadowRoot&&a instanceof ShadowRoot?a.host:void 0);return!(!a||!(a.__CE_isImportDocument||a instanceof Document))}
function n(a,b){for(;b&&b!==a&&!b.nextSibling;)b=b.parentNode;return b&&b!==a?b.nextSibling:null}
function p(a,b,d){d=void 0===d?new Set:d;for(var c=a;c;){if(c.nodeType===Node.ELEMENT_NODE){var e=c;b(e);var f=e.localName;if("link"===f&&"import"===e.getAttribute("rel")){c=e.import;if(c instanceof Node&&!d.has(c))for(d.add(c),c=c.firstChild;c;c=c.nextSibling)p(c,b,d);c=n(a,e);continue}else if("template"===f){c=n(a,e);continue}if(e=e.__CE_shadowRoot)for(e=e.firstChild;e;e=e.nextSibling)p(e,b,d)}c=c.firstChild?c.firstChild:n(a,c)}}function r(a,b,d){a[b]=d};function u(){this.a=new Map;this.g=new Map;this.c=[];this.f=[];this.b=!1}function ba(a,b,d){a.a.set(b,d);a.g.set(d.constructorFunction,d)}function ca(a,b){a.b=!0;a.c.push(b)}function da(a,b){a.b=!0;a.f.push(b)}function v(a,b){a.b&&p(b,function(b){return w(a,b)})}function w(a,b){if(a.b&&!b.__CE_patched){b.__CE_patched=!0;for(var d=0;d<a.c.length;d++)a.c[d](b);for(d=0;d<a.f.length;d++)a.f[d](b)}}
function x(a,b){var d=[];p(b,function(b){return d.push(b)});for(b=0;b<d.length;b++){var c=d[b];1===c.__CE_state?a.connectedCallback(c):y(a,c)}}function z(a,b){var d=[];p(b,function(b){return d.push(b)});for(b=0;b<d.length;b++){var c=d[b];1===c.__CE_state&&a.disconnectedCallback(c)}}
function A(a,b,d){d=void 0===d?{}:d;var c=d.u||new Set,e=d.i||function(b){return y(a,b)},f=[];p(b,function(b){if("link"===b.localName&&"import"===b.getAttribute("rel")){var d=b.import;d instanceof Node&&(d.__CE_isImportDocument=!0,d.__CE_hasRegistry=!0);d&&"complete"===d.readyState?d.__CE_documentLoadHandled=!0:b.addEventListener("load",function(){var d=b.import;if(!d.__CE_documentLoadHandled){d.__CE_documentLoadHandled=!0;var f=new Set(c);f.delete(d);A(a,d,{u:f,i:e})}})}else f.push(b)},c);if(a.b)for(b=
0;b<f.length;b++)w(a,f[b]);for(b=0;b<f.length;b++)e(f[b])}
function y(a,b){if(void 0===b.__CE_state){var d=b.ownerDocument;if(d.defaultView||d.__CE_isImportDocument&&d.__CE_hasRegistry)if(d=a.a.get(b.localName)){d.constructionStack.push(b);var c=d.constructorFunction;try{try{if(new c!==b)throw Error("The custom element constructor did not produce the element being upgraded.");}finally{d.constructionStack.pop()}}catch(t){throw b.__CE_state=2,t;}b.__CE_state=1;b.__CE_definition=d;if(d.attributeChangedCallback)for(d=d.observedAttributes,c=0;c<d.length;c++){var e=
d[c],f=b.getAttribute(e);null!==f&&a.attributeChangedCallback(b,e,null,f,null)}l(b)&&a.connectedCallback(b)}}}u.prototype.connectedCallback=function(a){var b=a.__CE_definition;b.connectedCallback&&b.connectedCallback.call(a)};u.prototype.disconnectedCallback=function(a){var b=a.__CE_definition;b.disconnectedCallback&&b.disconnectedCallback.call(a)};
u.prototype.attributeChangedCallback=function(a,b,d,c,e){var f=a.__CE_definition;f.attributeChangedCallback&&-1<f.observedAttributes.indexOf(b)&&f.attributeChangedCallback.call(a,b,d,c,e)};function B(a){var b=document;this.c=a;this.a=b;this.b=void 0;A(this.c,this.a);"loading"===this.a.readyState&&(this.b=new MutationObserver(this.f.bind(this)),this.b.observe(this.a,{childList:!0,subtree:!0}))}function C(a){a.b&&a.b.disconnect()}B.prototype.f=function(a){var b=this.a.readyState;"interactive"!==b&&"complete"!==b||C(this);for(b=0;b<a.length;b++)for(var d=a[b].addedNodes,c=0;c<d.length;c++)A(this.c,d[c])};function ea(){var a=this;this.b=this.a=void 0;this.c=new Promise(function(b){a.b=b;a.a&&b(a.a)})}function D(a){if(a.a)throw Error("Already resolved.");a.a=void 0;a.b&&a.b(void 0)};function E(a){this.c=!1;this.a=a;this.j=new Map;this.f=function(b){return b()};this.b=!1;this.g=[];this.o=new B(a)}
E.prototype.l=function(a,b){var d=this;if(!(b instanceof Function))throw new TypeError("Custom element constructors must be functions.");if(!g(a))throw new SyntaxError("The element name '"+a+"' is not valid.");if(this.a.a.get(a))throw Error("A custom element with name '"+a+"' has already been defined.");if(this.c)throw Error("A custom element is already being defined.");this.c=!0;try{var c=function(b){var a=e[b];if(void 0!==a&&!(a instanceof Function))throw Error("The '"+b+"' callback must be a function.");
return a},e=b.prototype;if(!(e instanceof Object))throw new TypeError("The custom element constructor's prototype is not an object.");var f=c("connectedCallback");var t=c("disconnectedCallback");var k=c("adoptedCallback");var h=c("attributeChangedCallback");var m=b.observedAttributes||[]}catch(q){return}finally{this.c=!1}b={localName:a,constructorFunction:b,connectedCallback:f,disconnectedCallback:t,adoptedCallback:k,attributeChangedCallback:h,observedAttributes:m,constructionStack:[]};ba(this.a,
a,b);this.g.push(b);this.b||(this.b=!0,this.f(function(){return fa(d)}))};E.prototype.i=function(a){A(this.a,a)};
function fa(a){if(!1!==a.b){a.b=!1;for(var b=a.g,d=[],c=new Map,e=0;e<b.length;e++)c.set(b[e].localName,[]);A(a.a,document,{i:function(b){if(void 0===b.__CE_state){var e=b.localName,f=c.get(e);f?f.push(b):a.a.a.get(e)&&d.push(b)}}});for(e=0;e<d.length;e++)y(a.a,d[e]);for(;0<b.length;){var f=b.shift();e=f.localName;f=c.get(f.localName);for(var t=0;t<f.length;t++)y(a.a,f[t]);(e=a.j.get(e))&&D(e)}}}E.prototype.get=function(a){if(a=this.a.a.get(a))return a.constructorFunction};
E.prototype.m=function(a){if(!g(a))return Promise.reject(new SyntaxError("'"+a+"' is not a valid custom element name."));var b=this.j.get(a);if(b)return b.c;b=new ea;this.j.set(a,b);this.a.a.get(a)&&!this.g.some(function(b){return b.localName===a})&&D(b);return b.c};E.prototype.s=function(a){C(this.o);var b=this.f;this.f=function(d){return a(function(){return b(d)})}};window.CustomElementRegistry=E;E.prototype.define=E.prototype.l;E.prototype.upgrade=E.prototype.i;E.prototype.get=E.prototype.get;
E.prototype.whenDefined=E.prototype.m;E.prototype.polyfillWrapFlushCallback=E.prototype.s;var F=window.Document.prototype.createElement,G=window.Document.prototype.createElementNS,ha=window.Document.prototype.importNode,ia=window.Document.prototype.prepend,ja=window.Document.prototype.append,ka=window.DocumentFragment.prototype.prepend,la=window.DocumentFragment.prototype.append,H=window.Node.prototype.cloneNode,I=window.Node.prototype.appendChild,J=window.Node.prototype.insertBefore,K=window.Node.prototype.removeChild,L=window.Node.prototype.replaceChild,M=Object.getOwnPropertyDescriptor(window.Node.prototype,
"textContent"),N=window.Element.prototype.attachShadow,O=Object.getOwnPropertyDescriptor(window.Element.prototype,"innerHTML"),P=window.Element.prototype.getAttribute,Q=window.Element.prototype.setAttribute,R=window.Element.prototype.removeAttribute,S=window.Element.prototype.getAttributeNS,T=window.Element.prototype.setAttributeNS,U=window.Element.prototype.removeAttributeNS,ma=window.Element.prototype.insertAdjacentElement,na=window.Element.prototype.insertAdjacentHTML,oa=window.Element.prototype.prepend,
pa=window.Element.prototype.append,V=window.Element.prototype.before,qa=window.Element.prototype.after,ra=window.Element.prototype.replaceWith,sa=window.Element.prototype.remove,ta=window.HTMLElement,W=Object.getOwnPropertyDescriptor(window.HTMLElement.prototype,"innerHTML"),ua=window.HTMLElement.prototype.insertAdjacentElement,va=window.HTMLElement.prototype.insertAdjacentHTML;var wa=new function(){};function xa(){var a=X;window.HTMLElement=function(){function b(){var b=this.constructor,c=a.g.get(b);if(!c)throw Error("The custom element being constructed was not registered with `customElements`.");var e=c.constructionStack;if(0===e.length)return e=F.call(document,c.localName),Object.setPrototypeOf(e,b.prototype),e.__CE_state=1,e.__CE_definition=c,w(a,e),e;c=e.length-1;var f=e[c];if(f===wa)throw Error("The HTMLElement constructor was either called reentrantly for this constructor or called multiple times.");
e[c]=wa;Object.setPrototypeOf(f,b.prototype);w(a,f);return f}b.prototype=ta.prototype;Object.defineProperty(b.prototype,"constructor",{writable:!0,configurable:!0,enumerable:!1,value:b});return b}()};function Y(a,b,d){function c(b){return function(d){for(var e=[],c=0;c<arguments.length;++c)e[c]=arguments[c];c=[];for(var f=[],m=0;m<e.length;m++){var q=e[m];q instanceof Element&&l(q)&&f.push(q);if(q instanceof DocumentFragment)for(q=q.firstChild;q;q=q.nextSibling)c.push(q);else c.push(q)}b.apply(this,e);for(e=0;e<f.length;e++)z(a,f[e]);if(l(this))for(e=0;e<c.length;e++)f=c[e],f instanceof Element&&x(a,f)}}void 0!==d.h&&(b.prepend=c(d.h));void 0!==d.append&&(b.append=c(d.append))};function ya(){var a=X;r(Document.prototype,"createElement",function(b){if(this.__CE_hasRegistry){var d=a.a.get(b);if(d)return new d.constructorFunction}b=F.call(this,b);w(a,b);return b});r(Document.prototype,"importNode",function(b,d){b=ha.call(this,b,!!d);this.__CE_hasRegistry?A(a,b):v(a,b);return b});r(Document.prototype,"createElementNS",function(b,d){if(this.__CE_hasRegistry&&(null===b||"http://www.w3.org/1999/xhtml"===b)){var c=a.a.get(d);if(c)return new c.constructorFunction}b=G.call(this,b,
d);w(a,b);return b});Y(a,Document.prototype,{h:ia,append:ja})};function za(){function a(a,c){Object.defineProperty(a,"textContent",{enumerable:c.enumerable,configurable:!0,get:c.get,set:function(a){if(this.nodeType===Node.TEXT_NODE)c.set.call(this,a);else{var d=void 0;if(this.firstChild){var e=this.childNodes,k=e.length;if(0<k&&l(this)){d=Array(k);for(var h=0;h<k;h++)d[h]=e[h]}}c.set.call(this,a);if(d)for(a=0;a<d.length;a++)z(b,d[a])}}})}var b=X;r(Node.prototype,"insertBefore",function(a,c){if(a instanceof DocumentFragment){var e=Array.prototype.slice.apply(a.childNodes);
a=J.call(this,a,c);if(l(this))for(c=0;c<e.length;c++)x(b,e[c]);return a}e=l(a);c=J.call(this,a,c);e&&z(b,a);l(this)&&x(b,a);return c});r(Node.prototype,"appendChild",function(a){if(a instanceof DocumentFragment){var c=Array.prototype.slice.apply(a.childNodes);a=I.call(this,a);if(l(this))for(var e=0;e<c.length;e++)x(b,c[e]);return a}c=l(a);e=I.call(this,a);c&&z(b,a);l(this)&&x(b,a);return e});r(Node.prototype,"cloneNode",function(a){a=H.call(this,!!a);this.ownerDocument.__CE_hasRegistry?A(b,a):v(b,
a);return a});r(Node.prototype,"removeChild",function(a){var c=l(a),e=K.call(this,a);c&&z(b,a);return e});r(Node.prototype,"replaceChild",function(a,c){if(a instanceof DocumentFragment){var e=Array.prototype.slice.apply(a.childNodes);a=L.call(this,a,c);if(l(this))for(z(b,c),c=0;c<e.length;c++)x(b,e[c]);return a}e=l(a);var f=L.call(this,a,c),d=l(this);d&&z(b,c);e&&z(b,a);d&&x(b,a);return f});M&&M.get?a(Node.prototype,M):ca(b,function(b){a(b,{enumerable:!0,configurable:!0,get:function(){for(var a=[],
b=0;b<this.childNodes.length;b++){var f=this.childNodes[b];f.nodeType!==Node.COMMENT_NODE&&a.push(f.textContent)}return a.join("")},set:function(a){for(;this.firstChild;)K.call(this,this.firstChild);null!=a&&""!==a&&I.call(this,document.createTextNode(a))}})})};function Aa(a){function b(b){return function(e){for(var c=[],d=0;d<arguments.length;++d)c[d]=arguments[d];d=[];for(var k=[],h=0;h<c.length;h++){var m=c[h];m instanceof Element&&l(m)&&k.push(m);if(m instanceof DocumentFragment)for(m=m.firstChild;m;m=m.nextSibling)d.push(m);else d.push(m)}b.apply(this,c);for(c=0;c<k.length;c++)z(a,k[c]);if(l(this))for(c=0;c<d.length;c++)k=d[c],k instanceof Element&&x(a,k)}}var d=Element.prototype;void 0!==V&&(d.before=b(V));void 0!==V&&(d.after=b(qa));void 0!==ra&&
r(d,"replaceWith",function(b){for(var e=[],c=0;c<arguments.length;++c)e[c]=arguments[c];c=[];for(var d=[],k=0;k<e.length;k++){var h=e[k];h instanceof Element&&l(h)&&d.push(h);if(h instanceof DocumentFragment)for(h=h.firstChild;h;h=h.nextSibling)c.push(h);else c.push(h)}k=l(this);ra.apply(this,e);for(e=0;e<d.length;e++)z(a,d[e]);if(k)for(z(a,this),e=0;e<c.length;e++)d=c[e],d instanceof Element&&x(a,d)});void 0!==sa&&r(d,"remove",function(){var b=l(this);sa.call(this);b&&z(a,this)})};function Ba(){function a(a,b){Object.defineProperty(a,"innerHTML",{enumerable:b.enumerable,configurable:!0,get:b.get,set:function(a){var e=this,d=void 0;l(this)&&(d=[],p(this,function(a){a!==e&&d.push(a)}));b.set.call(this,a);if(d)for(var f=0;f<d.length;f++){var t=d[f];1===t.__CE_state&&c.disconnectedCallback(t)}this.ownerDocument.__CE_hasRegistry?A(c,this):v(c,this);return a}})}function b(a,b){r(a,"insertAdjacentElement",function(a,e){var d=l(e);a=b.call(this,a,e);d&&z(c,e);l(a)&&x(c,e);return a})}
function d(a,b){function e(a,b){for(var e=[];a!==b;a=a.nextSibling)e.push(a);for(b=0;b<e.length;b++)A(c,e[b])}r(a,"insertAdjacentHTML",function(a,c){a=a.toLowerCase();if("beforebegin"===a){var d=this.previousSibling;b.call(this,a,c);e(d||this.parentNode.firstChild,this)}else if("afterbegin"===a)d=this.firstChild,b.call(this,a,c),e(this.firstChild,d);else if("beforeend"===a)d=this.lastChild,b.call(this,a,c),e(d||this.firstChild,null);else if("afterend"===a)d=this.nextSibling,b.call(this,a,c),e(this.nextSibling,
d);else throw new SyntaxError("The value provided ("+String(a)+") is not one of 'beforebegin', 'afterbegin', 'beforeend', or 'afterend'.");})}var c=X;N&&r(Element.prototype,"attachShadow",function(a){a=N.call(this,a);var b=c;if(b.b&&!a.__CE_patched){a.__CE_patched=!0;for(var e=0;e<b.c.length;e++)b.c[e](a)}return this.__CE_shadowRoot=a});O&&O.get?a(Element.prototype,O):W&&W.get?a(HTMLElement.prototype,W):da(c,function(b){a(b,{enumerable:!0,configurable:!0,get:function(){return H.call(this,!0).innerHTML},
set:function(a){var b="template"===this.localName,c=b?this.content:this,e=G.call(document,this.namespaceURI,this.localName);for(e.innerHTML=a;0<c.childNodes.length;)K.call(c,c.childNodes[0]);for(a=b?e.content:e;0<a.childNodes.length;)I.call(c,a.childNodes[0])}})});r(Element.prototype,"setAttribute",function(a,b){if(1!==this.__CE_state)return Q.call(this,a,b);var e=P.call(this,a);Q.call(this,a,b);b=P.call(this,a);c.attributeChangedCallback(this,a,e,b,null)});r(Element.prototype,"setAttributeNS",function(a,
b,d){if(1!==this.__CE_state)return T.call(this,a,b,d);var e=S.call(this,a,b);T.call(this,a,b,d);d=S.call(this,a,b);c.attributeChangedCallback(this,b,e,d,a)});r(Element.prototype,"removeAttribute",function(a){if(1!==this.__CE_state)return R.call(this,a);var b=P.call(this,a);R.call(this,a);null!==b&&c.attributeChangedCallback(this,a,b,null,null)});r(Element.prototype,"removeAttributeNS",function(a,b){if(1!==this.__CE_state)return U.call(this,a,b);var d=S.call(this,a,b);U.call(this,a,b);var e=S.call(this,
a,b);d!==e&&c.attributeChangedCallback(this,b,d,e,a)});ua?b(HTMLElement.prototype,ua):ma?b(Element.prototype,ma):console.warn("Custom Elements: `Element#insertAdjacentElement` was not patched.");va?d(HTMLElement.prototype,va):na?d(Element.prototype,na):console.warn("Custom Elements: `Element#insertAdjacentHTML` was not patched.");Y(c,Element.prototype,{h:oa,append:pa});Aa(c)};var Z=window.customElements;if(!Z||Z.forcePolyfill||"function"!=typeof Z.define||"function"!=typeof Z.get){var X=new u;xa();ya();Y(X,DocumentFragment.prototype,{h:ka,append:la});za();Ba();document.__CE_hasRegistry=!0;var customElements=new E(X);Object.defineProperty(window,"customElements",{configurable:!0,enumerable:!0,value:customElements})};
}).call(self);

//# sourceMappingURL=custom-elements.min.js.map


/***/ })
/******/ ]);