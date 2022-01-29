<template>
  <div>
    <p>Chapter 2 2-6 文字を描く</p>
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
/* http://localhost:3000/chapter02/5 */
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
      ctx.fillText("Designing Math.", screenWidth / 2, 200);
      ctx.strokeStyle = "black";
      ctx.font = "60px Serif";
      ctx.textAlign = "right";
      ctx.strokeText("Designing Math.", screenWidth / 2, 400);

      ctx.fillStyle = "grey";
      ctx.strokeStyle = "red";
      ctx.lineWidth = 4;
      ctx.font = "80px Helvetica";
      ctx.textAlign = "center";
      // 枠線を描いてから塗る
      ctx.strokeText("Designing Math.", screenWidth / 2, 600);
      ctx.fillText("Designing Math.", screenWidth / 2, 600);
      // 塗ってから枠線を描画
      ctx.fillText("Designing Math.", screenWidth / 2, 800);
      ctx.strokeText("Designing Math.", screenWidth / 2, 800);
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
