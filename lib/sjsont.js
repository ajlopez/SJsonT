
"use strict"

function isArrayRule(text) {
    var l = text.length;
    
    if (l <= 3)
        return false;
        
    return text.substring(l - 3, l) === '[*]';
}

function asString(value) {
    return value.toString();
}

function asRuleName(text, name) {
    if (text[0] === '$')
        return name + text.substring(1);
        
    return text;
}

function asRuleArgument(text) {
    var p = text.indexOf("[");
    
    if (p >= 0)
        text = text.substring(0, p);
    
    if (text === 'self')
        text = "$";
        
    return text;
}

function asCode(rules, name) {
    var text = rules[name];
    
    var code = "";
    
    if (name && !isArrayRule(name))
        code += "var " + name + " = $; ";
        
    var p = text.indexOf("{");
    
    if (p < 0)
        return "return " + JSON.stringify(text) + ";";
        
    var p2 = text.indexOf("}");
    
    var left = text.substring(0, p);
    var right = text.substring(p2 + 1);
    
    var result;
    result = "";
    
    if (left.length)
        result += JSON.stringify(left) + " + ";
    
    var exprcode = text.substring(p + 1, p2);
    var rulename = asRuleName(exprcode, name);
    
    if (name != rulename && rules[rulename]) {
        var rulearg = asRuleArgument(rulename);
        
        result += "$rules[" + JSON.stringify(rulename) + "](" + rulearg + ")";
    }
    else            
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

function makeArrayFunction($fn) {
    var $afn;
    eval("$afn = function ($) { var $r = ''; for (var $n in $) $r += $fn($[$n]); return $r; }");
    return $afn;
}

function compileRule(rules, name) {
    var rule = rules[name];
    var type = typeof rule;
    
    if (type === 'function')
        return rule;
        
    if (type !== 'string')
        return null;
        
    var code = asCode(rules, name);
    
    var fn = makeFunction(code, rules);
    
    if (isArrayRule(name))
        return makeArrayFunction(fn);
        
    return fn;
}

function compileRules(rules) {
    for (var n in rules)
        rules[n] = compileRule(rules, n);
}

function transform(data, rules) {
    compileRules(rules);
    
    if (rules.self)
        return rules.self(data, rules);
        
    for (var n in data)
        if (rules[n])
            return rules[n](data[n]);
        
    return rules.self;
}

module.exports = {
    transform: transform
};

