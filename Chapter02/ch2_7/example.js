function setup(){	//最初に実行される
	
}

function loop(){	//常時実行される
//❶ 画面全体を最初に全部消す
	ctx.clearRect(0, 0, screenWidth, screenHeight); //画面全体を最初に全部消す
	ctx.beginPath();
	ctx.arc(curYubiX, curYubiY, 200, 0, Math.PI*2);
	ctx.stroke();
}

function touchStart(){	//タッチ(マウスダウン)されたら
	
}

function touchMove(){	//指が動いたら(マウスが動いたら)
	
}

function touchEnd(){	//指が離されたら(マウスアップ)
	
}