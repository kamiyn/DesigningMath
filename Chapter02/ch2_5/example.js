function setup(){	//最初に実行される
	ctx.lineWidth = 40;
//❶ 塗り色の指定
	ctx.fillStyle = 'pink';
//❷ 線の色の指定
	ctx.strokeStyle = 'red';
	ctx.beginPath();
	ctx.arc(400, 500, 300, 0, 180*Math.PI*2, true);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
//❸ 塗り色の指定（CSS）
	ctx.fillStyle = 'rgb(160, 160, 160)';
//❹ 線の色の指定（CSS）
	ctx.strokeStyle = '#990000';
	ctx.beginPath();
	ctx.arc(700, 500, 300, 0, 180*Math.PI*2, true);
	ctx.fill();
	ctx.stroke();
//❺ 塗り色の指定(透明度(アルファ値))
	ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
	ctx.beginPath();
	ctx.arc(550, 800, 300, 0, 180*Math.PI*2, true);
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