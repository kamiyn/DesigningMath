let unitKazu = 8;

let unitYokoKazu = unitKazu;
//❶ 縦に並ぶ数を４倍にする
let unitTateKazu = unitKazu*4;
let unitSize, offsetX, offsetY;

function setup(){	//最初に実行される
	unitSize = Math.min(screenWidth, screenHeight)/unitKazu;
	offsetX = screenWidth/2 - (unitKazu*unitSize)/2;
	offsetY = screenHeight/2 - (unitKazu*unitSize)/2;
}

function loop(){	//常時実行される
	for(let i=0; i<unitTateKazu*unitYokoKazu; ++i){
		let tateNum = parseInt(i / unitYokoKazu);
		let yokoNum = i % unitYokoKazu;
		let x = offsetX + unitSize*yokoNum + unitSize/2;
//❷ 縦に並ぶ位置を1/4に詰める
		let y = offsetY + (unitSize/4)*tateNum + unitSize/2;
		
		let hankei = unitSize/2;
		
//❸ 塗りの色を薄ピンク色にする
		ctx.fillStyle = "rgba(255, 220, 220, 0.7)";
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