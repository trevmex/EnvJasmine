if (!this.EnvJasmine.coverage) {
    this.EnvJasmine.coverage = {};
   for (var i = 0; i < arguments.length; i++) {
    arg = arguments[i];
        if (arg.slice(0, 2) == "--") {
            nameValue = arg.slice(2).split('=');
            switch(nameValue[0]) {
                case "envJasmineRootDir":
                     EnvJasmine.coverage.rootDir = nameValue[1];
                    break;
            }
        }
    }

    EnvJasmine.printDebug("Loading Properties");
    properties_file = (EnvJasmine.coverage.rootDir ? EnvJasmine.coverage.rootDir : "..") + "/lib/jscover/envjasmine-sonar-coverage-properties.js";
    fileIn = new FileReader(properties_file);
    Context.getCurrentContext().evaluateReader(this, fileIn, "envjasmine-sonar-coverage-properties.js", 0, null);
    fileIn.close();
}

EnvJasmine.coverage.writeCoverageResults = function() {
    EnvJasmine.printDebug("Writing Coverage Results");
    EnvJasmine.printDebug(EnvJasmine.coverage.reportJson);
    var coverage = EnvJasmine.jscoverage;
    try {
        // clean coverage object
        EnvJasmine.coverage.cleanCoverageObject(coverage);

        // write file
        fstream = new FileWriter(EnvJasmine.coverage.reportJson);
        out = new BufferedWriter(fstream);
        out.write(JSON.stringify(coverage));

        //Close the output stream
        out.close();
    } catch (e) {//Catch exception if any
        print("Error: " + e);
    }
};

EnvJasmine.coverage.cleanCoverageObject = function(jsonObj) {
    // recursively iterate over the output object
    // we need to remove the toJSON function which is causing JSON.stringify to break
    if ( typeof jsonObj == "object") {
        $.each(jsonObj, function(k, v) {
            if ( typeof v != "undefined") {
                delete v.toJSON;
                // jscover ovrrides this function, so we have to delete it bfore writing the json string.
            }
            EnvJasmine.coverage.cleanCoverageObject(v);
        });
    } // else do nothing
};

// add functions to envjasmine
EnvJasmine.addFinallyFunction(EnvJasmine.coverage.writeCoverageResults);

print("EnvJasmine-Coverage Plugin Loaded");
