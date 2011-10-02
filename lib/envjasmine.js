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

importPackage(java.lang);
importPackage(java.io);
importPackage(org.mozilla.javascript);

// Create the EnvJasmine namespace
if (!this.EnvJasmine) {
    this.EnvJasmine = {};
}

EnvJasmine.cx = Context.getCurrentContext();
EnvJasmine.cx.setOptimizationLevel(-1);
EnvJasmine.topLevelScope = this;

EnvJasmine.about = function () {
    print("Usage: envjasmine.js --suppressConsoleMsgs --disableColor --environment=<WIN|UNIX> --testDir=<Directory holding tests, if not in the EnvJasmine Directory> --rootDir=<EnvJasmine Root Directory> [<js spec files>...]");
    System.exit(1);
};

EnvJasmine.normalizePath = function(path) {
    var endsInSlash = (path.slice(-1) == "/");

    if (path.slice(0, 1) == ".") {
        path = EnvJasmine.rootDir + "/" + path;
    }

    return File(path).getCanonicalPath() + (endsInSlash ? "/" : "");
};

EnvJasmine.loadFactory = function(scope) {
    return function (path) {
        var fileIn,
            normalizedPath = EnvJasmine.normalizePath(path);

        try {
            fileIn = new FileReader(normalizedPath);
            EnvJasmine.cx.evaluateReader(scope, fileIn, normalizedPath, 0, null);
        }
        finally {
            fileIn.close();
        }
    };
};
EnvJasmine.loadGlobal = EnvJasmine.loadFactory(EnvJasmine.topLevelScope);

EnvJasmine.setRootDir = function (rootDir) {
    // These are standard directories in the EnvJasmine project.
    EnvJasmine.rootDir = EnvJasmine.normalizePath(rootDir);
    EnvJasmine.libDir = EnvJasmine.normalizePath(EnvJasmine.rootDir + "/lib/");
    EnvJasmine.includeDir = EnvJasmine.normalizePath(EnvJasmine.rootDir + "/include/");

    // This is the standard spec suffix
    EnvJasmine.specSuffix = new RegExp(/.spec.js$/);

    // Load the default dirs and files, these can be overridden with command line options
    EnvJasmine.configFile = EnvJasmine.normalizePath(EnvJasmine.includeDir + "dependencies.js");
};

EnvJasmine.setTestDir = function (testDir, override) {
    if (typeof EnvJasmine.testDir === "undefined" || !EnvJasmine.testDir || override) {
        EnvJasmine.testDir = EnvJasmine.normalizePath(testDir);
        EnvJasmine.mocksDir = EnvJasmine.normalizePath(EnvJasmine.testDir + "/mocks/");
        EnvJasmine.specsDir = EnvJasmine.normalizePath(EnvJasmine.testDir + "/specs/");
    }
};

// Process command line options

(function(argumentList) {
    var arg, nameValue, spec = "";

    EnvJasmine.specs = [];
    EnvJasmine.passedCount = 0;
    EnvJasmine.failedCount = 0;
    EnvJasmine.totalCount = 0;

    for (var i = 0; i < argumentList.length; i++) {
        arg = argumentList[i];

        if (arg.slice(0, 2) == "--") {
            nameValue = arg.slice(2).split('=');

            switch(nameValue[0]) {
                case "testDir":
                    EnvJasmine.setTestDir(nameValue[1], true);
                    break;
                case "rootDir":
                    EnvJasmine.setRootDir(nameValue[1]);
                    EnvJasmine.setTestDir(nameValue[1]); // Set the root as the default testDir.
                    break;
                case "environment":
                    EnvJasmine.environment = nameValue[1];
                    break;
                case "configFile":
                    EnvJasmine.configFile = EnvJasmine.normalizePath(nameValue[1]);
                    break;
                case "disableColor":
                    EnvJasmine.disableColor = true;
                    break;
                case "supressConsoleMsgs":
                    EnvJasmine.suppressConsoleMsgs = true;
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
                EnvJasmine.specs.push(EnvJasmine.normalizePath(EnvJasmine.testDir + "/" + spec));
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
    return EnvJasmine.disableColor || (env == "WIN");
}(EnvJasmine.environment));

if (EnvJasmine.disableColor) {
    EnvJasmine.green = "";
    EnvJasmine.red = "";
    EnvJasmine.endColor = "";
} else {
    EnvJasmine.green = "\033[32m";
    EnvJasmine.red = "\033[31m";
    EnvJasmine.endColor = "\033[0m";
}

// Load the envjasmine environment
EnvJasmine.loadEnv = function () {
    EnvJasmine.loadGlobal(EnvJasmine.libDir + "envjs/env.rhino.1.2.js");
    EnvJasmine.loadGlobal(EnvJasmine.libDir + "jasmine/jasmine.js");
    EnvJasmine.loadGlobal(EnvJasmine.libDir + "jasmine-ajax/mock-ajax.js");
    EnvJasmine.loadGlobal(EnvJasmine.libDir + "jasmine-ajax/spec-helper.js");
    EnvJasmine.loadGlobal(EnvJasmine.libDir + "jasmine-jquery/jasmine-jquery-1.2.0.js");
    EnvJasmine.loadGlobal(EnvJasmine.libDir + "jasmine-rhino-reporter/jasmine-rhino-reporter.js");
};

EnvJasmine.loadConfig = function () {
    EnvJasmine.loadGlobal(EnvJasmine.configFile);
};

(function() {
    var i, fileIn, len, scope;

    EnvJasmine.loadEnv();
    EnvJasmine.loadConfig();

    if (EnvJasmine.suppressConsoleMsgs === true) {
        // suppress console messages
        window.console = $.extend({}, window.console, {
            info: jasmine.createSpy(),
            log: jasmine.createSpy(),
            debug: jasmine.createSpy(),
            warning: jasmine.createSpy(),
            error: jasmine.createSpy()
        });
    }

    EnvJasmine.loadGlobal(EnvJasmine.libDir + "spanDir/spanDir.js");
    if (EnvJasmine.specs.length == 0) {
        spanDir(EnvJasmine.specsDir, function(spec) {
            if (EnvJasmine.specSuffix.test(spec)) {
                EnvJasmine.specs.push(spec);
            }
        });
    }

    for (i = 0, len = EnvJasmine.specs.length >>> 0; i < len; i += 1) {
        print("Loading " + EnvJasmine.specs[i]);
        try {
            scope = {};
            EnvJasmine.load = EnvJasmine.loadFactory(scope);
            fileIn = new FileReader(EnvJasmine.specs[i]);
            EnvJasmine.cx.evaluateReader(scope, fileIn, EnvJasmine.specs[i], 0, null);
            EnvJasmine.cx.evaluateString(scope, 'window.location.assign(["file://", EnvJasmine.libDir, "envjasmine.html"].join(EnvJasmine.SEPARATOR));', 'Executing '+EnvJasmine.specs[i], 0, null);
        }
        finally {
            fileIn.close();
        }
    }

    print("Final Results:");
    print(EnvJasmine.green + "Final Passed: " + EnvJasmine.passedCount + EnvJasmine.endColor);
    print(EnvJasmine.red + "Final Failed: " + EnvJasmine.failedCount + EnvJasmine.endColor);
    print("Final Total: " + EnvJasmine.totalCount);
}());
