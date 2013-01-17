// Add any files here that need to be loaded before all tests are run, (e.g. third-party libraries, like jQuery)
//
// NOTE: Load order does matter.
// Load the envjasmine environment
EnvJasmine.loadGlobal(EnvJasmine.libDir + "envjs/env.rhino.1.2.js");
EnvJasmine.loadGlobal(EnvJasmine.libDir + "jasmine/jasmine.js");
EnvJasmine.loadGlobal(EnvJasmine.libDir + "jasmine-ajax/mock-ajax.js");
EnvJasmine.loadGlobal(EnvJasmine.libDir + "jasmine-ajax/spec-helper.js");
EnvJasmine.loadGlobal(EnvJasmine.libDir + "jasmine-jquery/jasmine-jquery-1.2.0.js");
EnvJasmine.loadGlobal(EnvJasmine.libDir + "jasmine-rhino-reporter/jasmine-rhino-reporter.js");

// This is your main JavaScript directory in your project.
EnvJasmine.jsDir = EnvJasmine.jsDir || EnvJasmine.rootDir + "/samples/"; // TODO: Change this to your project's main js directory.

EnvJasmine.loadGlobal(EnvJasmine.includeDir + "jquery-1.4.4.js"); // for example, load jquery.
// TODO: Add your own


// this will include the code coverage plugin
//EnvJasmine.loadGlobal(EnvJasmine.libDir + "/jscover/envjasmine-sonar-coverage-properties.js"); // TODO: Uncomment and update if you want code coverage
//EnvJasmine.loadGlobal(EnvJasmine.coverage.envjasmine_coverage_js); // TODO: Uncomment if you want code coverage