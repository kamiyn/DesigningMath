function setup(){	//最初に実行される
	
}

function loop(){	//常時実行される
	ctx.clearRect(0, 0, screenWidth, screenHeight);
	
	ctx.lineWidth = 40;
	ctx.beginPath();
//❶ 常時、指の位置に円を描画
	ctx.arc(curYubiX, curYubiY, 200, 0, Math.PI*2);
	ctx.stroke();
}
//❷ タッチされたら赤
function touchStart(){	//タッチ(マウスダウン)されたら
	ctx.strokeStyle = 'red';
}
//❸ 指が動いているときはピンク
function touchMove(){	//指が動いたら(マウスが動いたら)
	ctx.strokeStyle = 'pink';
}
//❹ 指が離されたらグレー
function touchEnd(){	//指が離されたら(マウスアップ)
	ctx.strokeStyle = 'grey';
}