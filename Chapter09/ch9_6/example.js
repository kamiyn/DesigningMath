class Point{
	constructor(xx, yy){
		this.x = xx;
		this.y = yy;
	}
}

function sayuHantei(p0, p1, p2){
	let x1 = p1.x - p0.x;
	let y1 = p1.y - p0.y;
	let x2 = p2.x - p0.x;
	let y2 = p2.y - p0.y;
	let ret = x1*y2 - x2*y1;
	ret = Math.sign(ret);
	return ret;
}
//❶ 六角形を描く関数(1つずつバージョン)
function drawRokkaku(xx, yy, hankei){
	let tx, ty;
	ctx.beginPath();
//0度方向の頂点
	tx = xx + hankei*Math.sin(Math.PI*2/6*0);
	ty = yy + hankei*Math.cos(Math.PI*2/6*0);
	ctx.moveTo(tx, ty);
//60度方向の頂点
	tx = xx + hankei*Math.sin(Math.PI*2/6*1);
	ty = yy + hankei*Math.cos(Math.PI*2/6*1);
	ctx.lineTo(tx, ty);
//120度方向の頂点
	tx = xx + hankei*Math.sin(Math.PI*2/6*2);
	ty = yy + hankei*Math.cos(Math.PI*2/6*2);
	ctx.lineTo(tx, ty);
//180度方向の頂点
	tx = xx + hankei*Math.sin(Math.PI*2/6*3);
	ty = yy + hankei*Math.cos(Math.PI*2/6*3);
	ctx.lineTo(tx, ty);
//240度方向の頂点
	tx = xx + hankei*Math.sin(Math.PI*2/6*4);
	ty = yy + hankei*Math.cos(Math.PI*2/6*4);
	ctx.lineTo(tx, ty);
//300度方向の頂点
	tx = xx + hankei*Math.sin(Math.PI*2/6*5);
	ty = yy + hankei*Math.cos(Math.PI*2/6*5);
	ctx.lineTo(tx, ty);

	ctx.closePath();
	ctx.stroke();
}
//❷ 六角形を描く関数(for文バージョン)
function drawRokkaku2(xx, yy, hankei){
	ctx.beginPath();
	for(let i=0; i<6; ++i){
//各々の頂点
		let tx = xx + hankei*Math.sin(Math.PI*2/6*i);
		let ty = yy + hankei*Math.cos(Math.PI*2/6*i);
		if(i == 0){
//最初(0)の頂点
			ctx.moveTo(tx, ty);
		}else{
//最初以外の頂点
			ctx.lineTo(tx, ty);
		}
	}
	ctx.closePath();
	ctx.stroke();
}

let ten = new Array();
let base = new Array();
let unitKyori;

function setup(){	//最初に実行される
	for(let i=0; i<4; ++i){
		ten[i] = new Point(screenWidth/2, screenHeight/2);
	}

	let unitYokoKazu = 20;
	let yokoInterval = screenWidth / (unitYokoKazu-1);
	let tateInterval = yokoInterval * Math.sin(Math.PI/3);
	let unitTateKazu = Math.ceil(screenHeight / tateInterval)+1;
	unitKyori = yokoInterval;
	for(let i=0; i<unitYokoKazu*unitTateKazu; ++i){
		let tateNum = parseInt(i / unitYokoKazu);
		let yokoNum = i % unitYokoKazu;
		let x = yokoInterval*yokoNum;
		let y = tateInterval*tateNum;
		if(tateNum % 2 == 0)	x -= yokoInterval/2;
		base[i] = new Point(x, y);
	}
}

function loop(){	//常時実行される
	for(let i=0; i<ten.length; ++i){
		if(i==0){
			if(yubiTouched){
				ten[i].x = curYubiX;
				ten[i].y = curYubiY;
			}
		}else{
			ten[i].x += (ten[i-1].x - ten[i].x)/10;
			ten[i].y += (ten[i-1].y - ten[i].y)/10;
		}
	}
	
	ctx.clearRect(0, 0, screenWidth, screenHeight);

	for(let i=0; i<base.length; ++i){
		let hankei = unitKyori / 4;
		
		let sayu = sayuHantei(ten[3], ten[2], base[i]);
		sayu += sayuHantei(ten[2], ten[1], base[i]);
		sayu += sayuHantei(ten[1], ten[0], base[i]);
		if(sayu == 3){
			ctx.strokeStyle="red";
			hankei = unitKyori * 0.7;
		}else if(sayu == -3){
			ctx.strokeStyle="black";
			hankei = unitKyori * 0.7;
		}else{
			ctx.strokeStyle="grey";
			hankei = unitKyori * 0.35;
		}

		ctx.lineWidth = 2;
//❸ 六角形の描画
		drawRokkaku(base[i].x, base[i].y, hankei);
	}

	ctx.beginPath();
	ctx.lineWidth = 8;
	ctx.strokeStyle="black";
	ctx.moveTo(ten[0].x, ten[0].y);
	ctx.bezierCurveTo(ten[1].x, ten[1].y, ten[2].x, ten[2].y, ten[3].x, ten[3].y);
	ctx.stroke();

	let hankei = 35;
	ctx.fillStyle="white";
	ctx.strokeStyle="black";
	ctx.lineWidth = 4;

	ctx.beginPath();
	ctx.arc(ten[0].x, ten[0].y, hankei, 0, Math.PI*2, true);
	ctx.fill();
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(ten[3].x, ten[3].y, hankei, 0, Math.PI*2, true);
	ctx.fill();
	ctx.stroke();
}

function touchStart(){	//タッチ(マウスダウン)されたら
	
}

function touchMove(){	//指が動いたら(マウスが動いたら)
	
}

function touchEnd(){	//指が離されたら(マウスアップ)
	
}