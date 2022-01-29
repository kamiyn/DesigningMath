<template>
  <div>
    <p>Chapter 1 1-2 基礎描画</p>
    <designingmath
      :setupFunc="setupFunc"
      :loopFunc="loopFunc"
      :touchstartFunc="touchStartFunc"
      :touchEndFunc="touchEndFunc"
      :touchMoveFunc="touchMoveFunc"
    />
  </div>
</template>

<script lang="ts">
/* http://localhost:3000/chapter01/2*/
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
      ctx.moveTo(200, 200);
      ctx.lineTo(800, 900);
      ctx.stroke();
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
    touchstartFunc(
      ctx: CanvasRenderingContext2D,
      screenWidth: number,
      screenHeight: number,
      curYubiX: number,
      curYubiY: number,
      yubiTouched: boolean
    ) {
      console.log("touchstartFunc");
    },
    touchMoveFunc(
      ctx: CanvasRenderingContext2D,
      screenWidth: number,
      screenHeight: number,
      curYubiX: number,
      curYubiY: number,
      yubiTouched: boolean
    ) {
      console.log("touchMoveFunc");
    },
    touchEndFunc(
      ctx: CanvasRenderingContext2D,
      screenWidth: number,
      screenHeight: number,
      curYubiX: number,
      curYubiY: number,
      yubiTouched: boolean
    ) {
      console.log("touchEndFunc");
    },
  },
});
</script>
