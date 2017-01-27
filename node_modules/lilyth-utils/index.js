var fs = require('fs')
var path = require('path')

var utils = {};
var base = path.dirname(module.parent.filename);

utils.saveData = function(n,d){
	n = base+"/gendata/"+n;
	if(fs.existsSync(base+"/gendata/")){
		fs.writeFileSync(n, JSON.stringify(d), 'utf8');
	}else{
		fs.mkdirSync(base+"/gendata");
		fs.writeFile(n, JSON.stringify(d), 'utf8');
	}
}
utils.loadData = function(n){
	n = base+"/gendata/"+n;
	if(fs.existsSync(n)){
		return JSON.parse(fs.readFileSync(n,{encoding:'utf8'}));
	}else{
		return false;
	}
}

module.exports = utils;