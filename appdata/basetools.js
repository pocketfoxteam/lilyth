var fs=require('fs');
var fsextra = require('fs.extra');
var path = require('path');
var http = require('http');
var httpfr = require('follow-redirects').http;
var gui = require('nw.gui');
var extract = require('extract-zip');
var os = require("os");
var exec = require('child_process').exec;

function is(w,m){if(m.substr(0,1) == "#"){if(m.substr(1,m.length-1) == w.target.id){return true;}else{return false;}}else if(m.substr(0,1) == "."){fl=w.target.classList.length;for (var i = 0; i < fl; i++){if(w.target.classList[i] == m.substr(1,m.length-1)){return true;break;}else if(i==w.target.classList.length){return false;}};}}
function closest(w,m) {tar=w.target;while (tar.tagName != "HTML") {if(m.substr(0,1) == "#"){if(m.substr(1,m.length-1) == tar.id){return tar;}}else if(m.substr(0,1) == "."){fl=tar.classList.length;for (var i = 0; i < fl; i++){if(tar.classList[i] == m.substr(1,m.length-1)){return tar;break;}};}tar = tar.parentNode;}return null;}
function isclosest(w,m) {tar=w.target;while (tar.tagName != "HTML") {if(m.substr(0,1) == "#"){if(m.substr(1,m.length-1) == tar.id){return true;}}else if(m.substr(0,1) == "."){fl=tar.classList.length;for (var i = 0; i < fl; i++){if(tar.classList[i] == m.substr(1,m.length-1)){return true;break;}};}tar = tar.parentNode;if(tar == null){return false;}}return false;}
function booltoint(w){if(w){return 1;}else{return 0;}}
function strtobool(w){if(w == "true"){return true;}else{return false;}}
function getID(w){return document.getElementById(w);}
function getClass(w){return document.getElementsByClassName(w);}
function show(e){e.style.display='block'};function hide(e){e.style.display='none'};ajax=[];
function str2hex(str){response="";for (var i = 0; i < str.length; i++) {hex=str.charCodeAt(i).toString(16);response+=("000"+hex).slice(-4);};return response;}
function hex2str(str){response="";hexes=str.match(/.{1,4}/g) || [];for (var i = 0; i < hexes.length; i++) {response+=String.fromCharCode(parseInt(hexes[i],16));};return response;}
function btoaU(str) {
	return window.btoa(unescape(encodeURIComponent(str)));
}

function atobU(str) {
	return decodeURIComponent(escape(window.atob(str)));
}

Array.prototype.move = function (old_index, new_index) {
	while (old_index < 0) {
		old_index += this.length;
	}
	while (new_index < 0) {
		new_index += this.length;
	}
	if (new_index >= this.length) {
		var k = new_index - this.length;
		while ((k--) + 1) {
			this.push(undefined);
		}
	}
	this.splice(new_index, 0, this.splice(old_index, 1)[0]);
	return this; // for testing purposes
};
path.split=function(w){
	w=w.split('/');
	w[0]='/';
	if(w[w.length-1] == ""){w.splice(w.length-1,1);}
	return w;
};

function fileExists(w){
	try{
		fs.statSync(w);
		return true;
	}catch(e){
		return false;
	}
}

var reA = /[^a-zA-Z]/g;
var reN = /[^0-9]/g;
function sortAlphaNum(a,b) {
	a=a.toLowerCase();
	b=b.toLowerCase();
	var AInt = parseInt(a, 10);
	var BInt = parseInt(b, 10);

	if(isNaN(AInt) && isNaN(BInt)){
		var aA = a.replace(reA, "");
		var bA = b.replace(reA, "");
		if(aA === bA) {
			var aN = parseInt(a.replace(reN, ""), 10);
			var bN = parseInt(b.replace(reN, ""), 10);
			return aN === bN ? 0 : aN > bN ? 1 : -1;
		} else {
			return aA > bA ? 1 : -1;
		}
	}else if(isNaN(AInt)){
		return 1;
	}else if(isNaN(BInt)){
		return -1;
	}else{
		return AInt > BInt ? 1 : -1;
	}
}

