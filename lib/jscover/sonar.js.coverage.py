#!/usr/bin/env python
from subprocess import call
from array import array
import re
import os

# files and directory to update
project_dir = os.path.abspath("..") # root directory of the project.
original_code_dir = project_dir + "/samples/" # javascript src directory. this should have trailing "/"
instrumented_dir = project_dir + "/instrumented/" # directory to place instrumented code. this should have trailing "/"
output_dir = project_dir + "/reports" # directory to place reports. this can't have trailing "/"
js_cover_file = project_dir+"/lib/jscover/JSCover-all.jar" # location of JSCover-all.jar
run_all_tests_file = project_dir+"/bin/run_all_tests.sh" # locaion of run_all_tests file
no_instrument = ("ajaxDemo.js") # list of files or directories to exclude (relative path from javascript source directory)


# create directories that will be used
print ("Creating temp directories")
os.system("mkdir -p " + instrumented_dir) # directory to put instrumented code
os.system("mkdir -p " + output_dir) # coverage output directory

# instrument the javascript code
# no-instrument documentation:  http://tntim96.github.com/JSCover/manual/manual.xml#fileMode
print("Instrumenting")
no_i = ""
for file_or_dir in no_instrument:
  no_i = no_i + " --no-instrument="+file_or_dir
os.system("java -jar "+js_cover_file+" -fs --branch "+no_i+" "+original_code_dir+" "+instrumented_dir)

# some evil code is neccessary to get this to work :(
# hopefully we'll get rid of this soon
print("Exposing coverage hooks to EnvJasmine")
for root, dirs, files in os.walk(instrumented_dir):
    for name in files:
        path = os.path.join(root, name)
        o = open(path)
        data = o.read()
        o.close()
        data = re.sub(r'this\._\$jscoverage|(?<!\.)_\$jscoverage',"EnvJasmine.jscoverage", data)
        o = open(path,"w")
        o.write( data )
        o.close()

# run tests with instrumented code
print("Running instrumented tests")
os.system(run_all_tests_file + " --jsDir="+instrumented_dir)

# convert json file into lcov file which sonar can read 
print("Converting Output to lcov")
os.system("java -cp "+js_cover_file+" jscover.report.Main --format=LCOV "+output_dir+" "+output_dir)

# The lcov file includes branch coverage but sonar can't read it, so remove it
print("converting lcov to be compatible with sonar 2")
o = open(output_dir+"/jsTestDriver.conf-coverage.dat","w")
data = open(output_dir+"/jscover.lcov").read()
data = re.sub(output_dir,original_code_dir, data)
regex = re.compile('^BRDA:.*$', re.MULTILINE)
data = regex.sub("", data)
o.write( data )
o.close()

print("Coverage file ready to be picked up by sonar")

# run sonar, it will pick up the code coverage file
print("Running Sonar")
os.system("cd "+project_dir+"; mvn sonar:sonar -f "+project_dir+"/sonar.js.xml")

print("Cleanup")
os.system("rm -rf "+output_dir)
os.system("rm -rf "+instrumented_dir)