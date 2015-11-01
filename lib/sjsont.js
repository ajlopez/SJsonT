
function compileRule(rule) {
    var type = typeof rule;
    
    if (type === 'function')
        return rule;
        
    if (type !== 'string')
        return null;
        
    var p = rule.indexOf('{$}');
    
    if (p < 0)
        return function (value) { return rule; };
        
    var left = rule.substring(0, p);
    var right = rule.substring(p + 3);  

    return function ($) {
        return left + $ + right;
    };
}

function compileRules(rules) {
    for (var n in rules)
        rules[n] = compileRule(rules[n]);
}

function transform(data, rules) {
    compileRules(rules);
    
    if (rules.self)
        return rules.self(data);
        
    return rules.self;
}

module.exports = {
    transform: transform
};

