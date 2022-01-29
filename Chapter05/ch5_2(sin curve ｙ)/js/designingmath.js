var canvas, ctx;
var screenWidth, screenHeight;
var curYubiX, curYubiY, yubiTouched;

onload = function(){
	canvas = document.getElementById('canvas');
	if ( ! canvas || ! canvas.getContext ) {
		return false;
	}
	ctx = canvas.getContext('2d');
	screenWidth = canvas.width;
	screenHeight = canvas.height;
	
	curYubiX = screenWidth/2;
	curYubiY = screenHeight/2;
	
	//スマホ用
	canvas.addEventListener("touchstart",function(evt) {
		evt.preventDefault();
		var rect = canvas.getBoundingClientRect();
		var bai = screenWidth/rect.width;
		yubiTouched = true;
		curYubiX = (evt.changedTouches[0].pageX - (rect.left + window.pageXOffset))*bai;
		curYubiY = (evt.changedTouches[0].pageY - (rect.top + window.pageYOffset))*bai;
		touchStart();
	}, false);
	
	canvas.addEventListener("touchmove", function(evt) {
		evt.preventDefault();
		var rect = canvas.getBoundingClientRect();
		var bai = screenWidth/rect.width;
		curYubiX = (evt.changedTouches[0].pageX - (rect.left + window.pageXOffset))*bai;
		curYubiY = (evt.changedTouches[0].pageY - (rect.top + window.pageYOffset))*bai;
		touchMove();
	}, false);
	
	canvas.addEventListener("touchend",function(evt) {
		evt.preventDefault();
		var rect = canvas.getBoundingClientRect();
		var bai = screenWidth/rect.width;
		yubiTouched = false;
		curYubiX = (evt.changedTouches[0].pageX - (rect.left + window.pageXOffset))*bai;
		curYubiY = (evt.changedTouches[0].pageY - (rect.top + window.pageYOffset))*bai;
		touchEnd();
	}, false);
	
	//PC用
	canvas.addEventListener("mousedown", function(evt){
		var rect = canvas.getBoundingClientRect();
		yubiTouched = true;
		var bai = screenWidth/rect.width;
		curYubiX = (evt.clientX - rect.left)*bai;
		curYubiY = (evt.clientY - rect.top)*bai;
		touchStart();
	}, false);
	
	canvas.addEventListener("mousemove", function(evt){
		var rect = canvas.getBoundingClientRect();
		var bai = screenWidth/rect.width;
		curYubiX = (evt.clientX - rect.left)*bai;
		curYubiY = (evt.clientY - rect.top)*bai;
		touchMove();
	}, false);
	
	canvas.addEventListener("mouseup", function(evt){
		var rect = canvas.getBoundingClientRect();
		yubiTouched = false
		var bai = screenWidth/rect.width;
		curYubiX = (evt.clientX - rect.left)*bai;
		curYubiY = (evt.clientY - rect.top)*bai;
		touchEnd();
	}, false);

	setup();
	
	var timerId = setInterval(loop, 33);
}
