var div_Wrapper = document.getElementById('wrapper');
var div_Header = document.getElementById('header');
var div_Section = document.getElementById('section');
var div_State = document.getElementById('state');
var div_StateContainer = document.getElementById('state__container');
var div_StateGas = document.getElementById('state__gas');
var div_StateBr = document.getElementById('state__br');
var div_StateOther = document.getElementById('state__other');
var div_Screen = document.getElementById('screen');
var div_ScreenCanvas = document.getElementById('screen__canvas');
var div_ScreenButtons = document.getElementById('screen__buttons');
var div_ScreenMessage = document.getElementById('screen__message');

fn_ScreenSize();
window.addEventListener('resize', fn_ScreenSize);

function isMobile() {
	try {
		if(/Android|webOS|iPhone|iPad|iPod|pocket|psp|kindle|avantgo|blazer|midori|Tablet|Palm|maemo|plucker|phone|BlackBerry|symbian|IEMobile|mobile|ZuneWP7|Windows Phone|Opera Mini/i.test(navigator.userAgent)) {
			 return true;
		};
		return false;
	} catch(e){ console.log("Error in isMobile"); return false; }
}

function fn_ScreenSize () {
	if (isMobile()) {
		var WIwidth = screen.width;
		var WIheight = screen.height;
		window.removeEventListener('resize', fn_ScreenSize);
	} else {
		if (window.innerWidth >= window.innerHeight){
			if (window.innerWidth <= 800){
				var WIwidth = 800;
			} else {
				WIwidth = window.innerWidth;
			}
			
			if (window.innerHeight <= 600){
				var WIheight = 600;
			} else {
				WIheight = window.innerHeight;
			} 
		} else {
			if (window.innerWidth <= 600){
				var WIwidth = 600;
			} else {
				WIwidth = window.innerWidth;
			}
			
			if (window.innerHeight <= 800){
				var WIheight = 800;
			} else {
				WIheight = window.innerHeight;
			} 
		}
	}
	
	div_Wrapper.style.width = 0.99*WIwidth + "px";
	div_Section.style.width = 0.99*parseFloat(div_Wrapper.style.width) + "px";
	div_Wrapper.style.height = 0.98*WIheight + "px";
	div_Header.style.height = 35 + "px";
	
	if (window.innerWidth>window.innerHeight){	
			
		if (0.3*parseFloat(div_Section.style.width)<280){
			div_State.style.width = div_StateGas.style.width = div_StateBr.style.width = div_StateOther.style.width = 0.3*parseFloat(div_Section.style.width) + "px";
		} else {
			div_State.style.width = div_StateGas.style.width = div_StateBr.style.width = div_StateOther.style.width = 280 + "px";
		}
			div_StateContainer.style.width = div_StateGas.style.height = div_StateBr.style.height = div_StateOther.style.height = div_State.style.height = 'auto';
		div_Screen.style.width = 0.985*parseFloat(div_Wrapper.style.width)-parseFloat(div_State.style.width) + "px";
		
		div_Screen.style.height = 0.985*parseFloat(div_Wrapper.style.height)-parseFloat(div_Header.style.height) + "px";
		div_State.style.height = div_Screen.style.height;
		
		div_Screen.style.marginLeft = 0.005*parseFloat(div_Wrapper.style.width) + "px";
		div_State.style.marginBottom = 0 + "px";
		div_StateBr.style.marginLeft = 0 + "px";
		div_StateOther.style.marginLeft = 0 + "px";
		
		div_State.style.overflowY = 'auto';
		div_State.style.overflowX = 'hidden';
		
	} else {
		div_State.style.width = div_Screen.style.width = parseFloat(div_Section.style.width) + "px";
			if (0.5*(parseFloat(div_Section.style.width)-0.01*parseFloat(div_Wrapper.style.width))<450) {
				div_StateGas.style.width = div_StateBr.style.width = div_StateOther.style.width = 0.5*(parseFloat(div_Section.style.width)-0.01*parseFloat(div_Wrapper.style.width)) + "px";
				div_StateContainer.style.width = 3*parseFloat(div_StateGas.style.width) + 0.01*parseFloat(div_Wrapper.style.width) + "px";
			} else {
				div_StateGas.style.width = div_StateBr.style.width = div_StateOther.style.width = (1/3)*(parseFloat(div_Section.style.width)-0.01*parseFloat(div_Wrapper.style.width)) + "px";
				div_StateContainer.style.width = div_State.style.width;
			}
			div_StateGas.style.height = div_StateBr.style.height = div_StateOther.style.height = div_State.style.height = 210 + "px";
			
			if (WIwidth<=350) {
				div_StateGas.style.height = div_StateBr.style.height = div_StateOther.style.height = 210 + "px";
				div_State.style.height = 150 + "px";
				div_State.style.overflowY = 'auto';
			} else {
				div_State.style.overflowY = 'hidden';
			}
		div_Screen.style.height = 0.98*parseFloat(div_Wrapper.style.height)-parseFloat(div_Header.style.height)-parseFloat(div_State.style.height) + "px";
		
		div_State.style.marginBottom = 0.005*parseFloat(div_Wrapper.style.width) + "px";
		div_Screen.style.marginLeft = 0 + "px";
		div_StateBr.style.marginLeft = 0.005*parseFloat(div_Wrapper.style.width) + "px";
		div_StateOther.style.marginLeft = 0.005*parseFloat(div_Wrapper.style.width) + "px";	
	
		div_State.style.overflowX = 'auto';
	}
		
	
	div_ScreenCanvas.style.width = parseFloat(div_Screen.style.width) + "px";
	
	if (WIheight<=750) {
		div_ScreenButtons.style.height = 19 + "px";
		div_ScreenMessage.style.height = 21 + "px";
	} else {
		div_ScreenButtons.style.height = 0.04*parseFloat(div_Screen.style.height)+ "px";
		div_ScreenMessage.style.height = 0.06*parseFloat(div_Screen.style.height)+ "px";
	}
	div_ScreenCanvas.style.height = parseFloat(div_Screen.style.height)-0.01*parseFloat(div_Wrapper.style.height)-parseFloat(div_ScreenButtons.style.height)-parseFloat(div_ScreenMessage.style.height) + "px";
	
	
	div_Wrapper.style.margin = (0.005*parseFloat(window.innerHeight) + "px") + ' ' + (0.005*parseFloat(window.innerWidth) + "px");
		div_Header.style.margin = (0.005*parseFloat(div_Wrapper.style.height) + "px") + ' ' + (0.005*parseFloat(div_Wrapper.style.width) + "px");
		div_Section.style.margin =  (0 + "px") + ' ' + (0.005*parseFloat(div_Wrapper.style.width) + "px") + ' ' +(0.005*parseFloat(div_Wrapper.style.height) + "px") + ' ' + (0.005*parseFloat(div_Wrapper.style.width) + "px");
		
		div_StateGas.style.marginBottom = 0.005*parseFloat(div_Wrapper.style.height) + "px";div_StateBr.style.marginBottom = 0.005*parseFloat(div_Wrapper.style.height) + "px";div_StateOther.style.marginBottom = 0.005*parseFloat(div_Wrapper.style.height) + "px";
		
		div_ScreenCanvas.style.marginBottom = 0.005*parseFloat(div_Wrapper.style.height) + "px";
		div_ScreenButtons.style.marginBottom = 0.005*parseFloat(div_Wrapper.style.height) + "px";
}

var booFullScreenState = false;
function fnFullScreen () {
	if (booFullScreenState) {
		if(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement){
            if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) { 
				document.webkitExitFullscreen();
			} else if (document.msExitFullscreen) { 
			document.msExitFullscreen();
			}
		}
		booFullScreenState = false;
	} else {
		if("fullscreenEnabled" in document || "webkitFullscreenEnabled" in document || "mozFullScreenEnabled" in document || "msFullscreenEnabled" in document){
			if(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled){
				if ('requestFullscreen'  in div_Wrapper) {
					div_Wrapper.requestFullscreen();
				} else if ('mozRequestFullScreen'  in div_Wrapper) { 
					div_Wrapper.mozRequestFullScreen();
				} else if ('webkitRequestFullscreen' in div_Wrapper) { 
					div_Wrapper.webkitRequestFullscreen();
				} else if ('msRequestFullscreen'  in div_Wrapper) { 
					div_Wrapper.msRequestFullscreen();
				}
			}
		} else {
			console.log('Полноэкранный режим не доступен');
			alert ('В данном браузере режим Full Screen не доступен.');
		}
		booFullScreenState = true;
	}
}


