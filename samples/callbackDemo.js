// This is a demo of using jasmine in a callback!

if (typeof(NS) === 'undefined' || !NS) {
    var NS = {};
}

NS.runIfTrevor = function (name, callback) {
    if (name === 'Trevor') {
        callback(name);
    } else {
        throw 'You aren\'t Trevor!';
    }
};
