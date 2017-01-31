var fs = require('fs');
var path = require('path');
var utils = require('lilyth-utils')(path.dirname(module.filename));
var taglib = require('nodetaglib');
var lilyth = {}

lilyth.package_name = "lilyth";
lilyth.name = "Lilyth";
lilyth.icon = "img/lilyth.png";
lilyth.show = true;
lilyth.state = 0;
lilyth.state_text = "";
lilyth.default_order = ["title","artist","album"];

lilyth.sources = [];
lilyth.utils = utils;

var tracks = {}
var files = [];

lilyth.init = function(){
	var dt = utils.loadData('sources');
	if(dt){
		lilyth.sources = dt;
	}
	files = loadFiles();
	processData(files);
}
lilyth.addSource = function(s,success,error){
	try{
		if(fs.existsSync(s)){
			var stat = fs.lstatSync(s);
			if(stat.isDirectory()){
				if(lilyth.sources.indexOf(s) < 0){
					lilyth.sources.push(s);
					utils.saveData('sources',lilyth.sources);
					files = loadFiles();
					processData(files);
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
			files = loadFiles();
			processData(files);
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

lilyth.list = function(callback){
	return tracks;
}

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
						if(ext == ".mp3" && typeof tracks[lilyth.sources[i]+"/"+files[ii]] == "undefined"){
							filesl[filesl.length] = lilyth.sources[i]+"/"+files[ii];
						}
					}
				};
			}
		}
	};
	return filesl;
}
function processData(d){
	for(key in tracks){
		if(d.indexOf(key) < 0){
			//delete tracks[key];
		}
	}
	queue = new Queue(d,function(w,step){
		taglib.get(w,function(d){
			if(d.title == ""){
				d.title = path.basename(w).replace(/\.mp3/g,"");
			}
			tracks[w] = d;
			queue.iterate();
		});
	},function(t,i){
		lilyth.state = 1;
	})
}

function Queue(data,onstep,onend){
	this.data = data;
	this.onstep = onstep;
	this.onend = onend;
	this.index = 0;
	this.iterate();
}
Queue.prototype.iterate = function() {
	if(this.index < this.data.length){
		this.onstep(this.data[this.index]);
		this.index+=1;
	}else{
		this.onend(this.data.length,this.index);
	}
};

module.exports = lilyth;