function setup(){	//最初に実行される
	
}

function loop(){	//常時実行される
	ctx.clearRect(0, 0, screenWidth, screenHeight);
//❷ 画面がタッチ(マウスダウン)されていたら
	if(yubiTouched){
		ctx.beginPath();
		ctx.arc(curYubiX, curYubiY, 200, 0, Math.PI*2);
		ctx.stroke();
	}
}

function touchStart(){	//タッチ(マウスダウン)されたら
	
}

function touchMove(){	//指が動いたら(マウスが動いたら)
	
}

function touchEnd(){	//指が離されたら(マウスアップ)
	
}