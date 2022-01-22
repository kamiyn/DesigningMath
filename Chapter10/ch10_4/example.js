class Choten{
	constructor(xx, yy, zz){
		this.x = xx;
		this.y = yy;
		this.z = zz;
		this.tx = 0;
		this.ty = 0;
		
		this.sc = 2000;
		
		this.toei();
	}
	
	toei(){
		let gx = this.x;
		let gy = this.y;
		let gz = this.z + 3000;
		
		this.tx = this.sc*gx/gz;
		this.ty = this.sc*gy/gz;
	}
	
	kaiten(kx, ky, kz){
		let x0 = this.x*Math.cos(ky) - this.z*Math.sin(ky);
		let y0 = this.y;
		let z0 = this.x*Math.sin(ky) + this.z*Math.cos(ky);

		let x1 = x0;
		let y1 = y0*Math.cos(kx) - z0*Math.sin(kx);
		let z1 = y0*Math.sin(kx) + z0*Math.cos(kx);

		this.x = x1*Math.cos(kz) - y1*Math.sin(kz);
		this.y = x1*Math.sin(kz) + y1*Math.cos(kz);
		this.z = z1;
		
		this.toei();
	}
}

let choten = new Array();
//❶ 角度、指の位置の変数
let kakudoX = 0;
let kakudoY = 0;
let kakudoZ = 0;
let preYubiX;
let preYubiY;

function setup(){	//最初に実行される
	let henLength = 400;
	choten[0] = new Choten(henLength, henLength, henLength);
	choten[1] = new Choten(henLength, henLength, -henLength);
	choten[2] = new Choten(-henLength, henLength, -henLength);
	choten[3] = new Choten(-henLength, henLength, henLength);
	choten[4] = new Choten(henLength, -henLength, henLength);
	choten[5] = new Choten(henLength, -henLength, -henLength);
	choten[6] = new Choten(-henLength, -henLength, -henLength);
	choten[7] = new Choten(-henLength, -henLength, henLength);
}

function loop(){	//常時実行される
	for(let i=0; i<choten.length; ++i){
		choten[i].kaiten(kakudoX, kakudoY, kakudoZ);
	}

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
//❷ 指の位置の保存と回転角度の計算
//指の位置の保存
	preYubiX = curYubiX;
	preYubiY = curYubiY;
//回転を止める
	kakudoX = 0;
	kakudoY = 0;
}

function touchMove(){	//指が動いたら(マウスが動いたら)
	if(yubiTouched){
//回転角度の計算
		kakudoY = (curYubiX - preYubiX)*0.003;
		kakudoX = (curYubiY - preYubiY)*0.003;
//指の位置の保存
		preYubiX = curYubiX;
		preYubiY = curYubiY;
	}
}

function touchEnd(){	//指が離されたら(マウスアップ)
	
}