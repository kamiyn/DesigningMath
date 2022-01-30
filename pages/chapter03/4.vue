<template>
  <div>
    <p>Chapter 3 3-4 時間に沿って大きさを動かす</p>
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
/* http://localhost:3000/chapter03/4 */
import { defineComponent } from "vue";
import designingmath from "@/components/designingmath.vue";

const unitKazu = 16;
var unitSize: number;
var offsetX: number;
var offsetY: number;
var startTime: number;

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
      unitSize = Math.min(screenWidth, screenHeight) / unitKazu;
      startTime = new Date().getTime(); // ミリ秒単位での UnixEpoch からの経過時間
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
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      const par2 = ((new Date().getTime() - startTime) % 1000) / 999; // ミリ秒単位で 0から1の間を変化する

      const totalLength = unitSize * unitKazu;
      offsetX = (screenWidth - totalLength) / 2;
      offsetY = (screenHeight - totalLength) / 2;
      const hankei = unitSize / 2;
      var idx = 0;

      [...Array(unitKazu).keys()].forEach((tateNum) =>
        [...Array(unitKazu).keys()].forEach((yokoNum) => {
          const par1 = (idx++ % (unitKazu + 1)) / unitKazu; // ここは順序依存で描画用の半径のための比率を演算している

          const x = unitSize * yokoNum + offsetX;
          const y = unitSize * tateNum + offsetY;
          ctx.beginPath();
          ctx.arc(
            x + hankei /* 配置用の半径は維持する */,
            y + hankei,
            (((par1 + par2) * hankei) % hankei) + 1 /* 描画用の半径 */,
            0,
            Math.PI * 2,
            true
          );
          ctx.fill();
        })
      );
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
