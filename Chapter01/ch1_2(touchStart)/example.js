function setup(){	//最初に実行される
	
}

function loop(){	//常時実行される
	
}

function touchStart(){	//タッチ(マウスダウン)されたら
	ctx.beginPath();
	ctx.arc(curYubiX, curYubiY, 200, 0, Math.PI*2);
	ctx.stroke();
}

function touchMove(){	//指が動いたら(マウスが動いたら)
	
}

function touchEnd(){	//指が離されたら(マウスアップ)
	
}