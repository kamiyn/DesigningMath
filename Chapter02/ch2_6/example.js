function setup(){	//最初に実行される
//❶ 塗りで文字を描画
	ctx.fillText("Designing Math.", screenWidth/2, 200);

	ctx.strokeStyle = 'black';
//❸ 書体
	ctx.font = "60px Serif";
//❹ 揃え
	ctx.textAlign = "right";
//❷ 枠線で文字を描画
	ctx.strokeText("Designing Math.", screenWidth/2, 400);

	ctx.fillStyle = 'grey';
	ctx.strokeStyle = 'red';
	ctx.lineWidth = 4;
//❸ 書体
	ctx.font = "80px Helvetica";
//❹ 揃え
	ctx.textAlign = "center"
//❺ 枠線を描画してから塗る
	ctx.strokeText("Designing Math.", screenWidth/2, 600);
	ctx.fillText("Designing Math.", screenWidth/2, 600);
//❻ 塗ってから枠線を描画
	ctx.fillText("Designing Math.", screenWidth/2, 800);
	ctx.strokeText("Designing Math.", screenWidth/2, 800);
}

function loop(){	//常時実行される
	
}

function touchStart(){	//タッチ(マウスダウン)されたら
	
}

function touchMove(){	//指が動いたら(マウスが動いたら)
	
}

function touchEnd(){	//指が離されたら(マウスアップ)
	
}