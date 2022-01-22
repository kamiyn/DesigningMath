function setup(){	//最初に実行される
//❸ 描画を始める宣言
	ctx.beginPath();
//❶ ペンの位置を(200, 100)に移動
	ctx.moveTo(200, 100);
//❷ ペンの現在の位置を(200, 100)から(800, 900)まで線を描画
	ctx.lineTo(800, 900);
//❸ ペンが移動した軌跡に線を描画
	ctx.stroke();
}

function loop(){	//常時実行される
	
}

function touchStart(){	//タッチ(マウスダウン)されたら
	
}

function touchMove(){	//指が動いたら(マウスが動いたら)
	
}

function touchEnd(){	//指が離されたら(マウスアップ)
	
}