function setup(){	//最初に実行される
	
}

function loop(){	//常時実行される
	for(let i=0; i<360; i+=3){
		let kakudo = i/180*Math.PI;
		let hankei1 = 400;
		let hankei2 = 10;
		let x = i;
		let y = hankei1*Math.sin(kakudo*2) + screenHeight/2;
		ctx.beginPath();
		ctx.arc(x, y, hankei2, 0, Math.PI*2, true);
		ctx.stroke();
	}
}

function touchStart(){	//タッチ(マウスダウン)されたら
	
}

function touchMove(){	//指が動いたら(マウスが動いたら)
	
}

function touchEnd(){	//指が離されたら(マウスアップ)
	
}