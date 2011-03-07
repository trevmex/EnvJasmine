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

if (arguments.length < 1) {
    print("Usage: envjasmine.js <EnvJasmine Root Directory> [<js spec files>...]");
    exit(1);
}

// Create the EnvJasmine namespace
if (!this.EnvJasmine) {
    this.EnvJasmine = {};
}

// These are standard driectories in the EnvJasmine project.
EnvJasmine.rootDir = java.io.File(arguments[0]).getCanonicalPath() || '';
EnvJasmine.libDir = EnvJasmine.rootDir + "/lib/";
EnvJasmine.includeDir = EnvJasmine.rootDir + "/include/";
EnvJasmine.mocksDir = EnvJasmine.rootDir + "/mocks/";
EnvJasmine.specsDir = EnvJasmine.rootDir + "/specs/";
EnvJasmine.specSuffix = new RegExp(/.spec.js$/);

// Load the envjasmine environment
load(EnvJasmine.libDir + "spanDir/spanDir.js");
load(EnvJasmine.libDir + "envjs/env.rhino.1.2.js");
load(EnvJasmine.libDir + "jasmine/jasmine.js");
load(EnvJasmine.libDir + "jasmine-ajax/mock-ajax.js");
load(EnvJasmine.libDir + "jasmine-ajax/spec-helper.js");
load(EnvJasmine.libDir + "jasmine-jquery/jasmine-jquery-1.1.3.js");
load(EnvJasmine.libDir + "jasmine-rhino-reporter/jasmine-rhino-reporter.js");

// Load external dependencies
load(EnvJasmine.includeDir + "dependencies.js");

if (arguments.length > 1) {
    // Load the specs from the commandline
    var spec = '';
    for (var i = 1; i < arguments.length; i++) {
        if (arguments[i][arguments[i].length - 3] !== "." && arguments[i][arguments[i].length - 2] !== "j" && arguments[i][arguments[i].length - 1] !== "s") {
            // if this is not a JavaScript file (ending in '.js'), then the stupid command line parsed a directory with a space (' ') in it.
            // When that happens, add the directory segment to the spec path with a space character and continue.
            spec += arguments[i] + ' ';
            continue;
        } else {
            spec += arguments[i];
            print("Loading: " + spec);
            load(spec);
            spec = '';
        }
    }
} else {
    // Load specs from the specs dir
    spanDir(EnvJasmine.specsDir, function (spec) {
        if(EnvJasmine.specSuffix.test(spec)) {
            print("Loading: " + spec);
            load(spec);
        }
    });
}

// Execute the specs
window.location = EnvJasmine.libDir + "envjasmine.html";
