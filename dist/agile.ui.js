/*!
 * Agile UI HTML5组件化框架
 * Version: 0.2.7.1518183874156
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

(function (factory) {
    const aui = factory();
    if ((typeof module === "object" || typeof module === "function") && typeof module.exports === "object") {
        module.exports = aui;
    }

    const modName = window.__AGILE_UI_ID__ || 'aui';

    if (typeof window.define === "function" && window.define.amd) {
        //window.define(modName, [], function () {
        window.define([], function () {
            return aui;
        });
    }

    if (!window[modName]) window[modName] = aui;
})(function () {
    return {
        'AuiComponent': __webpack_require__(2)
    };
});

/***/ }),
/* 2 */
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
        this.isCreated = false;

        this.tag = anestor.tag;

        this.$anestor = anestor;

        this.addStyle();

        this.bind();

        this.hookGlobal();
    }

    AuiComponent.create = function (anestor) {
        var aui = new AuiComponent(anestor);
        return aui.isCreated;
    };

    AuiComponent.isEs5 = !window.customElements ? true : false;

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
            return this.tag.replace('aui', '').replace(/\-(.)/g, function (s, s1) {
                return s1.toUpperCase();
            });
        },
        hookGlobal: function () {
            if (typeof window === 'object') {
                if (!window.auicomponents) window.auicomponents = {};
                var name = this.createName();
                auicomponents[name] = this.$anestor;
            }
        },
        get tag() {
            return this._tag;
        },

        set tag(name) {
            this._tag = formateName(name);
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

        bind: function () {

            if (!this.tag || this.isCreated) return;

            var anestor = this.$anestor;

            var XElement = __webpack_require__(3)(AuiComponent.isEs5)(anestor);

            // 如果组件已经被定义则不重复定义
            if (customElements.get(this.tag)) return;
            // 否则定义组件
            customElements.define(this.tag, XElement);

            this.isCreated = true;
        }
    };

    __webpack_require__(7);

    return AuiComponent;
});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

(function (factory) {
    const XElement = factory();
    module.exports = XElement;
})(function () {
    return function (isEs5) {
        return isEs5 ? __webpack_require__(4) : __webpack_require__(5);
    };
});

