function setup(){	//最初に実行される
	ctx.beginPath();
	ctx.moveTo(100, 100);
	ctx.lineTo(200, 100);
//❶ 三次のベジェ曲線
	ctx.bezierCurveTo(300, 200, 100, 300, 200, 400);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(200, 500);
//❷ 二次のベジェ曲線
	ctx.quadraticCurveTo(300, 600, 100, 700);
	ctx.lineTo(100, 500);
	ctx.closePath();
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