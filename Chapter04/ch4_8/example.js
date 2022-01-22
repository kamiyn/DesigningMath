let unitKazu = 8;

let unitYokoKazu = unitKazu+1;
let unitTateKazu = unitKazu*4+1;
let unitSize, offsetX, offsetY;

function setup(){	//最初に実行される
	unitSize = Math.min(screenWidth, screenHeight)/unitKazu;
	offsetX = screenWidth/2 - (unitKazu*unitSize)/2;
	offsetY = screenHeight/2 - (unitKazu*unitSize)/2 - unitSize/4;
}

function loop(){	//常時実行される
	let passedTime = new Date().getTime();

	ctx.clearRect(0, 0, screenWidth, screenHeight);
	
	for(let i=0; i<unitTateKazu*unitYokoKazu; ++i){
		let tateNum = parseInt(i / unitYokoKazu);
		let yokoNum = i % unitYokoKazu;
		let x = offsetX + unitSize*yokoNum + unitSize/2;
		if(tateNum % 2 == 1)	x -= unitSize/2;
		let y = offsetY + unitSize/4*tateNum + unitSize/2;
		
		let hankei = unitSize/2;
		
		let kakudoA = ((passedTime % 3000) / 3000)*Math.PI*2;
		
		let kakudoB = (i % (unitYokoKazu+1))/unitYokoKazu * Math.PI*2;
		
		ctx.fillStyle = "rgba(255, 255, 255, 1)";
		ctx.beginPath();
		ctx.arc(x, y, hankei, 0, Math.PI*2, true);
		ctx.fill();
		ctx.lineWidth = hankei/9;
		ctx.strokeStyle = "red";
		for(let j=1; j<5; ++j){
			let kakudoC = Math.PI*2/10*j;
			ctx.beginPath();
			ctx.arc(x, y, hankei/5*j, kakudoA+kakudoB+kakudoC+0, kakudoA+kakudoB+kakudoC+(Math.PI*2-Math.PI*2/10), false);
			ctx.stroke();
		}
	}
//❶不要な部分の塗りつぶし
	ctx.fillStyle = "white";
	if(screenWidth < screenHeight){
//画面が縦長の場合
		let ookisa = (screenHeight - screenWidth)/2;
		ctx.fillRect(0, 0, screenWidth, ookisa);
		ctx.fillRect(0, screenHeight-ookisa, screenWidth, ookisa);
	}else{
//横長の場合
		let ookisa = (screenWidth - screenHeight)/2;
		ctx.fillRect(0, 0, ookisa, screenHeight);
		ctx.fillRect(screenWidth-ookisa, 0, ookisa, screenHeight);
	}
}

function touchStart(){	//タッチ(マウスダウン)されたら
	
}

function touchMove(){	//指が動いたら(マウスが動いたら)
	
}

function touchEnd(){	//指が離されたら(マウスアップ)
	
}