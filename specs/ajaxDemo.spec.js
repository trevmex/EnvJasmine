// Load the file to test here.
//
// Example:
// load(EnvJasmine.jsDirectory + "ajaxDemo.js");

// This is the contents of ajaxDemo.js, the file to test.
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
        // We will mock this behavior with a spy.
        
        return data;
    }
};

// This is the test code.
describe("AjaxDemo", function () {
    it("calls the addDataToDOM function on success", function () {
        TwitterWidget.makeRequest(); // Make the AJAX call

        spyOn(TwitterWidget, "addDataToDOM"); // Add a spy to the callback

        mostRecentAjaxRequest().response({status: 200, responseText: "foo"}); // Mock the response

        expect(TwitterWidget.addDataToDOM).toHaveBeenCalledWith("foo");
    });
});
