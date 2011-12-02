importPackage(java.lang);

var RhinoReporter = function() {
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
                System.out.print(EnvJasmine.green("."));
            } else {
                var i, msg,
                    specResults = spec.results().getItems();

                System.out.print(EnvJasmine.red("F"));

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
                suitePath.unshift(suite.description);
                suite = suite.parentSuite;
            }

            return suitePath.join(' - ');
        }
    };
};

jasmine.getEnv().addReporter(new RhinoReporter());
