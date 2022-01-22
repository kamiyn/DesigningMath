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

function drawUnit(hsbCol, cx, cy, hankei){
	let rgbCol = hsbToRgb(hsbCol[HUE], hsbCol[SATURATION], hsbCol[BRIGHTNESS]);

	ctx.fillStyle = "rgb("+rgbCol[RED]+","+rgbCol[GREEN]+","+rgbCol[BLUE]+")";
	ctx.beginPath();
	ctx.arc(cx, cy, hankei, 0, Math.PI*2, true);
	ctx.fill();
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
//❶ 色相の固定（経過時間による変化を取り去る）
		let shikiso = i / (unitYokoKazu*unitTateKazu) * 360;
//❷ 彩度の固定
		let saido = 255;
//❸ 明度の変化を横方向につける計算	❹明度の波を経過時間で動かす
		let meido = ((Math.sin(yokoNum/unitYokoKazu*Math.PI*2)+1)/2*0.6+0.4) * 255;
	//	let meido = ((Math.sin(yokoNum/unitYokoKazu*Math.PI*2 + passedTime/1000*(Math.PI*2)/4)+1)/2*0.6+0.4) * 255;
			
		let hsbCol1 = [shikiso, saido, meido];
		drawUnit(hsbCol1, x, y, unitSize/2);
	}
}

function touchStart(){	//タッチ(マウスダウン)されたら
	
}

function touchMove(){	//指が動いたら(マウスが動いたら)
	
}

function touchEnd(){	//指が離されたら(マウスアップ)
	
}
