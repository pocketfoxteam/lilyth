//fs,fsextra,path,http,httpfr,gui,extract,os,exec,keyh

var debug = true;
var ui = {};
var pluginslist = [];
var selected_plugin = "";
var media_list_hash = "";
var playing_media = "";
var playing_media_plugin = "";
var selected_media = "";

//Main window
var main_window = {};
main_window=gui.Window.get(0);
main_window.maximized=false;
main_window.on('maximize',function(){main_window.maximized=true;})
main_window.on('unmaximize',function(){main_window.maximized=false;})
main_window.on('resize',function(){})

var audio = new Audio();
audio.volume = (typeof localStorage['volume'] != "undefined")? parseFloat(localStorage['volume']) : 1;
audio.addEventListener('ended',function(){
	
})
audio.addEventListener('timeupdate',function(){
})

window.addEventListener('load',function(){
	loadElements();
	plugins.init();
	pluginsShowInSidebar();
	selected_plugin = pluginslist[0][0];
	DisplayMediaItems();
	window.addEventListener('keypress',function(e){
		if(e.keyCode == 32 && document.activeElement.nodeName != "INPUT"){
			
			e.preventDefault();
		}
	})
	setInterval(function(){
		DisplayMediaItems();
	},1000)
});

function loadElements(){
	ui.modal = document.querySelector('.window-modal');
	ui.pluginoptions = document.querySelector('.plugin-options-box');
}

function clickManager(e){
	if(is(e,'.closewindow')){window.close();}
	if(is(e,'.maxwindow')){if(!main_window.maximized){main_window.maximize();}else{main_window.maximized=false;main_window.unmaximize();}}
	if(is(e,'.minwindow')){main_window.minimize();}

	if(is(e,'.plugin-options-button')){
		var pluginname = closest(e,'.plugin-item').getAttribute('plugin');
		SetPluginBoxSources(plugins._plugins[pluginname].getSources());
		ResetPluginBox();
		OpenModal();
		OpenPluginOptions(pluginname);
	}
	if(is(e,'.plugin-options-box-close')){
		ClosePluginOptions();
		CloseModal();
	}
	if(is(e,'.plugin-options-box-sidebar-button')){
		var target = e.target.getAttribute('target');
		var els = document.querySelectorAll('.plugin-options-box-section');
		var el = document.querySelector('.plugin-options-box-section[sid="'+target+'"]');
		for (var i = 0; i < els.length; i++) {
			els[i].setAttribute('op','0');
		};
		el.setAttribute('op','1');
	}
	if(is(e,'.addsource')){
		var pluginname = closest(e,'.plugin-options-box').getAttribute('plugin');
		var iel = document.querySelector('.source-ibox');
		var sourceinput = iel.value;
		iel.value = "";
		plugins._plugins[pluginname].addSource(sourceinput,function(m){
			SetPluginBoxSources(plugins._plugins[pluginname].getSources());
			alert(m);
		},function(e){
			SetPluginBoxSources(plugins._plugins[pluginname].getSources());
			alert(e);
		})
	}
	if(is(e,'.removesrc')){
		var pluginname = closest(e,'.plugin-options-box').getAttribute('plugin');
		var source = atobU(closest(e,'.source').getAttribute('source'));
		plugins._plugins[pluginname].removeSource(source,function(m){
			SetPluginBoxSources(plugins._plugins[pluginname].getSources());
			alert(m);
		},function(e){
			SetPluginBoxSources(plugins._plugins[pluginname].getSources());
			alert(e);
		})
	}
	if(isclosest(e,'.media-item')){
		var trackhash = closest(e,'.media-item').getAttribute('track');
		selected_media = trackhash;
		SelectMediaItem(trackhash);
		if(e.detail == 2){
			Play(trackhash);
		}
	}
	if(isclosest(e,'.plugin-item') && !is(e,'.plugin-options-button')){
		var pluginname = closest(e,'.plugin-item').getAttribute('plugin');
		selected_plugin = pluginname;
		DisplayMediaItems();
	}
}

function pluginsShowInSidebar(){
	pluginslist = plugins.getList();
	var ilist = "";
	for (var i = 0; i < pluginslist.length; i++) {
		ilist+= "<div class='plugin-item' plugin='"+pluginslist[i][0]+"'>"+
				"	<div class='l ovf allh'>"+
				"		<div class='plugin-icon l' style='background-image: url(\"plugins/"+pluginslist[i][0]+"/"+pluginslist[i][2]+"\");'></div>"+
				"		<div class='plugin-name l'>"+pluginslist[i][1]+"</div>"+
				"	</div>"+
				"	<div class='r ovf allh'>"+
				"		<div class='plugin-options-button l bz'>&#xF013;</div>"+
				"	</div>"+
				"</div>";
	};
	document.querySelector('.plugin-list').innerHTML = ilist;
}

function OpenModal(){
	ui.modal.setAttribute('op','1');
}
function CloseModal(){
	ui.modal.setAttribute('op','0');
}
function OpenPluginOptions(plugin){
	ui.pluginoptions.setAttribute('op','1');
	ui.pluginoptions.setAttribute('plugin',plugin);
}
function ClosePluginOptions(){
	ui.pluginoptions.setAttribute('op','0');
}
function ResetPluginBox(){
	var els = document.querySelectorAll('.plugin-options-box-section');
	var el = document.querySelector('.plugin-options-box-section[sid="general"]');
	for (var i = 0; i < els.length; i++) {
		els[i].setAttribute('op','0');
	};
	el.setAttribute('op','1');
}
function SetPluginBoxSources(sources){
	var sc = document.querySelector('.sources-list');
	sc.innerHTML = "";
	for (var i = 0; i < sources.length; i++) {
		sc.innerHTML += 
		"<div class='source bz' source='"+btoaU(sources[i])+"'>"+
		"	<div class='l'>"+sources[i]+"</div>"+
		"	<div class='r nosel'>"+
		"		<div class='l removesrc'>&#xF00D;</div>"+
		"	</div>"+
		"</div>";
	};
}
function DisplayMediaItems(w,fu){
	var w = selected_plugin;
	var fu = (typeof fu != "undefined")? fu:false;
	var list = plugins._plugins[w].list();
	var hash = btoaU(JSON.stringify(list));
	if(hash == media_list_hash && !fu){
		return false;
	}
	media_list_hash = hash;
	var ht = "";
	for (track in list) {
		var fields = "";
		for (var i = 0; i < plugins._plugins[w].default_order.length; i++) {
			var key = plugins._plugins[w].default_order[i];
			fields +="<div class='plugin-content-column custom_"+key+"' primary='"+((i==0)? 'true':'false')+"' >"+list[track][key]+"</div>";
		};
		var bta = btoaU(track);
		ht += 
			"<div class='media-item' sel='"+((bta == selected_media)? 1:0)+"' playing='0' track='"+bta+"'>"+
			fields+
			"</div>";
	};
	document.querySelector('.plugin-content-items').innerHTML = ht;
}

function SelectMediaItem(t){
	var els = document.querySelectorAll('.media-item');
	var el = document.querySelector('.media-item[track="'+t+'"]');
	for (var i = 0; i < els.length; i++) {
		els[i].setAttribute('sel','0');
	};
	el.setAttribute('sel','1');
}

function Play(w){
	playing_media_plugin = selected_plugin;
	playing_media = w;
	var src = atobU(w);
	audio.src = src;
	audio.play();
}