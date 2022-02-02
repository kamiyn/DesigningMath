<template>
  <div>
    <p>Chapter 9 9-3 下地を描く</p>
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
/* http://localhost:3000/chapter09/3 */
import { defineComponent } from "vue";
import designingmath from "@/components/designingmath.vue";

class Point {
  constructor(public x: number, public y: number) {}
}
class Maru {
  constructor(public x: number, public y: number) {}
}

var ten: Point[] = [];
var maruArrArr: Maru[][] = [];
var unitKyori = 0;

export default defineComponent({
  components: {
    designingmath,
  },
  setup() {},
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
      // コントロールポイントを画面中心に初期化
      ten = [...Array(4).keys()].map((idx) => {
        return new Point(screenWidth / 2, screenHeight / 2);
      });

      const unitYokoKazu = 20;
      const yokoInterval = screenWidth / (unitYokoKazu - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu = Math.floor(screenHeight / tateInterval) + 1;
      unitKyori = yokoInterval;

      maruArrArr = [...Array(unitTateKazu).keys()].map((tateNum) =>
        [...Array(unitYokoKazu).keys()].map((yokoNum) => {
          const x =
            yokoInterval * yokoNum - (tateNum % 2 === 0 ? yokoInterval / 2 : 0);
          const y = tateInterval * tateNum;
          return new Maru(x, y);
        })
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

      // 位置の計算
      var prevTen: Point | null = null;
      ten.forEach((t) => {
        if (prevTen === null) {
          // 先頭の点
          if (yubiTouched) {
            t.x = curYubiX;
            t.y = curYubiY;
          }
        } else {
          t.x += (prevTen.x - t.x) / 10;
          t.y += (prevTen.y - t.y) / 10;
        }
        prevTen = t; // 次の点に対する差分計算用に渡す
      });

      // 描画
      ctx.clearRect(0, 0, screenWidth, screenHeight);

      // 下地に並べる〇の描画
      const hankei = unitKyori / 4; // 半径は ● の距離の 1/4
      maruArrArr.forEach((maruY) =>
        maruY.forEach((maru) => {
          ctx.strokeStyle = "black";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(maru.x, maru.y, hankei, 0, Math.PI * 2, true);
          ctx.stroke();
        })
      );

      // ベジエ曲線の描画
      ctx.beginPath();
      ctx.lineWidth = 8;
      ctx.strokeStyle = "black";
      ctx.moveTo(ten[0].x, ten[0].y);
      ctx.bezierCurveTo(
        ten[1].x,
        ten[1].y,
        ten[2].x,
        ten[2].y,
        ten[3].x,
        ten[3].y
      );
      ctx.stroke();

      // コントロールポイントの描画
      const hankeiControl = 35;
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(ten[0].x, ten[0].y, hankeiControl, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ten[3].x, ten[3].y, hankeiControl, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.stroke();
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
