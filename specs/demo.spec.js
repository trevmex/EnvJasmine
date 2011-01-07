// Load the file to test here.
//
// Example:
//load("../../../../main/webapp/js/demo.js");

describe("Demo", function () {
    it("asserts that one plus one equals two", function () {
        expect(1 + 1 == 2).toEqual(true);
    });

    it("asserts that 1 + 1 does not equal 3", function () {
        expect(1 + 1 == 3).toEqual(false);
    });
});
