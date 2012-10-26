EnvJasmine.load(EnvJasmine.jsDir + "demo.js");

describe('greeter', function () {
    it('greets me', function () {
        expect(NS.greeter('Trevor')).toEqual('Hello Trevor!');
    });
});
