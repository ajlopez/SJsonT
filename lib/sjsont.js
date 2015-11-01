
"use strict"

function asString(value) {
    return value.toString();
}

function asCode(text, name) {
    var code = "";
    
    if (name)
        code += "var " + name + " = $; ";
        
    var p = text.indexOf("{");
    
    if (p < 0)
        return "return " + JSON.stringify(text) + ";";
        
    var p2 = text.indexOf("}");
    
    var left = text.substring(0, p);
    var right = text.substring(p2 + 1);
    
    var exprcode = text.substring(p + 1, p2);
    
    var result = "";
    
    if (left.length)
        result += JSON.stringify(left) + " + ";
        
    result += "asString(" + exprcode + ")";
    
    if (right.length)
        result += " + " + JSON.stringify(right);
        
    return code + "return " + result + ";";
}

function makeFunction($code, $rules) {
    var $fn;
    eval("$fn = function ($) { " + $code + " }");
    return $fn;
}

function compileRule(rules, name) {
    var rule = rules[name];
    var type = typeof rule;
    
    if (type === 'function')
        return rule;
        
    if (type !== 'string')
        return null;
        
    var code = asCode(rule, name);
    
    return makeFunction(code, rules);
}

function compileRules(rules) {
    for (var n in rules)
        rules[n] = compileRule(rules, n);
}

function transform(data, rules) {
    compileRules(rules);
    
    if (rules.self)
        return rules.self(data);
        
    for (var n in data)
        if (rules[n])
            return rules[n](data[n]);
        
    return rules.self;
}

module.exports = {
    transform: transform
};

