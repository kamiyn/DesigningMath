//❶ 変数の宣言
let unitKyori;
let maru = new Array();
//❷ クラスの宣言
class Maru{
	constructor(xx, yy){
		this.x = xx;
		this.y = yy;
	}
}

function setup(){	//最初に実行される
//位置の計算
//❸ 横の数と間隔
	let unitYokoKazu = 10;
	let yokoInterval = screenWidth / (unitYokoKazu-1);
//❹ 縦の間隔と数
	let tateInterval = yokoInterval * Math.sin(Math.PI/3);
	let unitTateKazu = Math.ceil(screenHeight / tateInterval)+1;
	unitKyori = yokoInterval;
//❺ 位置の計算と保存
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
//❻ 描画
	ctx.clearRect(0, 0, screenWidth, screenHeight);
	for(let i=0; i<maru.length; ++i){
//半径は●の距離の1/4
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