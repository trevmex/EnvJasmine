importPackage(java.lang);

var RhinoReporter = function() {
    var green = EnvJasmine.green,
        red = EnvJasmine.red,
        endColor = EnvJasmine.endColor;

    if (EnvJasmine.disableColor) {
        green = "";
        red = "";
        endColor = "";
    }

    return {
        reportRunnerStarting: function(runner) {
        },

        reportRunnerResults: function(runner) {
            EnvJasmine.passedCount = runner.results().passedCount;
            EnvJasmine.failedCount = runner.results().failedCount;
            EnvJasmine.totalCount = runner.results().totalCount;
        },

        reportSuiteResults: function(suite) {
        },

        reportSpecStarting: function(spec) {
        },

        reportSpecResults: function(spec) {
            var i, specResults = spec.results().getItems();

            if (spec.results().passed()) {
                System.out.print(green + "." + endColor);
            } else {
                System.out.print(red + "F" + endColor);
                EnvJasmine.results += red + "\nFAILED\n";
                EnvJasmine.results += "File : " + EnvJasmine.specFile + "\n";
                EnvJasmine.results += "Suite: " + this.getSuiteName(spec.suite) + "\n";
                EnvJasmine.results += "Spec : " + spec.description + "\n";
                for (i = 0; i < specResults.length; i += 1) {
                    EnvJasmine.results += specResults[i].trace + "\n";
                }
                EnvJasmine.results += endColor;
            }
        },

        log: function(str) {
        },

        getSuiteName: function(suite) {
            var suitePath = [];

            while (suite) {
                suitePath.push(suite.description);
                suite = suite.parentSuite;
            }

            return suitePath.join(' - ');
        }
    };
};

jasmine.getEnv().addReporter(new RhinoReporter());
