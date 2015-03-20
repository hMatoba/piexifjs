var phestum = {
    version : "0.2.0a",
    
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
    _exec: function () {
        var pass = 0;
        var fail = 0;
        var keys = Object.keys(Tests);
        var tests = keys.filter(function (item) {
            return (item[0] !== "_" &&
                    typeof(Tests[item]) === "function" &&
                    item.indexOf("Test") > -1);
        });
        console.log("tests: " + JSON.stringify(tests));

        for (var p=0; p<tests.length; p++) {
            console.log("\n*************\n" + tests[p]);
            try {
                console.log("=============");
                Tests[tests[p]]();
                console.log("=============");
                console.log("passed.");
                pass += 1;
            } catch (e) {
                console.log("=============");
                console.log(e);
                console.log("failed.");
                fail += 1;
            }
        }

        console.log("\n\nPassed: " + pass);
        console.log("Failed: " + fail);
        if (fail) {
            return false;
        } else {
            return true;
        }
    },
};


// test process ++++++++++++++++++++++++++++++++++++
var system = require("system");
var fs = require("fs");

// tests/files
if (fs.isDirectory("tests/files")) {
    Tests.files = {};
    var optionFiles = fs.list("tests/files/")
            .filter(function(item) {
                return [".", ".."].indexOf(item) == -1;
            })
            .map(function (item) {
                return item;
            });

    console.log("files: " + JSON.stringify(optionFiles));
    for (var p=0; p<optionFiles.length; p++) {
        Tests.files[optionFiles[p]] = fs.read("tests/files/" + optionFiles[p], {charset: "LATIN-1"});
    }
}

// prepare libraries
Tests._libs = [];
if (system.args.length > 1) {
    var libFiles = system.args.slice(1);
    console.log("lib: " + JSON.stringify(libFiles));
    Tests._libs = libFiles.map(function (i) {
        return fs.read(i);
    });
}

// prepare tests
Tests._tests = fs.list("tests/")
        .filter(function(item) {
            return item.indexOf(".js") !== -1;
        })
        .map(function (item) {
            return 'tests/' + item;
        });

// load libs and tests
for (var p=0; p<Tests._libs.length; p++) {
    eval(Tests._libs[p]);
}
for (var p=0; p<Tests._tests.length; p++) {
    eval(fs.read(Tests._tests[p]));
}

// run tests
if (Tests._exec()) {
    phantom.exit();
} else {
    phantom.exit(1);
}
