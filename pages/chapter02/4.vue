<template>
  <div>
    <p>Chapter 2 2-4 いろいろな形を描く</p>
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
/* http://localhost:3000/chapter02/4 */
import { defineComponent } from "vue";
import designingmath from "@/components/designingmath.vue";

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
      ctx.beginPath();
      ctx.arc(
        500 /* 中心点 x */,
        200 /* 中心点 y */,
        100 /* 半径 */,
        (30 / 180) * Math.PI /* 開始角度 x軸方向から時計回り */,
        (120 / 180) * Math.PI /* 終了角度 */,
        true /* 反時計回りか */
      );
      ctx.stroke();

      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(
        500 /* 中心点 x */,
        600 /* 中心点 y */,
        200 /* 横半径 */,
        100 /* 縦半径 */,
        (45 / 180) * Math.PI /* 傾き */,
        (30 / 180) * Math.PI /* 開始角度 */,
        (120 / 180) * Math.PI /* 終了角度 */,
        true
      );
      ctx.stroke();

      ctx.beginPath();
      ctx.rect(
        800 /* left */,
        100 /* top */,
        100 /* width */,
        200 /* height */
      );
      ctx.fill();
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
