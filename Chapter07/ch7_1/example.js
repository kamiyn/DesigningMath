//❶ グローバル変数の宣言
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
//❸ ○の横の数と間隔の計算
	let unitYokoKazu = 20;
	let yokoInterval = screenWidth / (unitYokoKazu-1);
//❹ ○の縦の間隔と数の計算
	let tateInterval = yokoInterval * Math.sin(Math.PI/3);
	let unitTateKazu = Math.ceil(screenHeight / tateInterval);
	unitKyori = yokoInterval;
//❺ ○の位置を計算し配列に保存
	for(let i=0; i<unitYokoKazu*unitTateKazu; ++i){
		let tateNum = parseInt(i / unitYokoKazu);
		let yokoNum = i % unitYokoKazu;
		let x = yokoInterval*yokoNum;
		let y = tateInterval*tateNum;
		if(tateNum % 2 == 1)	x += yokoInterval/2;
		maru[i] = new Maru(x, y);
	}
}

function loop(){	//常時実行される
//❻ 配列に保存されている位置に○を描画
	ctx.clearRect(0, 0, screenWidth, screenHeight);
	for(let i=0; i<maru.length; ++i){
		let hankei = unitKyori / 2;
		
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(maru[i].x, maru[i].y, hankei, 0, Math.PI*2, true);
		ctx.stroke();
	}
}

function touchStart(){	//タッチ(マウスダウン)されたら
	
}

function touchMove(){	//指が動いたら(マウスが動いたら)
	
}

function touchEnd(){	//指が離されたら(マウスアップ)
	
}