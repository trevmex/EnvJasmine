EnvJasmine.load(EnvJasmine.jsDir + "demo.js");
EnvJasmine.load(EnvJasmine.jsDir + "ajaxDemo.js");

describe("greetUser", function () {
    it("calls greeter on success", function () {
        NS.greetUser(1);
        spyOn(NS, "greeter");
        mostRecentAjaxRequest().response({
        	status: 200,
        	responseText: '{"name":"Trevor"}'
        });
        expect(NS.greeter).toHaveBeenCalledWith("Trevor");
    });
    
    it("logs an error on failure", function () {
    	NS.greetUser(1);
    	spyOn(console, "error").andCallFake(function (error) {
    		expect(error).toEqual('Request failed: error');
    	});
    	mostRecentAjaxRequest().response({status: 404});
    });
});
