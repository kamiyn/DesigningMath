//❶ クラスの宣言
class Point{
	constructor(xx, yy){
		this.x = xx;
		this.y = yy;
	}
}
//❷ 変数の宣言
let ten = new Array();

function setup(){	//最初に実行される
//❸ 点の初期化
	for(let i=0; i<4; ++i){
		ten[i] = new Point(screenWidth/2, screenHeight/2);
	}
}

function loop(){	//常時実行される
//❹ 位置の計算
	for(let i=0; i<ten.length; ++i){
		if(i==0){
//先頭の点
			if(yubiTouched){
				ten[i].x = curYubiX;
				ten[i].y = curYubiY;
			}
		}else{
//2個目以降の点
			ten[i].x += (ten[i-1].x - ten[i].x)/10;
			ten[i].y += (ten[i-1].y - ten[i].y)/10;
		}
	}
//❺ 描画
	ctx.clearRect(0, 0, screenWidth, screenHeight);

	let hankei = 35;
	ctx.fillStyle="white";
	ctx.strokeStyle="black";
	ctx.lineWidth = 4;
	for(let i=0; i<ten.length; ++i){
		ctx.beginPath();
		ctx.arc(ten[i].x, ten[i].y, hankei, 0, Math.PI*2, true);
		ctx.fill();
		ctx.stroke();
	}
}

function touchStart(){	//タッチ(マウスダウン)されたら
	
}

function touchMove(){	//指が動いたら(マウスが動いたら)
	
}

function touchEnd(){	//指が離されたら(マウスアップ)
	
}