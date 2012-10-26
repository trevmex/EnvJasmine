EnvJasmine.load(EnvJasmine.jsDir + "ajaxDemo.js");

describe('greetUser', function () {
    it('calls greeter on success', function () {
        NS.greetUser(1);
        spyOn(NS, 'greeter');
        mostRecentAjaxRequest().response({
            status: 200,
            responseText: {"name":"Trevor"}
        });
        expect(NS.greeter).toHaveBeenCalledWith('Trevor');
    });
});
