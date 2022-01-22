function setup(){	//最初に実行される
	
}

function loop(){	//常時実行される
//❶ 0〜360度まで3度ずつ角度を回転
	for(let i=0; i<360; i+=3){
//❷ i番目の○の角度の計算
		let kakudo = i/180*Math.PI;
//❸ 円周の半径
		let hankei1 = 400;
//❹ ○の半径
		let hankei2 = 10;
//❺ ○の位置の計算
		let x = hankei1*Math.cos(kakudo) + screenWidth/2;
		let y = hankei1*Math.sin(kakudo) + screenHeight/2;
//❻ 描画
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