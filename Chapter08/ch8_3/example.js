let unitKyori;
let maru = new Array();

class Maru{
	constructor(xx, yy){
		this.x = xx;
		this.y = yy;
	}
}

function setup(){	//最初に実行される
	let unitYokoKazu = 10;
	let yokoInterval = screenWidth / (unitYokoKazu-1);
	let tateInterval = yokoInterval * Math.sin(Math.PI/3);
	let unitTateKazu = Math.ceil(screenHeight / tateInterval)+1;
	unitKyori = yokoInterval;
	for(let i=0; i<unitYokoKazu*unitTateKazu; ++i){
		let tateNum = parseInt(i / unitYokoKazu);
		let yokoNum = i % unitYokoKazu;
		let x = yokoInterval*yokoNum;
		let y = tateInterval*tateNum;
		if(tateNum % 2 == 0)	x -= yokoInterval/2;
		maru[i] = new Maru(x, y);
	}
}

function loop(){	//常時実行される
//指の位置を中心に回転
	for(let i=0; i<maru.length; ++i){
		if(yubiTouched){
//❶ 原点を指の位置まで移動
			let xx1 = maru[i].x - curYubiX;
			let yy1 = maru[i].y - curYubiY;
//❷ 一次変換で回転
			let xx2 = xx1 * Math.cos(Math.PI/36) - yy1 * Math.sin(Math.PI/36);
			let yy2 = xx1 * Math.sin(Math.PI/36) + yy1 * Math.cos(Math.PI/36);
//❸ 原点を戻す
			let xx3 = xx2 + curYubiX;
			let yy3 = yy2 + curYubiY;
			maru[i].x = xx3;
			maru[i].y = yy3;
		}
	}

	ctx.clearRect(0, 0, screenWidth, screenHeight);
	for(let i=0; i<maru.length; ++i){
		let hankei = unitKyori / 4;
		ctx.fillStyle = "black";
		ctx.beginPath();
		ctx.arc(maru[i].x, maru[i].y, hankei, 0, Math.PI*2, true);
		ctx.fill();
	}
}

function touchStart(){	//タッチ(マウスダウン)されたら
	
}

function touchMove(){	//指が動いたら(マウスが動いたら)
	
}

function touchEnd(){	//指が離されたら(マウスアップ)
	
}