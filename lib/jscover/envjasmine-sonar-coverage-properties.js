importPackage(java.io);
importPackage(org.mozilla.javascript);

if (!this.EnvJasmine) {
    this.EnvJasmine = {};
}

if (!EnvJasmine.coverage) {
    EnvJasmine.coverage = {};
}

for (var i = 0; i < arguments.length; i++) {
        arg = arguments[i];
        EnvJasmine.printDebug("ARGUMENT: " + arg);
        if (arg.slice(0, 2) == "--") {
            nameValue = arg.slice(2).split('=');

            switch(nameValue[0]) {
                case "projectRoot":
                     EnvJasmine.coverage.projectRoot = nameValue[1];
                    break;
                case "envJasmineRootDir":
                     EnvJasmine.coverage.rootDir = nameValue[1];
                    break;
                case "originalDir":
                     EnvJasmine.coverage.originalDir = nameValue[1];
                    break;
                case "instrumentedDir":
                     EnvJasmine.coverage.instrumentedDir = nameValue[1];
                    break;
                case "reportsDir":
                     EnvJasmine.coverage.reportsDir = nameValue[1];
                    break;
                case "cleanup":
                    EnvJasmine.coverage.cleanup = true;
                    break;
                case "sonarMethod":
                    EnvJasmine.coverage.sonarMethod = nameValue[1];
                    break;
                case "noInstrument":
                    if (EnvJasmine.coverage.noInstrument[0] == "ajaxDemo.js") {
                        // override default example
                        EnvJasmine.coverage.noInstrument = [];
                    }
                    EnvJasmine.coverage.noInstrument.push(nameValue[1]);
                    break;
                case "debug":
                    EnvJasmine.debug = true;
                    break;
            }
        }
    }

//  envjasmine directories
EnvJasmine.coverage.rootDir = EnvJasmine.coverage.rootDir || (new File("..")).getCanonicalPath(); // root directory of project or gem
EnvJasmine.coverage.libDir = EnvJasmine.coverage.rootDir+"/lib/"; // lib directory (see example project structure)
EnvJasmine.coverage.jscoverDir = EnvJasmine.coverage.libDir+"/jscover/"; // jscover-envjasmine plugin directory

// envjasmine files
EnvJasmine.coverage.run_script = EnvJasmine.coverage.rootDir+"/bin/run_all_tests.sh"; // location of envjasmine run script file
EnvJasmine.coverage.jscoverJar = EnvJasmine.coverage.jscoverDir+"/JSCover-all.jar"; // location of jscover jar
EnvJasmine.coverage.envjasmine_coverage_js = EnvJasmine.coverage.jscoverDir + "/envjasmine-coverage.js"; // location of envjasmine plugin file

// project directories
EnvJasmine.coverage.projectRoot = EnvJasmine.coverage.projectRoot || EnvJasmine.coverage.rootDir; // root directory of project
EnvJasmine.coverage.originalDir = EnvJasmine.coverage.originalDir || EnvJasmine.coverage.projectRoot+"/samples/"; // root js directory
EnvJasmine.coverage.instrumentedDir = EnvJasmine.coverage.instrumentedDir || EnvJasmine.coverage.projectRoot+"/instrumented/"; // directory to copy instrumented code to
EnvJasmine.coverage.reportsDir = EnvJasmine.coverage.reportsDir || EnvJasmine.coverage.projectRoot + "/reports";  // NO TRAILING SLASH ON PURPOSE! Where to put reports.
EnvJasmine.coverage.reportsDir = (EnvJasmine.coverage.reportsDir.lastIndexOf("/") == EnvJasmine.coverage.reportsDir.length-1 ? EnvJasmine.coverage.reportsDir.substring(0, EnvJasmine.coverage.reportsDir.length-1) : EnvJasmine.coverage.reportsDir);


// project files
EnvJasmine.coverage.sonar_runner_properties = EnvJasmine.coverage.projectRoot + "/sonar-project.properties"; // location of the properties files for sonar-runner
EnvJasmine.coverage.reportJson = EnvJasmine.coverage.reportsDir+"/jscoverage.json"; // jscover output file
EnvJasmine.coverage.reportLcov = EnvJasmine.coverage.reportsDir+"/jscover.lcov"; // lcov file converted from jscover output file
EnvJasmine.coverage.reportSonar = EnvJasmine.coverage.reportsDir+"/jsTestDriver.conf-coverage.dat"; // final coverage data file to be picked up by sonar
EnvJasmine.coverage.sonar_pom_xml = "sonar.js.xml"; // name of the pom file for sonar


// variables
EnvJasmine.coverage.noInstrument = ["ajaxDemo.js"]; // files or directories not to instrument (relative to root js directory)
EnvJasmine.coverage.sonarMethod = EnvJasmine.coverage.sonarMethod || "none"; // "maven" or "sonar-runner" or "none"
EnvJasmine.coverage.cleanup = EnvJasmine.coverage.cleanup || false;