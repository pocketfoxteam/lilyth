var plugins = {}

plugins._plugins = {}
plugins.load = function(n){
	try{
		plugins._plugins[n] = require('./plugins/'+n+'/plugin.js');
		plugins._plugins[n].init();
	}catch(e){
		console.error(e.stack);
	}
}
plugins.init = function(){
	try{
		var folders = fs.readdirSync('./appdata/plugins');
		for (var i = 0; i < folders.length; i++) {
			var stat = fs.lstatSync('./appdata/plugins/'+folders[i]);
			if(stat.isDirectory()){
				var statf = fs.lstatSync('./appdata/plugins/'+folders[i]);
				if(fs.existsSync('./appdata/plugins/'+folders[i]+'/plugin.js')){
					plugins.load(folders[i]);
				}
			}
		};
	}catch(e){
		console.error(e.stack);
	}
}

plugins.getList = function(){
	var plgs = [];
	for(plugin in plugins._plugins){
		if(plugins._plugins[plugin].show){
			plgs[plgs.length] = [plugin,plugins._plugins[plugin].name,plugins._plugins[plugin].icon];
		}
	}
	return plgs;
}