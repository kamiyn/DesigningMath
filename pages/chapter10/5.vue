<template>
  <div>
    <p>Chapter 10 10-5 空間内のベジエ曲線</p>
    <input v-model="objectDistance" />
    <input v-model="screenDistance" />
    <designingmath
      :setupFunc="setupFunc"
      :loopFunc="loopFunc"
      :touchOrMouseStartFunc="touchOrMouseStartFunc"
      :touchOrMouseEndFunc="touchOrMouseEndFunc"
      :touchOrMouseMoveFunc="touchOrMouseMoveFunc"
    />
  </div>
</template>

<script lang="ts">
/* http://localhost:3000/chapter10/5 */
import { defineComponent } from "vue";
import designingmath from "@/components/designingmath.vue";

// Point は2次元の点
class Point {
  constructor(public x: number, public y: number) {}
}

// Choten は3次元の頂点
class Choten {
  constructor(public x: number, public y: number, public z: number) {}

  // 本では直接 + 3000 している部分を引数にしている
  gxyz(gc: number): Choten {
    return new Choten(this.x, this.y, this.z + gc);
  }

  // 本では先に sc = 2000 としている部分を引数にしている
  toei(gc: number, sc: number): Point {
    const g = this.gxyz(gc);
    return new Point((sc * g.x) / g.z, (sc * g.y) / g.z);
  }

  // 回転(一次変換) の関数
  kaiten(kx: number, ky: number, kz: number): Choten {
    // XZ平面で回転 (角度 ky)
    const x0 = this.x * Math.cos(ky) - this.z * Math.sin(ky);
    const y0 = this.y;
    const z0 = this.x * Math.sin(ky) + this.z * Math.cos(ky);

    // YZ平面で回転 (角度 kx)
    const x1 = x0;
    const y1 = y0 * Math.cos(kx) - z0 * Math.sin(kx);
    const z1 = y0 * Math.sin(kx) + z0 * Math.cos(kx);

    // XY平面で回転 (角度 kz)
    const x2 = x1 * Math.cos(kz) - y1 * Math.sin(kz);
    const y2 = x1 * Math.sin(kz) + y1 * Math.cos(kz);
    const z2 = z1;

    return new Choten(x2, y2, z2);
  }
}

class BezierChoten {
  constructor(public p1: Choten, public p2: Choten, public p3: Choten) {}
}

var bezCt: BezierChoten[] = [];
const bezCtLoc: number[][] = [
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
  [57.0, 36.1, 0, 53.5, 41.8, 0, 47.0, 41.8, 0],
];

const henLength = 400;
var choten: Choten[] = [
  new Choten(henLength, henLength, henLength),
  new Choten(henLength, henLength, -henLength),
  new Choten(-henLength, henLength, -henLength),
  new Choten(-henLength, henLength, henLength),
  new Choten(henLength, -henLength, henLength),
  new Choten(henLength, -henLength, -henLength),
  new Choten(-henLength, -henLength, -henLength),
  new Choten(-henLength, -henLength, henLength),
];
var kakudoX = 0;
var kakudoY = 0;
var kakudoZ = 0;
var preYubiX = 0;
var preYubiY = 0;
var kakudoXstep = 0;
var kakudoYstep = 0;
var kakudoZstep = 0;