//Download function with progress
function download(url,dest,callback,onprog){
	try{
		if(fs.statSync(dest)){
			fs.unlink(dest);
		}
	}catch(e){}
	var file = fs.createWriteStream(dest);
	var request = httpfr.get(url, function (response) {
		var len = parseInt(response.headers['content-length'], 10);
		var cur = 0;
		response.pipe(file);
		response.on("data", function(chunk) {
			cur += parseFloat(chunk.length);
			if(onprog){
				onprog(parseFloat((100.0 * (parseFloat(cur) / parseFloat(len))).toFixed(2)) || 0);
			}
		});
		file.on('finish', function () {
			file.close(callback); // close() is async, call callback after close completes.
		});
		file.on('error', function (err) {
			fs.unlink(dest); // Delete the file async. (But we don't check the result)
			if (callback)
				callback(err.message);
		});
	});
}

/** /
function extractAndReload(){
	extract('update.zip', {dir: './'}, function (err) {
		moveFilesUp('osuplayer-'+branch);
	})
}
/**/

/*if(is(e,'.showinexplorer')){
		var fpath = cachesongs[atobU(closest(e,'.song').getAttribute('hash'))].path;
		switch(os.platform()){
			case "linux":
				exec('xdg-open "'+fpath+'"',function(err){
					if(err){
						console.log(err);
					}
				});
			break;
			case "win32":
				exec('start "" "'+fpath.replace(/\//g,"\\")+'"',function(err){
					if(err){
						console.log(err);
					}
				});
			break;
			case "darwin":
				exec('open "'+fpath+'"',function(err){
					if(err){
						console.log(err);
					}
				});
			break;
			default:
				alert("Not support for your system");
			break;
		}
	}
	if(is(e,'#openrepo')){
		gui.Shell.openExternal("https://github.com/rurigk/osuplayer");
	}*/

var globalMediakeyPlay = {key : "MediaPlayPause"};
var globalMediaNextTrack = {key : "MediaNextTrack"};
var globalMediaPrevTrack = {key : "MediaPrevTrack"};

var PlayPauseShortcut = new gui.Shortcut(globalMediakeyPlay);
var NextTrackShortcut = new gui.Shortcut(globalMediaNextTrack);
var PrevTrackShortcut = new gui.Shortcut(globalMediaPrevTrack);

PlayPauseShortcut.on('active', function() {});
NextTrackShortcut.on('active', function() {});
PrevTrackShortcut.on('active', function() {});

PlayPauseShortcut.on('failed', function(msg) {console.log(msg);});
NextTrackShortcut.on('failed', function(msg) {console.log(msg);});
PrevTrackShortcut.on('failed', function(msg) {console.log(msg);});

gui.App.registerGlobalHotKey(PlayPauseShortcut);
gui.App.registerGlobalHotKey(NextTrackShortcut);
gui.App.registerGlobalHotKey(PrevTrackShortcut);

var keyh={};
keyh.shift=false;
keyh.ctrl=false;
keyh.altk=false;

window.addEventListener('load',function(){
	window.addEventListener("click",function(e){
		clickManager(e);
	})
	window.addEventListener('keydown', function(e){
		if(e.keyIdentifier === 'F12' && debug){main_window.showDevTools();}
		if(e.keyCode == 16){keyh.shift=true;}
		if(e.keyCode == 17){keyh.ctrl=true;}
		if(e.keyCode == 18){keyh.altk=true;}
		if(e.keyIdentifier === 'F5' && debug){
			if(keyh.ctrl){
				main_window.reloadDev();
			}else{
				window.location.reload();
			}
		}
	});
	window.addEventListener('keyup', function(e){
		if(e.keyCode == 16){keyh.shift=false;}
		if(e.keyCode == 17){keyh.ctrl=false;}
		if(e.keyCode == 18){keyh.altk=false;}
	});
	//ui.songslist.addEventListener('scroll',updateThumbnails);
});