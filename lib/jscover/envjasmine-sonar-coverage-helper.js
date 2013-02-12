importPackage(java.io);
importPackage(java.util);

EnvJasmine.coverage.executeCommand = function(str, dir) {
    // run shell command
    try {
        p = Runtime.getRuntime().exec(str, null, dir ? new File(dir) : null);
        br = new BufferedReader(new InputStreamReader(p.getInputStream()));
        line = null;
        while (( line = br.readLine()) != null) {
            print(line);
        }
    } catch (e) {
        e.printStackTrace();
    }
}

EnvJasmine.coverage.recurseTransform = function(path, transform) {
    // recurse over every file in directory tree and do a transform on the js files
    var file = new File(path);
    var list = file.listFiles();
    for ( var i = 0; i < list.length; i++) {
        var f = list[i];
        if (f.isDirectory()) {
            EnvJasmine.coverage.recurseTransform(f.getAbsolutePath(), transform);
        } else if (f.getAbsolutePath().endsWith(".js")) {
            s = (new Scanner(f)).useDelimiter("\\Z");
            if (s) {
                try {
                    content = s.next();
                    content = transform(content);
                    s.close();
                    out = new PrintWriter(f);
                    out.print(content);
                } catch (e) {
                    print(e);
                } finally {
                    try {
                        s.close();
                    } catch (e) {
                    }
                    try {
                        out.close();
                    } catch (e) {
                    }
                }
            }
        }
    }
}