export default defineComponent({
  components: {
    designingmath,
  },
  setup() {
    return {
      objectDistance: "3000", // 物体までの距離
      screenDistance: "2000", // スクリーンまでの距離
    };
  },
  methods: {
    setupFunc(
      ctx: CanvasRenderingContext2D,
      screenWidth: number,
      screenHeight: number,
      curYubiX: number,
      curYubiY: number,
      yubiTouched: boolean
    ) {
      console.log("setupFunc");

      // 節の初期化
      const bezUnit = henLength / 100;
      bezCt = bezCtLoc.map(
        (loc) =>
          new BezierChoten(
            new Choten(loc[0] * bezUnit, loc[1] * bezUnit, loc[2] * bezUnit),
            new Choten(loc[3] * bezUnit, loc[4] * bezUnit, loc[5] * bezUnit),
            new Choten(loc[6] * bezUnit, loc[7] * bezUnit, loc[8] * bezUnit)
          )
      );
    },
    loopFunc(
      ctx: CanvasRenderingContext2D,
      screenWidth: number,
      screenHeight: number,
      curYubiX: number,
      curYubiY: number,
      yubiTouched: boolean
    ) {
      console.log("loopFunc");
      // 呼ばれるごとに回転角度を変更する
      kakudoX += kakudoXstep;
      kakudoY += kakudoYstep;
      kakudoZ += kakudoZstep;

      const gc = parseInt(this.objectDistance);
      const sc = parseInt(this.screenDistance);

      // 回転の実行
      const chotenRotated = choten.map((c) =>
        c.kaiten(kakudoX, kakudoY, kakudoZ)
      );
      // 節の回転
      const bezRotated = bezCt.map(
        (bez) =>
          new BezierChoten(
            bez.p1.kaiten(kakudoX, kakudoY, kakudoZ),
            bez.p2.kaiten(kakudoX, kakudoY, kakudoZ),
            bez.p3.kaiten(kakudoX, kakudoY, kakudoZ)
          )
      );
      // スクリーンへの投影
      const toeiPoints = chotenRotated.map((c) => c.toei(gc, sc));

      ctx.clearRect(0, 0, screenWidth, screenHeight);

      ctx.save();
      ctx.translate(screenWidth / 2, screenHeight / 2); // 原点を画面キャンバス中央に移動

      ctx.lineWidth = 2;
      ctx.lineJoin = "round";

      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.moveTo(toeiPoints[0].x, toeiPoints[0].y);
      ctx.lineTo(toeiPoints[1].x, toeiPoints[1].y);
      ctx.lineTo(toeiPoints[2].x, toeiPoints[2].y);
      ctx.lineTo(toeiPoints[3].x, toeiPoints[3].y);
      ctx.lineTo(toeiPoints[0].x, toeiPoints[0].y);
      ctx.lineTo(toeiPoints[4].x, toeiPoints[4].y);
      ctx.lineTo(toeiPoints[5].x, toeiPoints[5].y);
      ctx.lineTo(toeiPoints[6].x, toeiPoints[6].y);
      ctx.lineTo(toeiPoints[7].x, toeiPoints[7].y);
      ctx.lineTo(toeiPoints[4].x, toeiPoints[4].y);
      ctx.moveTo(toeiPoints[1].x, toeiPoints[1].y);
      ctx.lineTo(toeiPoints[5].x, toeiPoints[5].y);
      ctx.moveTo(toeiPoints[2].x, toeiPoints[2].y);
      ctx.lineTo(toeiPoints[6].x, toeiPoints[6].y);
      ctx.moveTo(toeiPoints[3].x, toeiPoints[3].y);
      ctx.lineTo(toeiPoints[7].x, toeiPoints[7].y);
      ctx.stroke();

      // 節の描画
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
      ctx.strokeStyle = "black";
      ctx.beginPath();
      {
        const p3 = bezRotated[0].p3.toei(gc, sc);
        ctx.moveTo(p3.x, p3.y);
      }
      bezRotated.splice(1).forEach((bez) => {
        const p1 = bez.p1.toei(gc, sc);
        const p2 = bez.p2.toei(gc, sc);
        const p3 = bez.p3.toei(gc, sc);
        ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
      });
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    },
    touchOrMouseStartFunc(
      ctx: CanvasRenderingContext2D,
      screenWidth: number,
      screenHeight: number,
      curYubiX: number,
      curYubiY: number,
      yubiTouched: boolean
    ) {
      console.log("touchOrMouseStartFunc");
      preYubiX = curYubiX;
      preYubiY = curYubiY;
      // 回転を止める
      kakudoXstep = 0;
      kakudoYstep = 0;
    },
    touchOrMouseMoveFunc(
      ctx: CanvasRenderingContext2D,
      screenWidth: number,
      screenHeight: number,
      curYubiX: number,
      curYubiY: number,
      yubiTouched: boolean
    ) {
      console.log("touchOrMouseMoveFunc");
      if (yubiTouched) {
        // 回転角度の計算
        kakudoYstep = (curYubiX - preYubiX) * 0.03;
        kakudoXstep = (curYubiY - preYubiY) * 0.03;

        // 指の位置の保存
        preYubiX = curYubiX;
        preYubiY = curYubiY;
      }
    },
    touchOrMouseEndFunc(
      ctx: CanvasRenderingContext2D,
      screenWidth: number,
      screenHeight: number,
      curYubiX: number,
      curYubiY: number,
      yubiTouched: boolean
    ) {
      console.log("touchOrMouseEndFunc");
    },
  },
});
</script>
