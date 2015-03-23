var system = require("system");
var fs = require("fs");

var phestumLib = (function() {/*
var Tests = {};

var phestum = {
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
    
    assertFail : function (func) {
        var failed = false;
        try {
            func();
        } catch (e) {
            failed = true;
        }
        
        if (!failed) {
            throw("'phestum.assertFail' error. Given function didn't failed.")
        }
    },
};
*/}).toString().match(/\/\*([^]*)\*\//)[1];

eval(phestumLib);


// tests/files
if (fs.isDirectory("tests/files")) {
    Tests._files = {};
    var optionFiles = fs.list("tests/files/")
            .filter(function(item) {
                return [".", ".."].indexOf(item) == -1;
            })
            .map(function (item) {
                return item;
            });

    console.log("files: " + JSON.stringify(optionFiles));
    for (var p=0; p<optionFiles.length; p++) {
        Tests._files[optionFiles[p]] = fs.read("tests/files/" + optionFiles[p], {charset: "LATIN-1"});
    }
}

// prepare libraries
Tests._lib = fs.list("lib/")
        .filter(function(item) {
            return item.indexOf(".js") !== -1;
        })
        .map(function (item) {
            return 'lib/' + item;
        });
console.log("lib: " + JSON.stringify(Tests._lib));

// prepare tests
Tests._tests = fs.list("tests/")
        .filter(function(item) {
            return item.indexOf(".js") !== -1;
        })
        .map(function (item) {
            return 'tests/' + item;
        });

// load tests
for (Tests._counter=0; Tests._counter<Tests._tests.length; Tests._counter++) {
    eval(fs.read(Tests._tests[Tests._counter]));
}
Tests._testNames = Object.keys(Tests).filter(function (item) {
    return (item[0] !== "_" &&
            typeof(Tests[item]) === "function" &&
            item.indexOf("Test") > -1);
});
console.log("test: " + JSON.stringify(Tests._testNames));

// prepare test environment
var jsScripts = Tests._lib.concat(Tests._tests);
var page = require('webpage').create();
page.onError = function (msg, trace) {
    var msgStack = ['ERROR: ' + msg];
    if (trace && trace.length) {
        msgStack.push('**TRACE:');
        trace.forEach(function(t) {
          msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
        });
    }
    console.error("**" + msgStack.join('\n'));
    gotError = true;
};

page.onConsoleMessage = function(msg, lineNum, sourceId) {
    console.log('' + msg);
};

page.evaluate(function (script) {
    var scrEl = document.createElement("script");
    scrEl.text = script;
    document.body.appendChild(scrEl);
}, phestumLib);

for (var p=0; p<jsScripts.length; p++) {
    page.injectJs(jsScripts[p]);
}

page.evaluate(function (files) {Tests.files = files;}, Tests._files);

// do tests
var pass = 0;
var fail = 0;
for (var p=0; p<Tests._testNames.length; p++) {
    var testName = Tests._testNames[p];
    var gotError = false;
    console.log("\n\n" + testName);
    console.log("=============");

    page.evaluate(function (testName) {
        var scrEl = document.createElement("script");
        scrEl.text = "Tests." + testName + "();";
        document.body.appendChild(scrEl);
    }, testName);

    console.log("=============");
    if (gotError) {
        fail += 1;
        console.log("fail");
    } else {
        pass += 1;
        console.log("pass");
    }
}

console.log("\n\nPassed: " + pass);
console.log("Failed: " + fail);
if (fail) {
    phantom.exit(1);
} else {
    phantom.exit();
}
