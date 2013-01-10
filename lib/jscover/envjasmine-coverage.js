EnvJasmine.coverageOutputFile = EnvJasmine.rootDir+"/reports/jscoverage.json";

EnvJasmine.writeCoverageResults = function() {
    var coverage = EnvJasmine.jscoverage;
    try{
        // clean coverage object
        EnvJasmine.cleanCoverageObject(coverage);

        // write file
        fstream = new FileWriter(EnvJasmine.coverageOutputFile);
        out = new BufferedWriter(fstream);
        out.write(JSON.stringify(coverage));

        //Close the output stream
        out.close();
    } catch (e){//Catch exception if any
        System.err.println("Error: " + e);
    }
};

EnvJasmine.cleanCoverageObject = function(jsonObj) {
    // recursively iterate over the output object
    // we need to remove the toJSON function which is causing JSON.stringify to break
    if( typeof jsonObj == "object" ) {
        $.each(jsonObj, function(k,v) {
            if (typeof v != "undefined") {
                delete v.toJSON; // jscover ovrrides this function, so we have to delete it bfore writing the json string.
            }
            EnvJasmine.cleanCoverageObject(v);
        });
    } // else do nothing
};

EnvJasmine.addFinallyFunction(EnvJasmine.writeCoverageResults);