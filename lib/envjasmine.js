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

EnvJasmine.load = (function(fileSeparator) {
    var truePath, loaded = [];

    return function(path) {
        var cleanPath = new String(path).replace(/[\/]+/g, '/');
        if (loaded.indexOf(cleanPath) == -1) {
            loaded.push(path);

            // Format the path using the file separator
            truePath = cleanPath.split("/").join(fileSeparator);

            load(truePath);
        }
    };
}(EnvJasmine.SEPARATOR));

if (arguments.length < 1) {
    EnvJasmine.about();
}

EnvJasmine.disableColor = (function (env) {
    return (env == "WIN");
}(EnvJasmine.environment));

// These are standard driectories in the EnvJasmine project.
EnvJasmine.rootDir = java.io.File(arguments[1]).getCanonicalPath() || '';
EnvJasmine.libDir = EnvJasmine.rootDir + "/lib/";
EnvJasmine.includeDir = EnvJasmine.rootDir + "/include/";
EnvJasmine.mocksDir = EnvJasmine.rootDir + "/mocks/";
EnvJasmine.specsDir = EnvJasmine.rootDir + "/specs/";
EnvJasmine.specSuffix = new RegExp(/.spec.js$/);

// Load the envjasmine environment
EnvJasmine.load(EnvJasmine.libDir + "spanDir/spanDir.js");
EnvJasmine.load(EnvJasmine.libDir + "envjs/env.rhino.1.2.js");
EnvJasmine.load(EnvJasmine.libDir + "jasmine/jasmine.js");
EnvJasmine.load(EnvJasmine.libDir + "jasmine-ajax/mock-ajax.js");
EnvJasmine.load(EnvJasmine.libDir + "jasmine-ajax/spec-helper.js");
EnvJasmine.load(EnvJasmine.libDir + "jasmine-jquery/jasmine-jquery-1.2.0.js");
EnvJasmine.load(EnvJasmine.libDir + "jasmine-rhino-reporter/jasmine-rhino-reporter.js");

// Load external dependencies
EnvJasmine.load(EnvJasmine.includeDir + "dependencies.js");

if (arguments.length > 2) {
    // Load the specs from the commandline
    var spec = '';
    for (var i = 2; i < arguments.length; i++) {
        if (arguments[i].slice(-3) !== '.js') {
            // if this is not a JavaScript file (ending in '.js'), then the stupid command line parsed a directory with a space (' ') in it.
            // When that happens, add the directory segment to the spec path with a space character and continue.
            spec += arguments[i] + ' ';
            continue;
        } else {
            spec += arguments[i];
            print("Loading: " + spec);
            EnvJasmine.load(spec);
            spec = '';
        }
    }
} else {
    // Load specs from the specs dir
    spanDir(EnvJasmine.specsDir, function (spec) {
        if(EnvJasmine.specSuffix.test(spec)) {
            print("Loading: " + spec);
            EnvJasmine.load(spec);
        }
    });
}

// Execute the specs
window.location = ["file://", EnvJasmine.libDir, "envjasmine.html"].join(EnvJasmine.SEPARATOR);
