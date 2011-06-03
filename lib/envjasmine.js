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
    print("Usage: envjasmine.js --environment=<WIN|UNIX> --rootDir=<EnvJasmine Root Directory> [<js spec files>...]");
    exit(1);
};

EnvJasmine.normalizePath = function(path) {
    var endsInSlash = (path.slice(-1) == "/");

    if (path.slice(0, 1) == ".") {
        path = EnvJasmine.rootDir + "/" + path;
    }

    return java.io.File(path).getCanonicalPath() + (endsInSlash ? "/" : "");
};

EnvJasmine.load = (function() {
    var loaded = [];

    return function(path) {
        if (loaded.indexOf(path) == -1) {
            loaded.push(path);

            load(EnvJasmine.normalizePath(path));
        }
    };
}());

// Process command line options
(function(argumentList) {
    var arg, nameValue, spec = "";

    EnvJasmine.specs = [];

    for (var i = 0; i < argumentList.length; i++) {
        arg = argumentList[i];

        if (arg.slice(0, 2) == "--") {
            nameValue = arg.slice(2).split('=');

            switch(nameValue[0]) {
                case "rootDir":
                    EnvJasmine.rootDir = EnvJasmine.normalizePath(nameValue[1]);
                    break;
                case "environment":
                    EnvJasmine.environment = nameValue[1];
                    break;
                case "configFile":
                    EnvJasmine.configFile = EnvJasmine.normalizePath(nameValue[1]);
                    break;
                default:
                    print("Unknown option: " + arg);
                    break;
            }
        } else {
            if (arg.slice(-3) !== ".js") {
                spec += arg + " ";
            } else {
                spec += arg;
                EnvJasmine.specs.push(EnvJasmine.normalizePath(EnvJasmine.rootDir + "/" + spec));
                spec = "";
            }
        }
    }
}(arguments));

if (typeof EnvJasmine.rootDir == "undefined" || typeof EnvJasmine.environment == "undefined") {
    EnvJasmine.about();
}

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
EnvJasmine.libDir = EnvJasmine.rootDir + "/lib/";
EnvJasmine.includeDir = EnvJasmine.rootDir + "/include/";
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
if (typeof EnvJasmine.configFile == "undefined") {
    EnvJasmine.configFile = EnvJasmine.includeDir + "dependencies.js";
}
EnvJasmine.load(EnvJasmine.configFile);

if (typeof EnvJasmine.testDir == 'undefined') {
    EnvJasmine.testDir = EnvJasmine.rootDir;
}

if (typeof EnvJasmine.mocksDir == 'undefined') {
    EnvJasmine.mocksDir = EnvJasmine.testDir + "/mocks/";
}

if (typeof EnvJasmine.specsDir == 'undefined') {
    EnvJasmine.specsDir = EnvJasmine.testDir + "/specs/";
}

EnvJasmine.testDir = EnvJasmine.normalizePath(EnvJasmine.testDir);
EnvJasmine.mocksDir = EnvJasmine.normalizePath(EnvJasmine.mocksDir);
EnvJasmine.specsDir = EnvJasmine.normalizePath(EnvJasmine.specsDir);

(function() {
    if (EnvJasmine.specs.length == 0) {
        spanDir(EnvJasmine.specsDir, function(spec) {
            if (EnvJasmine.specSuffix.test(spec)) {
                EnvJasmine.specs.push(spec);
            }
        });
    }

    var spec;
    for (var i = 0; i < EnvJasmine.specs.length; i++) {
        spec = EnvJasmine.specs[i];
        print("Loading: " + spec);
        EnvJasmine.load(spec);
    }
}());

// Execute the specs
window.location = ["file://", EnvJasmine.libDir, "envjasmine.html"].join(EnvJasmine.SEPARATOR);
