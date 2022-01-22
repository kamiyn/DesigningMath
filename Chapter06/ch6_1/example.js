//❸ HSB→RGB変換
function hsbToRgb(hue, sat, bri){
	hue = hue % 360;
	if(hue < 0){
		hue += 360;
	}
	
	sat = Math.min(Math.max(sat, 0), 255);
	
	bri = Math.min(Math.max(bri, 0), 255);
	
	let red, green, blue;
//最大値、最小値
	let maxVal = bri;
	let minVal = maxVal - ((sat / 255) * maxVal);
	if(hue < 60){
//色相0〜60度
		red = maxVal;
		green = minVal + ((hue-0)/60)*(maxVal-minVal);
		blue = minVal;
	}else if(hue < 120){
//色相60〜120度
		red = maxVal - ((hue-60)/60)*(maxVal-minVal);
		green = maxVal;
		blue = minVal;
	}else if(hue < 180){
//色相120〜180度
		red = minVal;
		green = maxVal;
		blue = minVal + ((hue-120)/60)*(maxVal-minVal);
	}else if(hue < 240){
//色相180〜240度
		red = minVal;
		green = maxVal - ((hue-180)/60)*(maxVal-minVal);
		blue = maxVal;
	}else if(hue < 300){
//色相240〜300度
		red = minVal + ((hue-240)/60)*(maxVal-minVal);
		green = minVal;
		blue = maxVal;
	}else{
//色相300〜360度
		red = maxVal;
		green = minVal;
		blue = maxVal - ((hue-300)/60)*(maxVal-minVal);
	}
	return [red, green, blue];
}
//❶ 変数の宣言と初期化
let shikiso;
let saido;
let meido;

let RED = 0;
let GREEN = 1;
let BLUE = 2;

function setup(){	//最初に実行される
	shikiso = 0;
	saido = 0;
	meido = 0;
}

function loop(){	//常時実行される
//❷ 色相、彩度、明度値の変化
	shikiso += 1;
	if(shikiso > 360){
		shikiso -= 360;
	}
	
	saido = curYubiX/screenWidth*255;

	meido = curYubiY/screenHeight*255;
//❸ HSB→RGB変換
	let rgbCol = hsbToRgb(shikiso, saido, meido);
//❹ 描画
	ctx.clearRect(0, 0, screenWidth, screenHeight);
	ctx.fillStyle = "rgb("+rgbCol[RED]+","+rgbCol[GREEN]+","+rgbCol[BLUE]+")";
	ctx.fillRect(screenWidth/4, screenHeight/2-screenWidth/4, screenWidth/2, screenWidth/2);
	
	ctx.fillStyle = "black";
	ctx.font = "36px serif";
	ctx.fillText("色相："+parseInt(shikiso)+" / 360", screenWidth/4*3+10, screenHeight/2+screenWidth/4-105);
	ctx.fillText("彩度："+parseInt(saido)+" / 255", screenWidth/4*3+10, screenHeight/2+screenWidth/4-55);
	ctx.fillText("明度："+parseInt(meido)+" / 255", screenWidth/4*3+10, screenHeight/2+screenWidth/4-5);
}

function touchStart(){	//タッチ(マウスダウン)されたら
	
}

function touchMove(){	//指が動いたら(マウスが動いたら)
	
}

function touchEnd(){	//指が離されたら(マウスアップ)
	
}
