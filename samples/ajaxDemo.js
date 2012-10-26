// This is the contents of ajaxDemo.js, the file to test.

if (typeof(NS) === 'undefined' || !NS) {
    var NS = {};
}

NS.greeter = function (name) {
    return 'Hello ' + name + '!';
};

NS.greetUser = function (id) {
    return $.ajax({
        data: id,
        url: 'name.html',
        success: function (data) {
            NS.greeter(data.name);
        }
    });
};


