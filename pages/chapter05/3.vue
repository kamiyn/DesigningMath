<template>
  <div>
    <p>Chapter 5 5-3 円周の半径を sin カーブにする</p>
    <input v-model="numCycle" />
    <input v-model="numCycleRadius" />
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
/* http://localhost:3000/chapter05/3 */
import { defineComponent } from "vue";
import designingmath from "@/components/designingmath.vue";

var centerX: number;
var centerY: number;

export default defineComponent({
  components: {
    designingmath,
  },
  setup() {
    return {
      numCycle: "8",
      numCycleRadius: "6",
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
      const cycle = parseInt(this.numCycle, 10);
      const cycleRadius = parseInt(this.numCycleRadius, 10);

      for (var degree = 0; degree < 360; degree += 3) {
        const kakudo = (degree / 180) * Math.PI;
        const hankei1 = 100 * Math.sin(kakudo * cycleRadius) + 400;
        const haba = 20;
        const hankei2 = haba * (Math.sin(kakudo * cycle) + 1);

        const x = hankei1 * Math.cos(kakudo) + centerX;
        const y = hankei1 * Math.sin(kakudo) + centerY;
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
