var tr = require('..').transform;exports['Transform produces constant string'] = function (test) {    var result = tr("adam", { self: "hi" });        test.ok(result);    test.strictEqual(result, "hi");};exports['Transform produces self string'] = function (test) {    var result = tr("adam", { self: "{$}" });        test.ok(result);    test.strictEqual(result, "adam");};exports['Transform produces string using self string'] = function (test) {    var result = tr("adam", { self: "hi {$}" });        test.ok(result);    test.strictEqual(result, "hi adam");};