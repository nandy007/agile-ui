

const _M = {
    defined: {},
    auicomponents: {},
    components: {},
    origin: {},
    plugins: [],
    defineComponent(ui){
        // console.log('==========', ui)
        return function(structure){
            const {name} = structure;
            const tagName = name.toLowerCase();
            if(ui) structure.template = ui;

            const origin = $.extend(true, {}, structure);

            delete structure.name;
            _M.components[tagName] = structure;

            _M.origin[tagName] = origin;
        }
    },
    definePlugin(ui){
        return function(structure){
            const {name} = structure;
            const tagName = name.toLowerCase();

            if(ui) structure.template = ui;

            if(!_M.plugins[tagName]) _M.plugins[tagName] = [];
            _M.plugins[tagName].push(structure);
        }
    },
    formatUI(tagName, ui){
        return `<aui-${tagName}>` + ui + `</aui-${tagName}>`;
    },
    createOptions(tagName, options){
        var ret = options;
        var plugins = _M.plugins[tagName] || [];
        if(plugins.length===0){
            return ret;
        }
        for(var i=0, len=plugins.length;i<len;i++){
            var plugin = plugins[i];
            $.extend(true, ret, plugin);
        }
        return ret;
    },
    getComponent(tagName){
        return _M.components[tagName];
    },
    getOrigin(tagName){
        return _M.origin[tagName];
    },
    getPlugins(tagName){
        return (_M.plugins[tagName] || []).slice(0);
    },
    initComponents(app){
        _M.initConfig(app);
        for(let tagName in _M.components){
            _M.initComponent(tagName, app);
        }
    },
    initConfig(app){
        app.config.compilerOptions.isCustomElement = tag => tag.startsWith('aui-');
    },
    initComponent(tagName, app){
        AuiBasic.createDefault(tagName);
        const options = _M.auicomponents[tagName] = _M.createOptions(tagName, _M.components[tagName]);
        if(options.template) options.template = _M.formatUI(tagName, _M.replaceAuiDefined(options.template));
        const origin = options.mounted;
        options.mounted = async function(...args){
            this.$el.bindVue(this);
            const ret = origin && origin.apply(this, args);
            if(ret instanceof Promise){
                await ret;
            }
        };
        app.component(`auix-${tagName}`, options);
    },
    replaceAuiDefined(content){
        return content.replace(/\<([\/]?)aui\-/ig, function(s, s1){
            // console.log('========', s);
            return `<${s1}auix-`;
        });
    },
    getAuiComponent(tagName){
        return _M.auicomponents[tagName];
    },
};

class AuiBasic extends HTMLElement {

    static createDefault(tagName){
        if(_M.defined[tagName]){
            console.warn('aui component exist', tagName);
            return;
        }

        class AuiComponent extends AuiBasic{
            constructor(){
                super();
            }
        }
        customElements.define(`aui-${tagName}`, AuiComponent);
        console.log('aui component defined', tagName);

        _M.defined[tagName] = AuiComponent;
    }

    static get util(){
        return _M;
    }

    static getCtx(ctx){
        return ctx || document.body;
    }

    static closest(selector, ctx){
        const ret = $(AuiBasic.getCtx(ctx)).closest(selector);
        if(ret.length===0) return null;
        const comp = ret[0];
        if(comp && comp.isAui){
            return comp;
        }
        return null;
    }

    static find(selector, ctx){
        const ret = $(AuiBasic.getCtx(ctx)).find(selector);
        if(ret.length===0) return null;
        const comp = ret[0];
        if(comp && comp.isAui){
            return comp;
        }
        return null;
    }

    static findAll(selector, ctx){
        const ret = $(AuiBasic.getCtx(ctx)).find(selector);
        if(ret.length===0) return [];

        const arr = [];

        ret.each(function(){
            if(this.isAui){
                arr.push(this);
            }
        });

        return arr;
    }

    constructor() {
        super();
        console.log('aui component created', this.tagName);
    }

    get isAui(){
        return true;
    }

    bindVue(proxy){
        this.$ref = proxy;
        proxy.$aui = this;
    }

    closest(selector){
        return AuiBasic.closest(selector, this);
    }

    find(selector){
        return AuiBasic.find(selector, this);
    }

    findAll(selector){
        return AuiBasic.findAll(selector, this);
    }
}

module.exports = AuiBasic;