<template>
  <div>
    <p>Chapter 9 9-1 コントロールポイントを作る</p>
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
/* http://localhost:3000/chapter09/1 */
import { defineComponent } from "vue";
import designingmath from "@/components/designingmath.vue";

class Point {
  constructor(public x: number, public y: number) {}
}

var ten: Point[] = [];

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
      ctx.clearRect(0, 0, screenWidth, screenWidth);

      const hankei = 35;
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 4;
      ten.forEach((t) => {
        ctx.beginPath();
        ctx.arc(t.x, t.y, hankei, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
      });
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
