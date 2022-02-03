<template>
  <div>
    <p>Chapter 10 10-3 空間内で回転させる</p>
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
/* http://localhost:3000/chapter10/3 */
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
      kakudoX += Math.PI * 0.01;
      kakudoY += -Math.PI * 0.02;
      kakudoZ += -Math.PI * 0.03;

      const gc = parseInt(this.objectDistance);
      const sc = parseInt(this.screenDistance);

      // 回転の実行
      const chotenRotated = choten.map(c => c.kaiten(kakudoX, kakudoY, kakudoZ));
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
