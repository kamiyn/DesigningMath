//❶ 縦横に並ぶ数と大きさ
let unitKazu = 16;
let unitSize = 60;

function setup(){	//最初に実行される
	
}

function loop(){	//常時実行される
//❷ １つずつの●について
	for(let i=0; i<unitKazu*unitKazu; ++i){
//❸ それぞれの位置（X座標、Y座標）を決める
		let tateNum = parseInt(i / unitKazu);
		let yokoNum = i % unitKazu;
		let x = unitSize*yokoNum + unitSize/2;
		let y = unitSize*tateNum + unitSize/2;
//❹ 半径を決める
		let hankei = unitSize/2;
//❺ ●を描画
		ctx.beginPath();
		ctx.arc(x, y, hankei, 0, Math.PI*2, true);
		ctx.fill();
	}
}

function touchStart(){	//タッチ(マウスダウン)されたら
	
}

function touchMove(){	//指が動いたら(マウスが動いたら)
	
}

function touchEnd(){	//指が離されたら(マウスアップ)
	
}