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

EnvJasmine.about = function () {
    print("Usage: envjasmine.js <WIN|UNIX> <EnvJasmine Root Directory> [<js spec files>...]");
    exit(1);
};

if (arguments.length < 1) {
    EnvJasmine.about();
}

EnvJasmine.environment = arguments[0];

EnvJasmine.SEPARATOR = (function (env) {
    if (env == "UNIX") {
        return "/";
    } else if  (env == "WIN") {
        return "\\";
    } else {
        EnvJasmine.about();
    }
}(EnvJasmine.environment));

EnvJasmine.disableColor = (function (env) {
    return (env == "WIN");
}(EnvJasmine.environment));

// These are standard driectories in the EnvJasmine project.
EnvJasmine.rootDir = java.io.File(arguments[1]).getCanonicalPath() || '';
EnvJasmine.libDir = [EnvJasmine.rootDir, "lib"].join(EnvJasmine.SEPARATOR);
EnvJasmine.includeDir = [EnvJasmine.rootDir, "include"].join(EnvJasmine.SEPARATOR);
EnvJasmine.mocksDir = [EnvJasmine.rootDir, "mocks"].join(EnvJasmine.SEPARATOR);
EnvJasmine.specsDir = [EnvJasmine.rootDir, "specs"].join(EnvJasmine.SEPARATOR);
EnvJasmine.specSuffix = new RegExp(/.spec.js$/);

// Load the envjasmine environment
load([EnvJasmine.libDir, "spanDir", "spanDir.js"].join(EnvJasmine.SEPARATOR));
load([EnvJasmine.libDir, "envjs", "env.rhino.1.2.js"].join(EnvJasmine.SEPARATOR));
load([EnvJasmine.libDir, "jasmine", "jasmine.js"].join(EnvJasmine.SEPARATOR));
load([EnvJasmine.libDir, "jasmine-ajax", "mock-ajax.js"].join(EnvJasmine.SEPARATOR));
load([EnvJasmine.libDir, "jasmine-ajax", "spec-helper.js"].join(EnvJasmine.SEPARATOR));
load([EnvJasmine.libDir, "jasmine-jquery", "jasmine-jquery-1.2.0.js"].join(EnvJasmine.SEPARATOR));
load([EnvJasmine.libDir, "jasmine-rhino-reporter", "jasmine-rhino-reporter.js"].join(EnvJasmine.SEPARATOR));

// Load external dependencies
load([EnvJasmine.includeDir, "dependencies.js"].join(EnvJasmine.SEPARATOR));

if (arguments.length > 2) {
    // Load the specs from the commandline
    var spec = '';
    for (var i = 2; i < arguments.length; i++) {
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
window.location = ["file://", EnvJasmine.libDir, "envjasmine.html"].join(EnvJasmine.SEPARATOR);
