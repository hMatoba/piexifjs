

var phestum = {
    version : "0.1.0",
    
    _isEqual : function (a, b) {
        if (typeof(a) !== typeof(b)) {
            return false;
        } else if (a === undefined && b === undefined){
            return true;
        } else if (a instanceof Array && b instanceof Array) {
            if (a.length !== b.length) {
                return false;
            }
            for (var p=0; p<a.length; p++) {
                if (!phestum._isEqual(a[p], b[p])){
                    return false;
                }
            }
            return true;
        } else if (typeof(a) === "object" && typeof(b) === "object") {
            if (a === null && b === null) {
                return true;
            }
            var propA = Object.getOwnPropertyNames(a);
            var propB = Object.getOwnPropertyNames(b);
            propA.sort();
            propB.sort();

            // check property names equality
            if (propA.length !== propB.length) {
                return false;
            } else {
                for (var p=0; p<propA.length; p++) {
                    if (!phestum._isEqual(propA[p], propB[p])){
                        return false;
                    }
                }
            }

            // check object value equality
            for (var p=0; p<propA.length; p++) {
                var prop = propA[p];
                if (!phestum._isEqual(a[prop], b[prop])){
                    return false;
                }
            }
            return true;
        } else if (typeof(a) === "string" || typeof(a) === "number") {
            if (a === b) {
                return true;
            } else {
                return false;
            }
        } else {
            throw("Got variable that cannot compare.");
        }
    },

    assertEqual : function (a, b) {
        if (!phestum._isEqual(a, b)) {
            throw("! " + JSON.stringify(a) + " != " + JSON.stringify(b));
        }
    },

    assertNotEqual : function (a, b) {
        if (phestum._isEqual(a, b)) {
            throw("! " + JSON.stringify(a) + " == " + JSON.stringify(b));
        }
    },
};


var Tests = {
    pass: 0,
    fail: 0,
    _exec: function () {
        var keys = Object.keys(Tests);
        var tests = keys.filter(function (item) {
            return (item[0] !== "_" &&
                    typeof(Tests[item]) === "function" &&
                    item.indexOf("Test") > -1);
        });
        console.log(JSON.stringify(tests));

        for (var p=0; p<tests.length; p++) {
            console.log("\n*************\n" + tests[p]);
            try {
                console.log("=============");
                Tests[tests[p]]();
                console.log("=============");
                console.log("passed.");
                Tests.pass += 1;
            } catch (e) {
                console.log("=============");
                console.log(e);
                console.log("failed.");
                Tests.fail += 1;
            }
        }

        console.log("\n\nPassed: " + Tests.pass);
        console.log("Failed: " + Tests.fail);
        if (Tests.fail) {
            return false;
        } else {
            return true;
        }
    },
};

(function () {
    var system = require("system");
    var fs = require("fs");
    
    // prepare tests
    var testFiles = fs.list("tests/")
            .filter(function(item) {
                return item.indexOf(".js") !== -1;
            })
            .map(function (item) {
                return 'tests/' + item;
            });

    console.log(testFiles);
    for (var p=0; p<testFiles.length; p++) {
        eval(fs.read(testFiles[p]));
    }


    // prepare libiraries
    if (system.args.length > 1) {
        var libFiles = system.args.slice(1);
        console.log("lib: " + JSON.stringify(libFiles));
        for (var p=0; p<libFiles.length; p++) {
            eval(fs.read(libFiles[p]));
        }
    }


    // files
    var files = {};
    if (fs.isDirectory("tests/files")) {
        var optionFiles = fs.list("tests/files/")
                .filter(function(item) {
                    return [".", ".."].indexOf(item) == -1;
                })
                .map(function (item) {
                    return item;
                });

        console.log(optionFiles);
        for (var p=0; p<optionFiles.length; p++) {
            files[optionFiles[p]] = fs.read("tests/files/" + optionFiles[p], {charset: "LATIN-1"});
        }
    }
    Tests.files = files;


    // run tests
    if (Tests._exec()) {
        phantom.exit();
    } else {
        phantom.exit(1);
    }
})();
