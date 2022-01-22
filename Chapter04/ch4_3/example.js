let unitKazu = 8;
//❷ 横に並ぶ個数を１つ増やす
let unitYokoKazu = unitKazu+1;
//❹ 縦に並ぶ個数を１つ増やす
let unitTateKazu = unitKazu*4+1;
let unitSize, offsetX, offsetY;

function setup(){	//最初に実行される
	unitSize = Math.min(screenWidth, screenHeight)/unitKazu;
	offsetX = screenWidth/2 - (unitKazu*unitSize)/2;
//❸ 全体の縦の位置を1/4だけ上にあげる
	offsetY = screenHeight/2 - (unitKazu*unitSize)/2 - unitSize/4;
}

function loop(){	//常時実行される
	for(let i=0; i<unitTateKazu*unitYokoKazu; ++i){
		let tateNum = parseInt(i / unitYokoKazu);
		let yokoNum = i % unitYokoKazu;
		let x = offsetX + unitSize*yokoNum + unitSize/2;
//❶ 奇数行の○の位置を大きさの半分だけずらす
		if(tateNum % 2 == 1)	x -= unitSize/2;
		let y = offsetY + unitSize/4*tateNum + unitSize/2;
		
		let hankei = unitSize/2;
		
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