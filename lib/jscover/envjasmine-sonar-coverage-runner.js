importPackage(java.io);
importPackage(java.lang);
importPackage(java.util.regex);
importPackage(org.mozilla.javascript);

( function() {

    properties_file = "../lib/jscover/envjasmine-sonar-coverage-properties.js"; // TODO: Update to properties files location

    print("Loading Helper Files");
    fileIn = new FileReader(properties_file);
    Context.getCurrentContext().evaluateReader(this, fileIn, "envjasmine-sonar-coverage-properties.js", 0, null);
    fileIn.close();

    fileIn = new FileReader(EnvJasmine.coverage.jscoverDir + "envjasmine-sonar-coverage-helper.js");
    Context.getCurrentContext().evaluateReader(this, fileIn, "envjasmine-sonar-coverage-helper.js", 0, null);
    fileIn.close();

    // create directories that will be used
    print("Creating temp directories");
    (new File(EnvJasmine.coverage.instrumentedDir)).mkdir();
    (new File(EnvJasmine.coverage.reportsDir)).mkdir();

    // instrument the javascript code
    // no-instrument documentation:  http://tntim96.github.com/JSCover/manual/manual.xml#fileMode
    print("Instrumenting")
    no_i = ""
    for (var i = 0; i < EnvJasmine.coverage.noInstrument.length; i++) {
        no_i += (" --no-instrument=" + EnvJasmine.coverage.noInstrument[i]);
    }
    EnvJasmine.coverage.executeCommand("java -jar " + EnvJasmine.coverage.jscoverJar + " -fs --branch " + no_i + " " + EnvJasmine.coverage.originalDir + " " + EnvJasmine.coverage.instrumentedDir);

    // some evil code is neccessary to get this to work :(
    // hopefully we'll get rid of this soon jscover can be changed a little
    print("Exposing coverage hooks to EnvJasmine");
    p = Pattern.compile("this\\._\\$jscoverage|(?<!\\.)_\\$jscoverage", Pattern.MULTILINE);
    EnvJasmine.coverage.recurseTransform(EnvJasmine.coverage.instrumentedDir, function(content) {
        return p.matcher(content).replaceAll("EnvJasmine.jscoverage");
    });

    // run tests with instrumented code
    print("Running instrumented tests");
    EnvJasmine.coverage.executeCommand(EnvJasmine.coverage.run_all_tests_sh + " --jsDir=" + EnvJasmine.coverage.instrumentedDir);

    // convert json file into lcov file which sonar can read
    print("Converting Output to lcov")
    EnvJasmine.coverage.executeCommand("java -cp " + EnvJasmine.coverage.jscoverJar + " jscover.report.Main --format=LCOV " + EnvJasmine.coverage.reportsDir + " " + EnvJasmine.coverage.reportsDir);

    // The lcov file includes branch coverage but sonar can't read it, so remove it
    print("converting lcov to be compatible with sonar 2");
    file = new File(EnvJasmine.coverage.reportLcov);
    content = (new Scanner(file)).useDelimiter("\\Z").next();
    pattern = new Pattern.compile(EnvJasmine.coverage.reportsDir);
    content = pattern.matcher(content).replaceAll(EnvJasmine.coverage.originalDir);
    pattern = Pattern.compile("^BRDA:.*$", Pattern.MULTILINE);
    content = pattern.matcher(content).replaceAll("");
    out = new PrintWriter(EnvJasmine.coverage.reportSonar);
    out.print(content);
    out.close();

    print("Coverage file ready to be picked up by sonar");

    // run sonar, it will pick up the code coverage file
    print("Running Sonar");
    EnvJasmine.coverage.executeCommand("mvn sonar:sonar -f sonar.js.xml", EnvJasmine.coverage.rootDir);

    print("Cleanup");
    EnvJasmine.coverage.executeCommand("rm -rf " + EnvJasmine.coverage.reportsDir);
    EnvJasmine.coverage.executeCommand("rm -rf " + EnvJasmine.coverage.instrumentedDir);
}());