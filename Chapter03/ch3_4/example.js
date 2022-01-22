let unitKazu = 16;
let unitSize, offsetX, offsetY;

function setup(){	//最初に実行される
	unitSize = Math.min(screenWidth, screenHeight)/unitKazu;
	offsetX = screenWidth/2 - unitKazu*unitSize/2;
	offsetY = screenHeight/2 - unitKazu*unitSize/2;
}

function loop(){	//常時実行される
//❷ 現在時刻の取得
	let passedTime = new Date().getTime();
//❶ 画面全体を消す
	ctx.clearRect(0, 0, screenWidth, screenHeight);
	
	for(let i=0; i<unitKazu*unitKazu; ++i){
		let tateNum = parseInt(i / unitKazu);
		let yokoNum = i % unitKazu;
		let x = offsetX + unitSize*yokoNum + unitSize/2;
		let y = offsetY + unitSize*tateNum + unitSize/2;
		
		let par1 = (i % (unitKazu+1))/(unitKazu+1);
		let hankei = par1 * unitSize/2;
//❸ 半径の計算
		let par2 = ((passedTime % 1000) / 999);
		par2 = par2 * unitSize/2;
		hankei = (hankei+par2) % (unitSize/2);
		
		ctx.beginPath();
		ctx.arc(x, y, hankei, 0, Math.PI*2, true);
		ctx.fill();
	}
}

function touchStart(){	//タッチ(マウスダウン)されたら
	
}

function touchMove(){	//指が動いたら(マウスが動いたら)
	
}

function touchEnd(){	//指が離されたら(マウスアップ)
	
}