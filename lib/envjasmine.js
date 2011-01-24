/*
 EnvJasmine: Jasmine test runner for EnvJS.

 EnvJasmine allows you to run headless JavaScript tests.
 
 Based on info from:
 http://agile.dzone.com/news/javascript-bdd-jasmine-without
 http://www.mozilla.org/rhino/
 http://www.envjs.com/
 http://pivotal.github.com/jasmine/
 https://github.com/velesin/jasmine-jquery
*/

Packages.org.mozilla.javascript.Context
    .getCurrentContext().setOptimizationLevel(-1);

// Create the EnvJasmine namespace
if (!this.EnvJasmine) {
    this.EnvJasmine = {};
}

// Load the envjasmine environment
load("../lib/envjs/env.rhino.1.2.js");
load("../lib/jasmine/jasmine.js");
load("../lib/jasmine-ajax/mock-ajax.js");
load("../lib/jasmine-ajax/spec-helper.js");
load("../lib/jasmine-jquery/jasmine-jquery-1.1.3.js"); // include this to use test jQuery tests
load("../lib/jasmine-rhino-reporter/jasmine-rhino-reporter.js");

// Load external dependencies
load("../include/dependencies.js");

// Load the specs from the commandline
var spec;
for (var i = 0; i < arguments.length; i++) {
    spec = arguments[i];
    print("Loading: " + spec);
    load("../specs/" + spec);
}

// Execute the specs
window.location = "../lib/envjasmine.html";

