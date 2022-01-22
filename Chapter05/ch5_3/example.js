function setup(){	//最初に実行される
	
}

function loop(){	//常時実行される
	for(let i=0; i<360; i+=3){
		let kakudo = i/180*Math.PI;
//❶ ○が並んでいる円周の半径の計算
		let hankei1 = 100*Math.sin(kakudo*6) + 400;
		let haba = 20;
		let hankei2 = haba*(Math.sin(kakudo*8)) + haba;
		let x = hankei1*Math.cos(kakudo) + screenWidth/2;
		let y = hankei1*Math.sin(kakudo) + screenHeight/2;
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