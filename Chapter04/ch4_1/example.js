//❶変数の宣言
let unitKazu = 8;

let unitYokoKazu = unitKazu;
let unitTateKazu = unitKazu;
let unitSize, offsetX, offsetY;

function setup(){	//最初に実行される
//❷○の大きさ、余白の計算
	unitSize = Math.min(screenWidth, screenHeight)/unitKazu;
	offsetX = screenWidth/2 - (unitKazu*unitSize)/2;
	offsetY = screenHeight/2 - (unitKazu*unitSize)/2;
}

function loop(){	//常時実行される
	for(let i=0; i<unitTateKazu*unitYokoKazu; ++i){
//❸位置の計算
		let tateNum = parseInt(i / unitYokoKazu);
		let yokoNum = i % unitYokoKazu;
		let x = offsetX + unitSize*yokoNum + unitSize/2;
		let y = offsetY + unitSize*tateNum + unitSize/2;
//❹○の半径
		let hankei = unitSize/2;
//❺描画
		ctx.fillStyle = "rgb(255, 220, 220)";
		ctx.strokeStyle = "red";
		ctx.beginPath();
		ctx.arc(x, y, hankei, 0, Math.PI*2, true);
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