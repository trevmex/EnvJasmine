// Load the file to test here.
//
// Example:
// load(EnvJasmine.jsDirectory + "ajaxDemo.js");

var TwitterWidget = {
    makeRequest: function() {
        var self = this;
        $.ajax({
            method: "GET",
            url: "http://api.twitter.com/1/statuses/show/trevmex.json",
            datatype: "json",
            success: function (data) {
                self.addDataToDOM(data);
            }
        });
    },

    addDataToDOM: function(data) {
        // does something
        
        return data;
    }
};

describe("AjaxDemo", function () {
    beforeEach(function () {
        TwitterWidget.makeRequest();
    });

    it("calls the addDataToDOM function on success", function () {
        spyOn(TwitterWidget, "addDataToDOM").andCallFake(function () {
            return "made it!";
        });

        mostRecentAjaxRequest().response({
            status: 200,
            responseText: "foo"
        });

        expect(TwitterWidget.addDataToDOM).toHaveBeenCalledWith("foo");
    });
});
