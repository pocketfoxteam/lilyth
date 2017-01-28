var fs = require('fs');
var path = require('path');
var utils = require('lilyth-utils');
var lilyth = {}

lilyth.package_name = "lilyth";
lilyth.name = "Lilyth";
lilyth.icon = "img/lilyth.png";
lilyth.show = true;

lilyth.sources = [];
lilyth.utils = utils;

lilyth.init = function(){
	var dt = utils.loadData('sources');
	if(dt){
		lilyth.sources = dt;
	}
	console.log(loadFiles());
}
lilyth.addSource = function(s,success,error){
	try{
		if(fs.existsSync(s)){
			var stat = fs.lstatSync(s);
			if(stat.isDirectory()){
				if(lilyth.sources.indexOf(s) < 0){
					lilyth.sources.push(s);
					utils.saveData('sources',lilyth.sources);
					if(typeof success != "undefined"){success("Source added");}
				}else{
					if(typeof error != "undefined"){error("The source already exists");}else{console.error("The source already exists");}
				}
			}
		}else{
			if(typeof error != "undefined"){error("The source not exists");}else{console.error("The source not exists");}
		}
	}catch(e){
		if(typeof error != "undefined"){error("The source is invalid");}else{console.error(e.stack);}
	}
}
lilyth.removeSource = function(s,success,error){
	try{
		var iof = lilyth.sources.indexOf(s);
		if(iof >= 0){
			lilyth.sources.splice(iof,1);
			utils.saveData('sources',lilyth.sources);
			if(typeof success != "undefined"){success("Source removed");}else{console.log("Source removed");}
		}else{
			if(typeof error != "undefined"){error("The source not exists");}else{console.error("The source not exists");}
		}
	}catch(e){
		if(typeof error != "undefined"){error("Unknown error");}else{console.error(e.stack);}
	}
}
lilyth.getSources = function(){
	return lilyth.sources;
}

lilyth.update = function(){}

lilyth.list = function(){}

lilyth.search = function(w){}
lilyth.get = function(id){}

function loadFiles(){
	var filesl = [];
	for (var i = 0; i < lilyth.sources.length; i++) {
		if(fs.existsSync(lilyth.sources[i])){
			var stat = fs.lstatSync(lilyth.sources[i]);
			if(stat.isDirectory()){
				var files = fs.readdirSync(lilyth.sources[i]);
				for (var ii = 0; ii < files.length; ii++) {
					var stat = fs.lstatSync(lilyth.sources[i]+"/"+files[ii]);
					if(stat.isFile()){
						var ext = path.extname(lilyth.sources[i]+"/"+files[ii]);
						if(ext = ".mp3"){
							filesl[filesl.length] = lilyth.sources[i]+"/"+files[ii];
						}
					}
				};
			}
		}
	};
	return filesl;
}

module.exports = lilyth;