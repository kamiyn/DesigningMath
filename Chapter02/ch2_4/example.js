function setup(){	//最初に実行される
	ctx.beginPath();
//❶ 円弧
	ctx.arc(500, 200, 100, 30/180*Math.PI, 120/180*Math.PI, true);
	ctx.stroke();
//❷ 線幅
	ctx.lineWidth = 4;

	ctx.beginPath();
//❸ 楕円
	ctx.ellipse(500, 600, 200, 100, 45/180*Math.PI, 30/180*Math.PI, 120/180*Math.PI, true);
	ctx.stroke();

	ctx.beginPath();
//❹ 矩形（四角形）
	ctx.rect(800, 100, 100, 200);
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