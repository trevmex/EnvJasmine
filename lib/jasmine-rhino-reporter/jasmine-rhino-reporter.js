var RhinoReporter = function() {
    var results = "";

    return {
        reportRunnerStarting: function(runner) {
        },

        reportRunnerResults: function(runner) {
            this.log(results);
            this.log("\033[32mPassed: " + runner.results().passedCount + "\033[0m");
            this.log("\033[31mFailed: " + runner.results().failedCount + "\033[0m");
            this.log("Total : " + runner.results().totalCount);
        },

        reportSuiteResults: function(suite) {
        },

        reportSpecStarting: function(spec) {
        },

        reportSpecResults: function(spec) {
            var i, specResults = spec.results().getItems();
            
            if (spec.results().passed()) {
                java.lang.System.out.print("\033[32m.\033[0m");
            } else {
                java.lang.System.out.print("\033[31mF\033[0m");
                results += "\n\033[31mFAILED\n";
                results += "Suite: " + spec.suite.description + "\n";
                results += "Spec : " + spec.description + "\n";
                for (i = 0; i < specResults.length; i += 1) {
                    results += specResults[i].trace + "\n";
                }
                results += "\033[0m";
            }
        },

        log: function(str) {
            print(str);
        }
    };
};

jasmine.getEnv().addReporter(new RhinoReporter());
