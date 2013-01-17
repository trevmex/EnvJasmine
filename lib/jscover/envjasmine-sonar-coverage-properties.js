importPackage(java.io);
importPackage(org.mozilla.javascript);

if (!this.EnvJasmine) {
    this.EnvJasmine = {};
}

if (!EnvJasmine.coverage) {
    EnvJasmine.coverage = {};
}

// directories
EnvJasmine.coverage.rootDir = (new File("..")).getCanonicalPath(); // root directory of project
EnvJasmine.coverage.libDir = EnvJasmine.coverage.rootDir+"/lib/"; // lib directory (see example project structure)
EnvJasmine.coverage.jscoverDir = EnvJasmine.coverage.libDir+"/jscover/"; // jscover-envjasmine plugin directory
EnvJasmine.coverage.originalDir = EnvJasmine.coverage.rootDir+"/samples/"; // root js directory
EnvJasmine.coverage.instrumentedDir = EnvJasmine.coverage.rootDir+"/instrumented/"; // directory to copy instrumented code to
EnvJasmine.coverage.reportsDir = EnvJasmine.coverage.rootDir + "/reports";  // no trailing slash on purpose! Where to put reports.

// files
EnvJasmine.coverage.jscoverJar = EnvJasmine.coverage.jscoverDir+"/JSCover-all.jar"; // location of jscover jar
EnvJasmine.coverage.envjasmine_coverage_js = EnvJasmine.coverage.jscoverDir + "/envjasmine-coverage.js"; // location of envjasmine plugin file
EnvJasmine.coverage.run_all_tests_sh = EnvJasmine.coverage.rootDir+"/bin/run_all_tests.sh"; // location of envjasmine run script file
EnvJasmine.coverage.reportJson = EnvJasmine.coverage.reportsDir+"/jscoverage.json"; // jscover output file
EnvJasmine.coverage.reportLcov = EnvJasmine.coverage.reportsDir+"/jscover.lcov"; // lcov file converted from jscover output file
EnvJasmine.coverage.reportSonar = EnvJasmine.coverage.reportsDir+"/jsTestDriver.conf-coverage.dat"; // final coverage data file to be picked up by sonar
EnvJasmine.coverage.sonar_runner_properties = EnvJasmine.coverage.jscoverDir + "/sonar-project.properties"; // location of the properties files for sonar-runner
EnvJasmine.coverage.sonar_pom_xml = "sonar.js.xml"; // name of the pom file for sonar

// variables
EnvJasmine.coverage.noInstrument = ["ajaxDemo.js"]; // files or directories not to instrument (relative to root js directory)
EnvJasmine.coverage.sonarMethod = "sonar-runner"; // "maven" or "sonar-runner" or "none"