/***/ }),
/* 4 */
/***/ (function(module, exports) {

(function (factory) {
    const XElement = factory();
    module.exports = XElement;
})(function () {

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
        this.$anestor = anestor;
    }

    IElement.prototype = {
        bindModule: function ($el) {
            const Component = this.$anestor;
            const component = $el.component = typeof Component === 'function' ? new Component() : {};
            component.template = Component.template || '';
            this.$el = component.$el = $el;
            this.createdCallback();
        },
        emit: function (funcName, args, cb) {
            const component = this.$el.component,
                  func = component[funcName];
            if (!(cb || func)) return;
            var _func = function () {
                cb && cb();
                func && func.apply(component, args);
            };

            if (funcName === 'created') {
                setTimeout(_func, 1);
            } else {
                _func();
            }
        },
        createdCallback: function () {
            const _this = this.$el;
            this.emit('created', arguments, function () {
                const template = _this.component.template;
                if (template) {
                    const $fragment = document.createDocumentFragment();
                    Array.prototype.slice.call(_this.childNodes, 0).forEach(function ($child) {
                        $fragment.appendChild($child);
                    });
                    _this.innerHTML = template;
                    const $child = _this.querySelector('child');
                    if ($child) {
                        $child.parentNode.replaceChild($fragment, $child);
                    }
                }
            });
        },
        create: function () {
            var ielement = this;
            var SimpleElement = function (_HTMLElement) {
                _inherits(SimpleElement, _HTMLElement);

                function SimpleElement() {
                    _classCallCheck(this, SimpleElement);

                    var _this = _possibleConstructorReturn(this, (SimpleElement.__proto__ || Object.getPrototypeOf(SimpleElement)).call(this));

                    ielement.bindModule(_this);

                    return _this;
                }

                return SimpleElement;
            }(HTMLElement);

            const sp = SimpleElement.prototype;

            // 向文档插入实例
            sp.connectedCallback = function () {
                ielement.emit('attached', arguments);
            };
            // 从文档中移除实例
            sp.disconnectedCallback = function () {
                ielement.emit('detached', arguments);
            };
            // 从旧文档移到新文档中
            sp.adoptedCallback = function () {
                //oldDocument, newDocument
                ielement.emit('adopted', arguments);
            };
            // 添加，移除，或修改一个属性
            sp.attributeChangedCallback = function () {
                //attrName, oldVal, newVal
                ielement.emit('attributeChanged', arguments);
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// 直接指向aui生成的模块
module.exports = __webpack_require__(6);

/***/ }),
/* 6 */
/***/ (function(module, exports) {

const __mod__ = {exports:{}};
const __str__ = ['// ie等不支持class定义，故通过字符串方式实例化function调用',
'(function (factory) {',
'    const XElement = factory();',
'    module.exports = XElement;',
'})(function () {',
'    class IElement extends HTMLElement {',
'        constructor() {',
'            super();',
'            this.component = {};',
'            this.bindModule();',
'        }',
'        bindModule() {',
'            const Component = this.$anestor;',
'            const component = this.component = typeof Component === \'function\' ? new Component() : {};',
'            component.template = Component.template || \'\';',
'            component.$el = this;',
'            this.createdCallback();',
'        }',
'        emit(funcName, args, cb) {',
'            const component = this.component, func = component[funcName];',
'            if(!(cb||func)) return;',
'            var _func = function () {',
'                cb && cb();',
'                func && func.apply(component, args);',
'            };',
'            if(funcName===\'created\'){',
'                setTimeout(_func, 1);',
'            }else{',
'                _func();',
'            };',
'        }',
'        // 创建元素实例',
'        createdCallback(...args) {',
'            const _this = this;',
'            this.emit(\'created\', args, function () {',
'                const template = _this.component.template;',
'                if (template) {',
'                    const $fragment = document.createDocumentFragment();',
'                    Array.from(_this.childNodes).forEach(function ($child) {',
'                        $fragment.appendChild($child);',
'                    });',
'                    _this.innerHTML = template;',
'                    const $child = _this.querySelector(\'child\');',
'                    if ($child) {',
'                        $child.parentNode.replaceChild($fragment, $child);',
'                    }',
'                }',
'            });',
'        }',
'        // 向文档插入实例',
'        connectedCallback(...args) {',
'            this.emit(\'attached\', args);',
'        }',
'        // 从文档中移除实例',
'        disconnectedCallback(...args) {',
'            this.emit(\'detached\', args);',
'        }',
'        // 从旧文档移到新文档中',
'        adoptedCallback(...args){//oldDocument, newDocument',
'            this.emit(\'adopted\', args);',
'        }',
'        // 添加，移除，或修改一个属性',
'        attributeChangedCallback(...args) {//attrName, oldVal, newVal',
'            this.emit(\'attributeChanged\', args);',
'        }',
'    }',
'    return function (anestor) {',
'        class XElement extends IElement {',
'            get $anestor() {',
'                return anestor;',
'            }',
'            static get observedAttributes() { return anestor.observedAttributes || []; }',
'        }',
'        return XElement;',
'    };',
'})'].join("\n");;
(new Function("module", __str__))(__mod__);
module.exports = __mod__.exports;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

(function(){
'use strict';var h=new function(){};var aa=new Set("annotation-xml color-profile font-face font-face-src font-face-uri font-face-format font-face-name missing-glyph".split(" "));function n(b){var a=aa.has(b);b=/^[a-z][.0-9_a-z]*-[\-.0-9_a-z]*$/.test(b);return!a&&b}function p(b){var a=b.isConnected;if(void 0!==a)return a;for(;b&&!(b.__CE_isImportDocument||b instanceof Document);)b=b.parentNode||(window.ShadowRoot&&b instanceof ShadowRoot?b.host:void 0);return!(!b||!(b.__CE_isImportDocument||b instanceof Document))}
function q(b,a){for(;a&&a!==b&&!a.nextSibling;)a=a.parentNode;return a&&a!==b?a.nextSibling:null}
function t(b,a,c){c=c?c:new Set;for(var d=b;d;){if(d.nodeType===Node.ELEMENT_NODE){var e=d;a(e);var f=e.localName;if("link"===f&&"import"===e.getAttribute("rel")){d=e.import;if(d instanceof Node&&!c.has(d))for(c.add(d),d=d.firstChild;d;d=d.nextSibling)t(d,a,c);d=q(b,e);continue}else if("template"===f){d=q(b,e);continue}if(e=e.__CE_shadowRoot)for(e=e.firstChild;e;e=e.nextSibling)t(e,a,c)}d=d.firstChild?d.firstChild:q(b,d)}}function u(b,a,c){b[a]=c};function v(){this.a=new Map;this.o=new Map;this.f=[];this.b=!1}function ba(b,a,c){b.a.set(a,c);b.o.set(c.constructor,c)}function w(b,a){b.b=!0;b.f.push(a)}function x(b,a){b.b&&t(a,function(a){return y(b,a)})}function y(b,a){if(b.b&&!a.__CE_patched){a.__CE_patched=!0;for(var c=0;c<b.f.length;c++)b.f[c](a)}}function z(b,a){var c=[];t(a,function(b){return c.push(b)});for(a=0;a<c.length;a++){var d=c[a];1===d.__CE_state?b.connectedCallback(d):A(b,d)}}
function B(b,a){var c=[];t(a,function(b){return c.push(b)});for(a=0;a<c.length;a++){var d=c[a];1===d.__CE_state&&b.disconnectedCallback(d)}}
function C(b,a,c){c=c?c:{};var d=c.w||new Set,e=c.s||function(a){return A(b,a)},f=[];t(a,function(a){if("link"===a.localName&&"import"===a.getAttribute("rel")){var c=a.import;c instanceof Node&&(c.__CE_isImportDocument=!0,c.__CE_hasRegistry=!0);c&&"complete"===c.readyState?c.__CE_documentLoadHandled=!0:a.addEventListener("load",function(){var c=a.import;if(!c.__CE_documentLoadHandled){c.__CE_documentLoadHandled=!0;var f=new Set(d);f.delete(c);C(b,c,{w:f,s:e})}})}else f.push(a)},d);if(b.b)for(a=0;a<
f.length;a++)y(b,f[a]);for(a=0;a<f.length;a++)e(f[a])}
function A(b,a){if(void 0===a.__CE_state){var c=a.ownerDocument;if(c.defaultView||c.__CE_isImportDocument&&c.__CE_hasRegistry)if(c=b.a.get(a.localName)){c.constructionStack.push(a);var d=c.constructor;try{try{if(new d!==a)throw Error("The custom element constructor did not produce the element being upgraded.");}finally{c.constructionStack.pop()}}catch(m){throw a.__CE_state=2,m;}a.__CE_state=1;a.__CE_definition=c;if(c.attributeChangedCallback)for(c=c.observedAttributes,d=0;d<c.length;d++){var e=c[d],
f=a.getAttribute(e);null!==f&&b.attributeChangedCallback(a,e,null,f,null)}p(a)&&b.connectedCallback(a)}}}v.prototype.connectedCallback=function(b){var a=b.__CE_definition;a.connectedCallback&&a.connectedCallback.call(b)};v.prototype.disconnectedCallback=function(b){var a=b.__CE_definition;a.disconnectedCallback&&a.disconnectedCallback.call(b)};
v.prototype.attributeChangedCallback=function(b,a,c,d,e){var f=b.__CE_definition;f.attributeChangedCallback&&-1<f.observedAttributes.indexOf(a)&&f.attributeChangedCallback.call(b,a,c,d,e)};function D(b,a){this.c=b;this.a=a;this.b=void 0;C(this.c,this.a);"loading"===this.a.readyState&&(this.b=new MutationObserver(this.f.bind(this)),this.b.observe(this.a,{childList:!0,subtree:!0}))}function E(b){b.b&&b.b.disconnect()}D.prototype.f=function(b){var a=this.a.readyState;"interactive"!==a&&"complete"!==a||E(this);for(a=0;a<b.length;a++)for(var c=b[a].addedNodes,d=0;d<c.length;d++)C(this.c,c[d])};function ca(){var b=this;this.b=this.a=void 0;this.f=new Promise(function(a){b.b=a;b.a&&a(b.a)})}function F(b){if(b.a)throw Error("Already resolved.");b.a=void 0;b.b&&b.b(void 0)};function G(b){this.i=!1;this.c=b;this.m=new Map;this.j=function(b){return b()};this.g=!1;this.l=[];this.u=new D(b,document)}
G.prototype.define=function(b,a){var c=this;if(!(a instanceof Function))throw new TypeError("Custom element constructors must be functions.");if(!n(b))throw new SyntaxError("The element name '"+b+"' is not valid.");if(this.c.a.get(b))throw Error("A custom element with name '"+b+"' has already been defined.");if(this.i)throw Error("A custom element is already being defined.");this.i=!0;var d,e,f,m,l;try{var g=function(b){var a=k[b];if(void 0!==a&&!(a instanceof Function))throw Error("The '"+b+"' callback must be a function.");
return a},k=a.prototype;if(!(k instanceof Object))throw new TypeError("The custom element constructor's prototype is not an object.");d=g("connectedCallback");e=g("disconnectedCallback");f=g("adoptedCallback");m=g("attributeChangedCallback");l=a.observedAttributes||[]}catch(r){return}finally{this.i=!1}a={localName:b,constructor:a,connectedCallback:d,disconnectedCallback:e,adoptedCallback:f,attributeChangedCallback:m,observedAttributes:l,constructionStack:[]};ba(this.c,b,a);this.l.push(a);this.g||
(this.g=!0,this.j(function(){return da(c)}))};function da(b){if(!1!==b.g){b.g=!1;for(var a=b.l,c=[],d=new Map,e=0;e<a.length;e++)d.set(a[e].localName,[]);C(b.c,document,{s:function(a){if(void 0===a.__CE_state){var e=a.localName,f=d.get(e);f?f.push(a):b.c.a.get(e)&&c.push(a)}}});for(e=0;e<c.length;e++)A(b.c,c[e]);for(;0<a.length;){for(var f=a.shift(),e=f.localName,f=d.get(f.localName),m=0;m<f.length;m++)A(b.c,f[m]);(e=b.m.get(e))&&F(e)}}}G.prototype.get=function(b){if(b=this.c.a.get(b))return b.constructor};
G.prototype.whenDefined=function(b){if(!n(b))return Promise.reject(new SyntaxError("'"+b+"' is not a valid custom element name."));var a=this.m.get(b);if(a)return a.f;a=new ca;this.m.set(b,a);this.c.a.get(b)&&!this.l.some(function(a){return a.localName===b})&&F(a);return a.f};G.prototype.v=function(b){E(this.u);var a=this.j;this.j=function(c){return b(function(){return a(c)})}};window.CustomElementRegistry=G;G.prototype.define=G.prototype.define;G.prototype.get=G.prototype.get;
G.prototype.whenDefined=G.prototype.whenDefined;G.prototype.polyfillWrapFlushCallback=G.prototype.v;var H=window.Document.prototype.createElement,ea=window.Document.prototype.createElementNS,fa=window.Document.prototype.importNode,ga=window.Document.prototype.prepend,ha=window.Document.prototype.append,ia=window.DocumentFragment.prototype.prepend,ja=window.DocumentFragment.prototype.append,I=window.Node.prototype.cloneNode,J=window.Node.prototype.appendChild,K=window.Node.prototype.insertBefore,L=window.Node.prototype.removeChild,M=window.Node.prototype.replaceChild,N=Object.getOwnPropertyDescriptor(window.Node.prototype,
"textContent"),O=window.Element.prototype.attachShadow,P=Object.getOwnPropertyDescriptor(window.Element.prototype,"innerHTML"),Q=window.Element.prototype.getAttribute,R=window.Element.prototype.setAttribute,S=window.Element.prototype.removeAttribute,T=window.Element.prototype.getAttributeNS,U=window.Element.prototype.setAttributeNS,ka=window.Element.prototype.removeAttributeNS,la=window.Element.prototype.insertAdjacentElement,ma=window.Element.prototype.prepend,na=window.Element.prototype.append,
V=window.Element.prototype.before,oa=window.Element.prototype.after,pa=window.Element.prototype.replaceWith,qa=window.Element.prototype.remove,ra=window.HTMLElement,W=Object.getOwnPropertyDescriptor(window.HTMLElement.prototype,"innerHTML"),sa=window.HTMLElement.prototype.insertAdjacentElement;function ta(){var b=X;window.HTMLElement=function(){function a(){var a=this.constructor,d=b.o.get(a);if(!d)throw Error("The custom element being constructed was not registered with `customElements`.");var e=d.constructionStack;if(!e.length)return e=H.call(document,d.localName),Object.setPrototypeOf(e,a.prototype),e.__CE_state=1,e.__CE_definition=d,y(b,e),e;var d=e.length-1,f=e[d];if(f===h)throw Error("The HTMLElement constructor was either called reentrantly for this constructor or called multiple times.");
e[d]=h;Object.setPrototypeOf(f,a.prototype);y(b,f);return f}a.prototype=ra.prototype;return a}()};function Y(b,a,c){function d(a){return function(d){for(var c=[],e=0;e<arguments.length;++e)c[e-0]=arguments[e];for(var e=[],f=[],k=0;k<c.length;k++){var r=c[k];r instanceof Element&&p(r)&&f.push(r);if(r instanceof DocumentFragment)for(r=r.firstChild;r;r=r.nextSibling)e.push(r);else e.push(r)}a.apply(this,c);for(c=0;c<f.length;c++)B(b,f[c]);if(p(this))for(c=0;c<e.length;c++)f=e[c],f instanceof Element&&z(b,f)}}c.h&&(a.prepend=d(c.h));c.append&&(a.append=d(c.append))};function ua(){var b=X;u(Document.prototype,"createElement",function(a){if(this.__CE_hasRegistry){var c=b.a.get(a);if(c)return new c.constructor}a=H.call(this,a);y(b,a);return a});u(Document.prototype,"importNode",function(a,c){a=fa.call(this,a,c);this.__CE_hasRegistry?C(b,a):x(b,a);return a});u(Document.prototype,"createElementNS",function(a,c){if(this.__CE_hasRegistry&&(null===a||"http://www.w3.org/1999/xhtml"===a)){var d=b.a.get(c);if(d)return new d.constructor}a=ea.call(this,a,c);y(b,a);return a});
Y(b,Document.prototype,{h:ga,append:ha})};function va(){var b=X;function a(a,d){Object.defineProperty(a,"textContent",{enumerable:d.enumerable,configurable:!0,get:d.get,set:function(a){if(this.nodeType===Node.TEXT_NODE)d.set.call(this,a);else{var c=void 0;if(this.firstChild){var e=this.childNodes,l=e.length;if(0<l&&p(this))for(var c=Array(l),g=0;g<l;g++)c[g]=e[g]}d.set.call(this,a);if(c)for(a=0;a<c.length;a++)B(b,c[a])}}})}u(Node.prototype,"insertBefore",function(a,d){if(a instanceof DocumentFragment){var c=Array.prototype.slice.apply(a.childNodes);
a=K.call(this,a,d);if(p(this))for(d=0;d<c.length;d++)z(b,c[d]);return a}c=p(a);d=K.call(this,a,d);c&&B(b,a);p(this)&&z(b,a);return d});u(Node.prototype,"appendChild",function(a){if(a instanceof DocumentFragment){var c=Array.prototype.slice.apply(a.childNodes);a=J.call(this,a);if(p(this))for(var e=0;e<c.length;e++)z(b,c[e]);return a}c=p(a);e=J.call(this,a);c&&B(b,a);p(this)&&z(b,a);return e});u(Node.prototype,"cloneNode",function(a){a=I.call(this,a);this.ownerDocument.__CE_hasRegistry?C(b,a):x(b,a);
return a});u(Node.prototype,"removeChild",function(a){var c=p(a),e=L.call(this,a);c&&B(b,a);return e});u(Node.prototype,"replaceChild",function(a,d){if(a instanceof DocumentFragment){var e=Array.prototype.slice.apply(a.childNodes);a=M.call(this,a,d);if(p(this))for(B(b,d),d=0;d<e.length;d++)z(b,e[d]);return a}var e=p(a),c=M.call(this,a,d),m=p(this);m&&B(b,d);e&&B(b,a);m&&z(b,a);return c});N&&N.get?a(Node.prototype,N):w(b,function(b){a(b,{enumerable:!0,configurable:!0,get:function(){for(var a=[],b=
0;b<this.childNodes.length;b++)a.push(this.childNodes[b].textContent);return a.join("")},set:function(a){for(;this.firstChild;)L.call(this,this.firstChild);J.call(this,document.createTextNode(a))}})})};function wa(b){var a=Element.prototype;function c(a){return function(c){for(var d=[],e=0;e<arguments.length;++e)d[e-0]=arguments[e];for(var e=[],l=[],g=0;g<d.length;g++){var k=d[g];k instanceof Element&&p(k)&&l.push(k);if(k instanceof DocumentFragment)for(k=k.firstChild;k;k=k.nextSibling)e.push(k);else e.push(k)}a.apply(this,d);for(d=0;d<l.length;d++)B(b,l[d]);if(p(this))for(d=0;d<e.length;d++)l=e[d],l instanceof Element&&z(b,l)}}V&&(a.before=c(V));V&&(a.after=c(oa));pa&&u(a,"replaceWith",function(a){for(var d=
[],c=0;c<arguments.length;++c)d[c-0]=arguments[c];for(var c=[],m=[],l=0;l<d.length;l++){var g=d[l];g instanceof Element&&p(g)&&m.push(g);if(g instanceof DocumentFragment)for(g=g.firstChild;g;g=g.nextSibling)c.push(g);else c.push(g)}l=p(this);pa.apply(this,d);for(d=0;d<m.length;d++)B(b,m[d]);if(l)for(B(b,this),d=0;d<c.length;d++)m=c[d],m instanceof Element&&z(b,m)});qa&&u(a,"remove",function(){var a=p(this);qa.call(this);a&&B(b,this)})};function xa(){var b=X;function a(a,c){Object.defineProperty(a,"innerHTML",{enumerable:c.enumerable,configurable:!0,get:c.get,set:function(a){var d=this,e=void 0;p(this)&&(e=[],t(this,function(a){a!==d&&e.push(a)}));c.set.call(this,a);if(e)for(var f=0;f<e.length;f++){var k=e[f];1===k.__CE_state&&b.disconnectedCallback(k)}this.ownerDocument.__CE_hasRegistry?C(b,this):x(b,this);return a}})}function c(a,c){u(a,"insertAdjacentElement",function(a,d){var e=p(d);a=c.call(this,a,d);e&&B(b,d);p(a)&&z(b,d);
return a})}O&&u(Element.prototype,"attachShadow",function(a){return this.__CE_shadowRoot=a=O.call(this,a)});P&&P.get?a(Element.prototype,P):W&&W.get?a(HTMLElement.prototype,W):w(b,function(b){a(b,{enumerable:!0,configurable:!0,get:function(){return I.call(this,!0).innerHTML},set:function(a){var b="template"===this.localName,d=b?this.content:this,c=H.call(document,this.localName);for(c.innerHTML=a;0<d.childNodes.length;)L.call(d,d.childNodes[0]);for(a=b?c.content:c;0<a.childNodes.length;)J.call(d,
a.childNodes[0])}})});u(Element.prototype,"setAttribute",function(a,c){if(1!==this.__CE_state)return R.call(this,a,c);var d=Q.call(this,a);R.call(this,a,c);c=Q.call(this,a);b.attributeChangedCallback(this,a,d,c,null)});u(Element.prototype,"setAttributeNS",function(a,c,f){if(1!==this.__CE_state)return U.call(this,a,c,f);var d=T.call(this,a,c);U.call(this,a,c,f);f=T.call(this,a,c);b.attributeChangedCallback(this,c,d,f,a)});u(Element.prototype,"removeAttribute",function(a){if(1!==this.__CE_state)return S.call(this,
a);var c=Q.call(this,a);S.call(this,a);null!==c&&b.attributeChangedCallback(this,a,c,null,null)});u(Element.prototype,"removeAttributeNS",function(a,c){if(1!==this.__CE_state)return ka.call(this,a,c);var d=T.call(this,a,c);ka.call(this,a,c);var e=T.call(this,a,c);d!==e&&b.attributeChangedCallback(this,c,d,e,a)});sa?c(HTMLElement.prototype,sa):la?c(Element.prototype,la):console.warn("Custom Elements: `Element#insertAdjacentElement` was not patched.");Y(b,Element.prototype,{h:ma,append:na});wa(b)};/*

 Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
var Z=window.customElements;if(!Z||Z.forcePolyfill||"function"!=typeof Z.define||"function"!=typeof Z.get){var X=new v;ta();ua();Y(X,DocumentFragment.prototype,{h:ia,append:ja});va();xa();document.__CE_hasRegistry=!0;var customElements=new G(X);Object.defineProperty(window,"customElements",{configurable:!0,enumerable:!0,value:customElements})};
}).call(self);

//# sourceMappingURL=custom-elements.min.js.map


/***/ })
/******/ ]);