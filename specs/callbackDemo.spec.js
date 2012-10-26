EnvJasmine.load(EnvJasmine.jsDir + "callbackDemo.js");

describe('runIfTrevor', function () {
    it('calls callback if Trevor', function () {
        var callback = jasmine.createSpy();

        NS.runIfTrevor('Trevor', callback);
        expect(callback).toHaveBeenCalledWith('Trevor');
    });

    it('throws an error and does not call callback if not Trevor', function () {
        var callback = jasmine.createSpy();

        expect(function () {
            NS.runIfTrevor('Orson', callback);
        }).toThrow('You aren\'t Trevor!');

        expect(callback).not.toHaveBeenCalled();
    });
});
