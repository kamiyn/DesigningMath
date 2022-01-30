<template>
  <div>
    <p @click="onClick()">Chapter 5 5-2 〇の大きさの変化を sin カーブにする</p>
    <input v-model="numCycle" />
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
/* http://localhost:3000/chapter05/2 */
import { defineComponent } from "vue";
import designingmath from "@/components/designingmath.vue";

var centerX: number;
var centerY: number;
const numPattern = 3;
var targetPattern = 0;

export default defineComponent({
  components: {
    designingmath,
  },
  setup() {
    return {
      numCycle: "8",
    };
  },
  methods: {
    onClick() {
      targetPattern = ++targetPattern % numPattern;
      console.log(targetPattern);
    },
    setupFunc(
      ctx: CanvasRenderingContext2D,
      screenWidth: number,
      screenHeight: number,
      curYubiX: number,
      curYubiY: number,
      yubiTouched: boolean
    ) {
      console.log("setupFunc");
      // スクリーン中心点を計算しておく
      centerX = screenWidth / 2;
      centerY = screenHeight / 2;
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
      switch (targetPattern) {
        case 0:
          this.loopFunc0(ctx);
          break;
        case 1:
          this.loopFunc1(ctx);
          break;
        case 2:
          this.loopFunc2(ctx);
          break;
      }
    },
    loopFunc0(ctx: CanvasRenderingContext2D) {
      const cycle = parseInt(this.numCycle, 10);

      for (var degree = 0; degree < 360; degree += 3) {
        const kakudo = (degree / 180) * Math.PI;
        const hankei1 = 400;
        const haba = 20;
        const hankei2 = haba * (Math.sin(kakudo * cycle) + 1);

        const x = hankei1 * Math.cos(kakudo) + centerX;
        const y = hankei1 * Math.sin(kakudo) + centerY;
        ctx.beginPath();
        ctx.arc(x, y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }
    },
    loopFunc1(ctx: CanvasRenderingContext2D) {
      for (var degree = 0; degree < 360; degree += 3) {
        const kakudo = (degree / 180) * Math.PI;
        const hankei1 = 400;
        const hankei2 = 10;
        const x = degree;
        const y = hankei1 * Math.sin(kakudo) + centerY;
        ctx.beginPath();
        ctx.arc(x, y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }
    },
    loopFunc2(ctx: CanvasRenderingContext2D) {
      for (var degree = 0; degree < 360; degree += 3) {
        const kakudo = (degree / 180) * Math.PI;
        const hankei1 = 400;
        const hankei2 = 10;
        const x = degree;
        const y = hankei1 * Math.sin(kakudo * 2) + centerY;
        ctx.beginPath();
        ctx.arc(x, y, hankei2, 0, Math.PI * 2, true);
        ctx.stroke();
      }
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
