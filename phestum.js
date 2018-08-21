var system = require("system");
var fs = require("fs");

var phestumLib = (function () {/*
var Tests = {};
Tests.conc = {"pass":0, "fail":0};

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
            throw("'phestum.assertFail' error. Given function didn't failed.");
        }
    },
};
*/}).toString().match(/\/\*([^]*)\*\//)[1];

eval(phestumLib);


// tests/files
if (fs.isDirectory("tests/files")) {
    Tests._files = {};
    var optionFiles = fs.list("tests/files/")
            .filter(function (item) {
                return [".", ".."].indexOf(item) == -1;
            });

    console.log("files: " + JSON.stringify(optionFiles));
    for (var p=0; p<optionFiles.length; p++) {
        Tests._files[optionFiles[p]] = fs.read("tests/files/" + optionFiles[p], {charset: "LATIN-1"});
    }
}

// prepare libraries
Tests._libs = [];
if (system.args.length > 1) {
    Tests._libs = system.args.slice(1);
    console.log("lib: " + JSON.stringify(Tests._libs));
}

// prepare tests
Tests._tests = fs.list("tests/")
        .filter(function(item) {
            return item.indexOf(".js") !== -1;
        })
        .map(function (item) {
            return 'tests/' + item;
        });

// prepare test environment
var jsScripts = Tests._libs.concat(Tests._tests);
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
};

page.onConsoleMessage = function(msg, lineNum, sourceId) {
    if (msg == "finished phestum tests.") {
        var conc = page.evaluate(function () {return Tests.conc;});
        console.log("\n\nPassed: " + conc.pass);
        console.log("Failed: " + conc.fail);
        if (conc.fail) {
            //phantom.exit(1);
            setTimeout(function(){
                phantom.exit(1);
            }, 0);
        } else {
            //phantom.exit();
            setTimeout(function(){
                phantom.exit();
            }, 0);
        }
    } else {
        console.log('' + msg);
    }
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

// run tests
page.evaluate(function () {
    Tests._testNames = Object.keys(Tests).filter(function (item) {
        return (item[0] !== "_" &&
                typeof(Tests[item]) === "function" &&
                item.indexOf("Test") > -1);
    });
    console.log("test: " + JSON.stringify(Tests._testNames));
    var tests = {};
    for (var p=0; p<Tests._testNames.length; p++) {
        (function () {
            var test;
            var testName = Tests._testNames[p];
            if (testName.indexOf("Async") == -1) {
                test = function () {
                    var gotError = false;
                    try {
                        Tests[testName]();
                    } catch (e) {
                        console.log(e);
                        if ("stack" in e) {
                            console.log(e["stack"].split("at phantomjs://webpage.evaluate()")[0]);
                        }
                        gotError = true;
                    }
                    return gotError;
                };
            } else {
                test = function () {
                    try {
                        Tests[testName](function () {
                                            Tests["_" + testName] = 1;
                                        }, function (sec) {
                                            Tests["__" + testName] = sec * 1000;
                                        });
                    } catch (e) {
                        console.log(e);
                        if ("stack" in e) {
                            console.log(e["stack"].split("at phantomjs://webpage.evaluate()")[0]);
                        }
                    }
                };
            }
            tests[testName] = test;
        })();
    }

    function recurTests (tests) {
        if (Object.keys(tests).length == 0) {
            console.log("finished phestum tests.");
            return;
        }
        
        var testName = Object.keys(tests)[0];
        var test = tests[testName];
        delete tests[testName];

        console.log("\n\n" + testName);
        console.log("=============");
        var gotError = test();
        if (testName.indexOf("Async") == -1) {
            console.log("=============");
            if (gotError) {
                Tests.conc.fail += 1;
                console.log("fail");
            } else {
                Tests.conc.pass += 1;
                console.log("pass");
            }

            recurTests(tests);
        } else {
            var secToWait = Tests["__" + testName] || 1000;
            setTimeout(function () {
                console.log("=============");
                if (Tests["_" + testName] == 1) {
                    Tests.conc.pass += 1;
                    console.log("pass");
                } else {
                    console.log("Couldn't catch test finish.");
                    Tests.conc.fail += 1;
                    console.log("fail");
                }
                recurTests(tests);
            }, secToWait);
        }
    }
    recurTests(tests);
    
});
