//❶ 頂点クラスの宣言
class Choten{
	constructor(xx, yy, zz){
		this.x = xx;
		this.y = yy;
		this.z = zz;
		this.tx = 0;
		this.ty = 0;
	}
}
//❷ 頂点変数の宣言
let choten = new Array();

function setup(){	//最初に実行される
	let henLength = 400;
//❸ 頂点の初期化
	choten[0] = new Choten(henLength, henLength, henLength);
	choten[1] = new Choten(henLength, henLength, -henLength);
	choten[2] = new Choten(-henLength, henLength, -henLength);
	choten[3] = new Choten(-henLength, henLength, henLength);
	choten[4] = new Choten(henLength, -henLength, henLength);
	choten[5] = new Choten(henLength, -henLength, -henLength);
	choten[6] = new Choten(-henLength, -henLength, -henLength);
	choten[7] = new Choten(-henLength, -henLength, henLength);
//❹ 投影変換
	let sc = 2000;
	for(let i=0; i<choten.length; ++i){
		let gx = choten[i].x;
		let gy = choten[i].y;
		let gz = choten[i].z + 3000;
		
		choten[i].tx = sc*gx/gz;
		choten[i].ty = sc*gy/gz;
	}
}

function loop(){	//常時実行される
//❺ 描画
	ctx.clearRect(0, 0, screenWidth, screenHeight);
	
	ctx.save();
	ctx.translate(screenWidth/2, screenHeight/2);

	ctx.lineWidth = 2;
	ctx.lineJoin = "round";
	
	ctx.strokeStyle = "black";
	ctx.beginPath();
	ctx.moveTo(choten[0].tx, choten[0].ty);
	ctx.lineTo(choten[1].tx, choten[1].ty);
	ctx.lineTo(choten[2].tx, choten[2].ty);
	ctx.lineTo(choten[3].tx, choten[3].ty);
	ctx.lineTo(choten[0].tx, choten[0].ty);
	ctx.lineTo(choten[4].tx, choten[4].ty);
	ctx.lineTo(choten[5].tx, choten[5].ty);
	ctx.lineTo(choten[6].tx, choten[6].ty);
	ctx.lineTo(choten[7].tx, choten[7].ty);
	ctx.lineTo(choten[4].tx, choten[4].ty);
	ctx.moveTo(choten[1].tx, choten[1].ty);
	ctx.lineTo(choten[5].tx, choten[5].ty);
	ctx.moveTo(choten[2].tx, choten[2].ty);
	ctx.lineTo(choten[6].tx, choten[6].ty);
	ctx.moveTo(choten[3].tx, choten[3].ty);
	ctx.lineTo(choten[7].tx, choten[7].ty);
	ctx.stroke();

	ctx.restore();
}

function touchStart(){	//タッチ(マウスダウン)されたら
	
}

function touchMove(){	//指が動いたら(マウスが動いたら)
	
}

function touchEnd(){	//指が離されたら(マウスアップ)
	
}