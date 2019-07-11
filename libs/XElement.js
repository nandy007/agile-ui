(function (factory) {
    const XElement = factory();
    module.exports = XElement;
})(function(){
    var util = require('./util');
    return function(isEs5){
        return isEs5 ? require('./XElement.es5')(util) : require('./XElement.es6')(util);
    }
})