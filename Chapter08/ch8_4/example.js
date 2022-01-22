let unitKyori;
let maru = new Array();

class Maru{
	constructor(xx, yy){
		this.x = xx;
		this.y = yy;
//❶ 回転方向の変数
		this.muki = 1;
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
	for(let i=0; i<maru.length; ++i){
		if(yubiTouched){
//❷ 回転方向の計算
			let kyori = Math.sqrt(Math.pow(curYubiX-maru[i].x,2)+Math.pow(curYubiY-maru[i].y,2));
			let kyoriPar = parseInt(kyori / 250);
			let par = ((kyoriPar % 2)-0.5)*2;
			maru[i].muki = par;
			let xx1 = maru[i].x - curYubiX;
			let yy1 = maru[i].y - curYubiY;
//❸ それぞれ回転方向に回転
			let xx2 = xx1 * Math.cos(maru[i].muki*Math.PI/36) - yy1 * Math.sin(maru[i].muki*Math.PI/36);
			let yy2 = xx1 * Math.sin(maru[i].muki*Math.PI/36) + yy1 * Math.cos(maru[i].muki*Math.PI/36);
			let xx3 = xx2 + curYubiX;
			let yy3 = yy2 + curYubiY;
			maru[i].x = xx3;
			maru[i].y = yy3;
		}
	}

	ctx.clearRect(0, 0, screenWidth, screenHeight);
	for(let i=0; i<maru.length; ++i){
		let hankei = unitKyori / 4;
//❹ 回転方向による色分け
		if(maru[i].muki > 0)	ctx.fillStyle = "black";
		else					ctx.fillStyle = "red";
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