importPackage(java.io);
importPackage(java.lang);
importPackage(java.util.regex);
importPackage(org.mozilla.javascript);

( function(argumentList) {

    if (!this.EnvJasmine) {
        this.EnvJasmine = {};
    }

    if (!EnvJasmine.coverage) {
        EnvJasmine.coverage = {};
    }

    EnvJasmine.printDebug = function(str) {
        if (EnvJasmine.debug) {
            print(str);
        }
    };

    var arg, nameValue;

    for (var i = 0; i < argumentList.length; i++) {
        arg = argumentList[i];
        EnvJasmine.printDebug("ARGUMENT: " + arg);
        if (arg.slice(0, 2) == "--") {
            nameValue = arg.slice(2).split('=');

            switch(nameValue[0]) {
                case "projectRoot":
                     EnvJasmine.coverage.projectRoot = nameValue[1];
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

    properties_file = "../lib/jscover/envjasmine-sonar-coverage-properties.js";

    print("Loading Helper Files");
    fileIn = new FileReader(properties_file);
    Context.getCurrentContext().evaluateReader(this, fileIn, "envjasmine-sonar-coverage-properties.js", 0, null);
    fileIn.close();

    fileIn = new FileReader(EnvJasmine.coverage.jscoverDir + "envjasmine-sonar-coverage-helper.js");
    Context.getCurrentContext().evaluateReader(this, fileIn, "envjasmine-sonar-coverage-helper.js", 0, null);
    fileIn.close();

    // create directories that will be used
    print("Creating temp directories");
    EnvJasmine.printDebug("INSTRUMENTED DIRECTORY: " + EnvJasmine.coverage.instrumentedDir);
    (new File(EnvJasmine.coverage.instrumentedDir)).mkdir();
    (new File(EnvJasmine.coverage.reportsDir)).mkdir();


    // instrument the javascript code
    // no-instrument documentation:  http://tntim96.github.com/JSCover/manual/manual.xml#fileMode
    print("Instrumenting")
    no_i = ""
    for (var i = 0; i < EnvJasmine.coverage.noInstrument.length; i++) {
        no_i += (" --no-instrument=" + EnvJasmine.coverage.noInstrument[i]);
    }
    cmd = "java -jar " + EnvJasmine.coverage.jscoverJar + " -fs --branch " + no_i + " " + EnvJasmine.coverage.originalDir + " " + EnvJasmine.coverage.instrumentedDir;
    EnvJasmine.printDebug("EXECUTING: " + cmd)
    EnvJasmine.coverage.executeCommand(cmd);

    // some evil code is neccessary to get this to work :(
    // hopefully we'll get rid of this soon jscover can be changed a little
    print("Exposing coverage hooks to EnvJasmine");
    p = Pattern.compile("this\\._\\$jscoverage|(?<!\\.)_\\$jscoverage", Pattern.MULTILINE);
    EnvJasmine.coverage.recurseTransform(EnvJasmine.coverage.instrumentedDir, function(content) {
        return p.matcher(content).replaceAll("EnvJasmine.jscoverage");
    });

    // run tests with instrumented code
    print("Running instrumented tests");
    cmd = EnvJasmine.coverage.run_script + " --jsDir=" + EnvJasmine.coverage.instrumentedDir + " --plugin=" + EnvJasmine.coverage.envjasmine_coverage_js + " " + argumentList.join(" ");
    EnvJasmine.printDebug("EXECUTING: " + cmd)
    EnvJasmine.coverage.executeCommand(cmd);

    // convert json file into lcov file which sonar can read
    print("Converting Output to lcov")
    cmd = "java -cp " + EnvJasmine.coverage.jscoverJar + " jscover.report.Main --format=LCOV " + EnvJasmine.coverage.reportsDir + " " + EnvJasmine.coverage.reportsDir
    EnvJasmine.printDebug("EXECUTING: " + cmd)
    EnvJasmine.coverage.executeCommand(cmd);

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
    if (EnvJasmine.coverage.sonarMethod === "sonar-runner") {
        print("Running Sonar");
        EnvJasmine.coverage.executeCommand("sonar-runner -Dproject.settings="+EnvJasmine.coverage.sonar_runner_properties, EnvJasmine.coverage.rootDir); // sonar runner
    } else if (EnvJasmine.coverage.sonarMethod === "maven") {
        print("Running Sonar");
        EnvJasmine.coverage.executeCommand("mvn sonar:sonar -f "+EnvJasmine.coverage.sonar_pom_xml, EnvJasmine.coverage.rootDir); // maven
    }

    if (EnvJasmine.coverage.cleanup) {
        print("Cleanup");
        EnvJasmine.coverage.executeCommand("rm -rf " + EnvJasmine.coverage.reportsDir);
        EnvJasmine.coverage.executeCommand("rm -rf " + EnvJasmine.coverage.instrumentedDir);
    }

    print("envjasmine-sonar-coverage-runner complete")
}(arguments));