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
            if (spec.results().passed()) {
                System.out.print(green + "." + endColor);
            } else {
                var i, msg,
                    specResults = spec.results().getItems();

                System.out.print(red + "F" + endColor);

                msg = [
                    "FAILED",
                    "File : " + EnvJasmine.specFile,
                    "Suite: " + this.getSuiteName(spec.suite),
                    "Spec : " + spec.description
                ];

                for (i = 0; i < specResults.length; i++) {
                    msg.push(specResults[i].trace);
                }

                EnvJasmine.results.push(msg.join("\n"));
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
