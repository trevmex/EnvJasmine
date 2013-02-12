# -*- encoding: utf-8 -*-

Gem::Specification.new do |s|
  s.name = "EnvJasmine"
  s.version = "1.7.2"

  s.authors = ["Trevor Menagh"]
  s.date = "2012-12-13"
  s.description = "EnvJasmine allows you to run headless JavaScript tests."
  s.summary = "EnvJasmine"
  s.email = "github@trevreport.org"
  s.executables = ['envjs_run_test','run_coverage.sh','run_all_tests.sh','run_test.sh']
  s.homepage = 'https://github.com/trevmex/envjasmine'
  s.files = ['lib/envjasmine.html',
			'lib/envjasmine.js',
			'lib/envjs/env.rhino.1.2.js',
			'lib/jasmine/MIT.LICENSE',
			'lib/jasmine/jasmine-html.js',
			'lib/jasmine/jasmine.css',
			'lib/jasmine/jasmine.js',
			'lib/jasmine/jasmine_favicon.png',
			'lib/jasmine-ajax/mock-ajax.js',
			'lib/jasmine-ajax/spec-helper.js',
			'lib/jasmine-jquery/jasmine-jquery-1.2.0.js',
			'lib/jasmine-jquery/jasmine-jquery.js',
			'lib/jasmine-rhino-reporter/jasmine-rhino-reporter.js',
      'lib/jscover/envjasmine-coverage.js',
      'lib/jscover/envjasmine-sonar-coverage-helper.js',
      'lib/jscover/envjasmine-sonar-coverage-properties.js',
      'lib/jscover/envjasmine-sonar-coverage-runner.js',
      'lib/jscover/JSCover-all.jar',
			'lib/rhino/js.jar',
			'lib/spanDir/spanDir.js',
			'include/dependencies.js',
			'include/jquery-1.4.4.js'
		]
end
