(function (factory) {
    const XElement = factory();
    module.exports = XElement;
})(function(){
    return function(isEs5){
        return isEs5 ? require('./XElement.es5') : require('./XElement.es6');
    }
})