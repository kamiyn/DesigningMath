function hsbToRgb(hue, sat, bri){
	hue = hue % 360;
	if(hue < 0){
		hue += 360;
	}
	
	sat = Math.min(Math.max(sat, 0), 255);
	
	bri = Math.min(Math.max(bri, 0), 255);
	
	let red, green, blue;
	let maxVal = bri;
	let minVal = maxVal - ((sat / 255) * maxVal);
	if(hue < 60){
		red = maxVal;
		green = minVal + ((hue-0)/60)*(maxVal-minVal);
		blue = minVal;
	}else if(hue < 120){
		red = maxVal - ((hue-60)/60)*(maxVal-minVal);
		green = maxVal;
		blue = minVal;
	}else if(hue < 180){
		red = minVal;
		green = maxVal;
		blue = minVal + ((hue-120)/60)*(maxVal-minVal);
	}else if(hue < 240){
		red = minVal;
		green = maxVal - ((hue-180)/60)*(maxVal-minVal);
		blue = maxVal;
	}else if(hue < 300){
		red = minVal + ((hue-240)/60)*(maxVal-minVal);
		green = minVal;
		blue = maxVal;
	}else{
		red = maxVal;
		green = minVal;
		blue = maxVal - ((hue-300)/60)*(maxVal-minVal);
	}
	return [red, green, blue];
}
//❹ 三崩し文様を描く関数
function drawUnitSankuzushi(hsbCol, cx, cy, hankei, muki){
	ctx.lineWidth = hankei*0.45;
	
	let rgbCol1 = hsbToRgb(hsbCol[HUE], hsbCol[SATURATION], hsbCol[BRIGHTNESS]);
	ctx.strokeStyle = "rgb("+rgbCol1[RED]+","+rgbCol1[GREEN]+","+rgbCol1[BLUE]+")";
	ctx.beginPath();
	if(muki){
//偶数行１本目
		ctx.moveTo(cx-hankei*0.76, cy-hankei*0.36);		//A
		ctx.lineTo(cx+hankei*0.36, cy+hankei*0.76);		//B
	}else{
//奇数行１本目
		ctx.moveTo(cx+hankei*0.76, cy-hankei*0.36);		//E
		ctx.lineTo(cx-hankei*0.36, cy+hankei*0.76);		//F
	}
	ctx.stroke();
	
	let rgbCol2 = hsbToRgb(hsbCol[HUE]+180, hsbCol[SATURATION], hsbCol[BRIGHTNESS]);
	ctx.strokeStyle = "rgb("+rgbCol2[RED]+","+rgbCol2[GREEN]+","+rgbCol2[BLUE]+")";
	ctx.beginPath();
	if(muki){
//偶数行２本目
		ctx.moveTo(cx-hankei*0.36, cy-hankei*0.76);		//C
		ctx.lineTo(cx+hankei*0.76, cy+hankei*0.36);		//D
	}else{
//奇数行２本目
		ctx.moveTo(cx+hankei*0.36, cy-hankei*0.76);		//G
		ctx.lineTo(cx-hankei*0.76, cy+hankei*0.36);		//H
	}
	ctx.stroke();
}

let RED = 0;
let GREEN = 1;
let BLUE = 2;

let HUE = 0;
let SATURATION = 1;
let BRIGHTNESS = 2;

let unitKazu = 8;

let unitYokoKazu = unitKazu+1;
let unitTateKazu = unitKazu*2+1;
let unitSize, offsetX, offsetY;

function setup(){	//最初に実行される
	unitSize = Math.min(screenWidth, screenHeight)/unitKazu;
	offsetX = screenWidth/2 - (unitKazu*unitSize)/2;
	offsetY = screenHeight/2 - (unitKazu*unitSize)/2 - unitSize/2;
}

function loop(){	//常時実行される
	let passedTime = new Date().getTime();		//1秒間に1000進む
	
	ctx.clearRect(0, 0, screenWidth, screenHeight);
	
	for(let i=0; i<unitTateKazu*unitYokoKazu; ++i){
		let tateNum = parseInt(i / unitYokoKazu);
		let yokoNum = i % unitYokoKazu;
		let x = offsetX + unitSize*yokoNum + unitSize/2;
		if(tateNum % 2 == 1)	x -= unitSize/2;
		let y = offsetY + unitSize/2*tateNum + unitSize/2;
//❶ 色相の動き
		let shikiso = i / (unitYokoKazu*unitTateKazu) * 360 + passedTime/1000*60;
		let saido = curYubiX/screenWidth*255;
		let meido = ((Math.sin(yokoNum/unitYokoKazu*Math.PI*2 + passedTime/1000*(Math.PI*2)/4)+1)/2*0.6+0.4) * 255;
			
		let hsbCol1 = [shikiso, saido, meido];
//❷ 向きの計算
		let muki = true;
		if(tateNum % 2 == 1){
			muki = false;
		}
//❸ 三崩し文様の描画
		drawUnitSankuzushi(hsbCol1, x, y, unitSize/2, muki);
	}
//❺ 不要な部分の消去
	ctx.fillStyle = "white";
	if(screenWidth < screenHeight){
		let ookisa = (screenHeight - screenWidth)/2;
		ctx.fillRect(0, 0, screenWidth, ookisa);
		ctx.fillRect(0, screenHeight-ookisa, screenWidth, ookisa);
	}else{
		let ookisa = (screenWidth - screenHeight)/2;
		ctx.fillRect(0, 0, ookisa, screenHeight);
		ctx.fillRect(screenWidth-ookisa, 0, ookisa, screenHeight);
	}
}

function touchStart(){	//タッチ(マウスダウン)されたら
	
}

function touchMove(){	//指が動いたら(マウスが動いたら)
	
}

function touchEnd(){	//指が離されたら(マウスアップ)
	
}
