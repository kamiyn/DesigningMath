//❶ 最初に一度実行される
function setup(){	//最初に実行される
	
}
//❷ setup実行後に常時繰り返して実行される
function loop(){	//常時実行される
	ctx.beginPath();
	ctx.arc(curYubiX, curYubiY, 200, 0, Math.PI*2);
	ctx.stroke();
}
//❸ タッチ（マウスダウン）で一度実行される
function touchStart(){	//タッチ(マウスダウン)されたら
	
}
//❹ 指（マウス）が動くたびに実行される
function touchMove(){	//指が動いたら(マウスが動いたら)
	
}
//❺ 指が離れる（マウスアップ）で一度実行される
function touchEnd(){	//指が離されたら(マウスアップ)
	
}