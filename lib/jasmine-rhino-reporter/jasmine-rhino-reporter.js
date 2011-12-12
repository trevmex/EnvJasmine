importPackage(java.lang);

var RhinoReporter = function() {
    return {
        reportRunnerStarting: function(runner) {
            if (EnvJasmine.incrementalOutput) {
                print(EnvJasmine.specFile);
            }
        },

        reportRunnerResults: function(runner) {
            var results = runner.results();

            if (EnvJasmine.incrementalOutput) {
                print();
                print([
                    EnvJasmine.green("Passed: " + (results.passedCount - EnvJasmine.passedCount)),
                    EnvJasmine.red("Failed: " + (results.failedCount - EnvJasmine.failedCount)),
                    EnvJasmine.plain("Total: " + (results.totalCount - EnvJasmine.totalCount))
                ].join(' '));
            }

            EnvJasmine.passedCount = results.passedCount;
            EnvJasmine.failedCount = results.failedCount;
            EnvJasmine.totalCount = results.totalCount;
        },

        reportSuiteResults: function(suite) {
        },

        reportSpecStarting: function(spec) {
        },

        reportSpecResults: function(spec) {
            if (spec.results().passed()) {
                System.out.print(EnvJasmine.green("."));
            } else {
                var i, msg, result,
                    specResults = spec.results().getItems();

                System.out.print(EnvJasmine.red("F"));

                msg = [
                    "FAILED",
                    "File : " + EnvJasmine.specFile,
                    "Suite: " + this.getSuiteName(spec.suite),
                    "Spec : " + spec.description
                ];

                for (i = 0; i < specResults.length; i++) {
                    result = specResults[i];
                    if (result.type == 'log') {
                        msg.push(result.toString());
                    } else if (result.type == 'expect' && result.passed && !result.passed()) {
                        msg.push(result.message);

                        if (result.trace.stack) {
                            msg.push(specResults[i].trace.stack);
                        }
                    }
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
