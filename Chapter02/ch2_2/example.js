function setup(){	//最初に実行される
	ctx.beginPath();
//❶ 線をつなげて描画
	ctx.moveTo(0, 0);
//❸ 画面横幅はscreenWidth、高さはscreenHeight
	ctx.lineTo(screenWidth, screenHeight);
	ctx.lineTo(screenWidth/3, screenHeight);
	ctx.lineTo(0, 0);
//❷ strokeは枠線
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(screenWidth*0.5, screenHeight*0.1);
	ctx.lineTo(screenWidth, 0);
	ctx.lineTo(screenWidth*0.8, screenHeight*0.6);
	ctx.lineTo(screenWidth*0.4, screenHeight*0.2);
//❸ fillは塗りつぶし
	ctx.fill();
}

function loop(){	//常時実行される
	
}

function touchStart(){	//タッチ(マウスダウン)されたら
	
}

function touchMove(){	//指が動いたら(マウスが動いたら)
	
}

function touchEnd(){	//指が離されたら(マウスアップ)
	
}