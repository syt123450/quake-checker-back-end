/**
 * Created by ss on 2017/4/7.
 */

$(function() {
    buildEnvironment();
});

String.prototype.format = function () {
    var args = [].slice.call(arguments);
    return this.replace(/(\{\d+\})/g, function (a) {
        return args[+(a.substr(1, a.length - 2)) || 0];
    });
};