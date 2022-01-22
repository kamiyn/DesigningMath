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
//❶ ベジェ曲線の節クラス
class BezierChoten{
	constructor(xx1, yy1, zz1, xx2, yy2, zz2, xx3, yy3, zz3){
		this.p1 = new Choten(xx1, yy1, zz1);
		this.p2 = new Choten(xx2, yy2, zz2);
		this.p3 = new Choten(xx3, yy3, zz3);
	}
}

let choten = new Array();
let kakudoX = 0;
let kakudoY = 0;
let kakudoZ = 0;
let preYubiX;
let preYubiY;
//❷ 節の変数の宣言
let bezCt = new Array();
//❸ 節の座標情報
let bezCtLoc = [
	[57.0, 36.1, 0, 53.5, 41.8, 0, 47.0, 41.8, 0],
	[43.8, 41.8, 0, 42.6, 40.5, 0, 38.0, 35.9, 0],
	[35.4, 33.1, 0, 33.1, 33.1, 0, 25.6, 33.0, 0],
	[25.6, 33.0, 0, 25.6, 32.0, 0, 25.6, 32.0, 0],
	[32.5, 30.3, 0, 36.4, 29.4, 0, 36.4, 23.6, 0],
	[36.4, 15.0, 0, 25.5, 3.1, 0, 13.5, 3.1, 0],
	[9.9, 3.1, 0, 6.0, 4.3, 0, 4.5, 4.8, 0],
	[10.5, 9.3, 0, 20.4, 18.6, 0, 20.4, 31.8, 0],
	[20.4, 47.6, 0, 4.1, 52.6, 0, -2.8, 52.6, 0],
	[-5.8, 52.6, 0, -7.9, 52.3, 0, -8.4, 48.6, 0],
	[-9.4, 42.1, 0, -9.6, 40.3, 0, -23.3, 30.9, 0],
	[-23.3, 30.9, 0, -22.6, 30.3, 0, -22.6, 30.3, 0],
	[-19.5, 31.1, 0, -13.75, 32.8, 0, -8.3, 32.8, 0],
	[-5.3, 32.8, 0, 0.4, 32.8, 0, 0.4, 27.3, 0],
	[0.4, 25.9, 0, -0.1, 19.4, 0, -7.8, 11.1, 0],
	[-23.4, 21.1, 0, -30.3, 32.8, 0, -35.9, 42.3, 0],
	[-36.5, 43.3, 0, -40.5, 49.4, 0, -43.9, 49.4, 0],
	[-47.3, 49.4, 0, -54.8, 43.4, 0, -54.8, 33.1, 0],
	[-54.8, 24.4, 0, -50.4, 20.4, 0, -43.9, 14.3, 0],
	[-44.8, 16.8, 0, -45, 17.8, 0, -45, 18.9, 0],
	[-45, 21.25, 0, -44.3, 23.6, 0, -41.6, 23.6, 0],
	[-39.8, 23.6, 0, -38.3, 23.3, 0, -30.3, 18.4, 0],
	[-21.9, 13.1, 0, -15.8, 10.1, 0, -11.0, 7.8, 0],
	[-19.8, -1.0, 0, -20.1, -5.1, 0, -20.1, -8.3, 0],
	[-20.1, -15.5, 0, -15.6, -18.9, 0, -13.3, -20.8, 0],
	[-9.4, -23.75, 0, -8.9, -24.1, 0, -8.9, -25.1, 0],
	[-8.9, -26.1, 0, -9.6, -27.0, 0, -13.0, -29.3, 0],
	[-19.1, -33.4, 0, -23.1, -41.25, 0, -23.1, -49.1, 0],
	[-23.1, -50.8, 0, -23.0, -51.9, 0, -22.8, -53.75, 0],
	[-16.4, -43.6, 0, -11.9, -43.4, 0, 2.3, -42.3, 0],
	[8.4, -41.8, 0, 16.25, -35, 0, 16.25, -26.9, 0],
	[16.25, -20.8, 0, 10.9, -19.3, 0, 8.4, -19.3, 0],
	[6.6, -19.3, 0, -1.4, -20.9, 0, -3.0, -20.9, 0],
	[-9.4, -20.9, 0, -15.5, -17.1, 0, -15.5, -13.5, 0],
	[-15.5, -8.3, 0, -6.8, -2.6, 0, 1.4, 2.6, 0],
	[7.9, 0.3, 0, 14.1, -0.9, 0, 21.0, -0.9, 0],
	[47.8, -0.9, 0, 57.0, 19.3, 0, 57.0, 30.3, 0],
	[57.0, 36.1, 0, 53.5, 41.8, 0, 47.0, 41.8, 0]
];

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
//❹ 節の初期化
	for(let i=0; i<bezCtLoc.length; ++i){
		bezCt[i] = new BezierChoten(
			bezCtLoc[i][0]/100*henLength, bezCtLoc[i][1]/100*henLength, bezCtLoc[i][2]/100*henLength, 
			bezCtLoc[i][3]/100*henLength, bezCtLoc[i][4]/100*henLength, bezCtLoc[i][5]/100*henLength, 
			bezCtLoc[i][6]/100*henLength, bezCtLoc[i][7]/100*henLength, bezCtLoc[i][8]/100*henLength);
	}
}

function loop(){	//常時実行される
	for(let i=0; i<choten.length; ++i){
		choten[i].kaiten(kakudoX, kakudoY, kakudoZ);
	}
//❺ 節の回転
	for(let i=0; i<bezCt.length; ++i){
		bezCt[i].p1.kaiten(kakudoX, kakudoY, kakudoZ);
		bezCt[i].p2.kaiten(kakudoX, kakudoY, kakudoZ);
		bezCt[i].p3.kaiten(kakudoX, kakudoY, kakudoZ);
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
//❻ 節の描画
	ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
	ctx.strokeStyle = "black";
	ctx.beginPath();
	ctx.moveTo(bezCt[0].p3.tx, bezCt[0].p3.ty);
	for(let i=1; i<bezCt.length; ++i){
		ctx.bezierCurveTo(bezCt[i].p1.tx, bezCt[i].p1.ty, bezCt[i].p2.tx, bezCt[i].p2.ty, bezCt[i].p3.tx, bezCt[i].p3.ty);
	}
	ctx.fill();
	ctx.stroke();

	ctx.restore();
}

function touchStart(){	//タッチ(マウスダウン)されたら
	preYubiX = curYubiX;
	preYubiY = curYubiY;
	
	kakudoX = 0;
	kakudoY = 0;
}

function touchMove(){	//指が動いたら(マウスが動いたら)
	if(yubiTouched){
		kakudoY = (curYubiX - preYubiX)*0.003;
		kakudoX = (curYubiY - preYubiY)*0.003;
		
		preYubiX = curYubiX;
		preYubiY = curYubiY;
	}
}

function touchEnd(){	//指が離されたら(マウスアップ)
	
}