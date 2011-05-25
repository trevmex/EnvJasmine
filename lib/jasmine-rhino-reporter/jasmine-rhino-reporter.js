var RhinoReporter = function() {
    var results = "",
        green = "\033[32m",
        red = "\033[31m",
        endColor = "\033[0m";

    if (EnvJasmine.disableColor) {
        green = "";
        red = "";
        endColor = "";
    }

    return {
        reportRunnerStarting: function(runner) {
        },

        reportRunnerResults: function(runner) {
            var failedCount = runner.results().failedCount;

            this.log(results);
            this.log(green + "Passed: " + runner.results().passedCount + endColor);
            this.log(red + "Failed: " + failedCount + endColor);
            this.log("Total : " + runner.results().totalCount);

            if (failedCount > 0) {
                java.lang.System.exit(1);
            }
        },

        reportSuiteResults: function(suite) {
        },

        reportSpecStarting: function(spec) {
        },

        reportSpecResults: function(spec) {
            var i, specResults = spec.results().getItems();
            
            if (spec.results().passed()) {
                java.lang.System.out.print(green + "." + endColor);
            } else {
                java.lang.System.out.print(red + "F" + endColor);
                results += red + "FAILED\n";
                results += "Suite: " + spec.suite.description + "\n";
                results += "Spec : " + spec.description + "\n";
                for (i = 0; i < specResults.length; i += 1) {
                    results += specResults[i].trace + "\n";
                }
                results += endColor;
            }
        },

        log: function(str) {
            print(str);
        }
    };
};

jasmine.getEnv().addReporter(new RhinoReporter());
