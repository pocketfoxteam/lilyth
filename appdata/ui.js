//fs,fsextra,path,http,httpfr,gui,extract,os,exec,keyh

var debug = true;
var ui = {};

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
	window.addEventListener('keypress',function(e){
		if(e.keyCode == 32 && document.activeElement.nodeName != "INPUT"){
			
			e.preventDefault();
		}
	})
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
		OpenPluginOptions();
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

}

function pluginsShowInSidebar(){
	var plgs = plugins.getList();
	var ilist = "";
	for (var i = 0; i < plgs.length; i++) {
		ilist+= "<div class='plugin-item' plugin='"+plgs[i][0]+"'>"+
				"	<div class='l ovf allh'>"+
				"		<div class='plugin-icon l' style='background-image: url(\"plugins/"+plgs[i][0]+"/"+plgs[i][2]+"\");'></div>"+
				"		<div class='plugin-name l'>"+plgs[i][1]+"</div>"+
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
function OpenPluginOptions(){
	ui.pluginoptions.setAttribute('op','1');
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
	//sc.innerHTML = "";
	for (var i = 0; i < sources.length; i++) {
		//sc.innerHTML += sources[i];
	};
}


