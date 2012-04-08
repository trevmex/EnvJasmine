EnvJasmine.load(EnvJasmine.jsDir + 'callbackDemo.js');

describe('runIfTrevor', function () {
	var callback = null;
	
	beforeEach(function () {
		callback = jasmine.createSpy();
	});
	
	it('calls callback if Trevor', function () {
    	NS.runIfTrevor('Trevor', callback);
    	expect(callback).toHaveBeenCalledWith('Trevor');
    });
    
    it('doesn\'t call callback if not Trevor', function () {
    	NS.runIfTrevor('Signe', callback);
    	expect(callback).not.toHaveBeenCalledWith('Trevor');
    });
    
    it('logs a message if not Trevor', function () {
    	spyOn(console, 'log').andCallFake(function (error) {
    		expect(error).toEqual('You aren\'t Trevor!');
    	});
    	NS.runIfTrevor('Signe', callback);
    });
});