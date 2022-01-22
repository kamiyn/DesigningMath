function setup(){	//最初に実行される
	
}

function loop(){	//常時実行される
	let passedTime = new Date().getTime();
	let objectKakudo = passedTime/1000;
	objectKakudo = objectKakudo*2*Math.PI;
	objectKakudo = objectKakudo*0.5;
	ctx.clearRect(0, 0, screenWidth, screenHeight);
	for(let i=0; i<360; i+=3){
		let kakudo = i/180*Math.PI;
//❶ 円周の大きさに時間によって進む角度を加味
		let hankei1 = 100*Math.sin(kakudo*6 + objectKakudo) + 400;
		let haba = 20*Math.sin(objectKakudo) + 20;
		let hankei2 = haba*(Math.sin(kakudo*8 + objectKakudo)) + haba;
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