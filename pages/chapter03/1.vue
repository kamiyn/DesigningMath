<template>
  <div>
    <p>Chapter 3 3-1 縦横に●を並べる</p>
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
/* http://localhost:3000/chapter03/1 */
import { defineComponent } from "vue";
import designingmath from "@/components/designingmath.vue";

const unitKazu = 16;
const unitSize = 60;
const xOffset = unitSize / 2;
const yOffset = unitSize / 2;
const hankei = unitSize / 2;

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
      // 本では loop に書いているが1回でよい
      // 縦方向と横方向の二重ループの方がやりたいことに沿っていると思われるため 一重ループと商・剰余 の組み合わせから変更した
      [...Array(unitKazu).keys()].forEach((tateNum) =>
        [...Array(unitKazu).keys()].forEach((yokoNum) => {
          const x = unitSize * yokoNum + xOffset;
          const y = unitSize * tateNum + yOffset;
          ctx.beginPath();
          ctx.arc(x, y, hankei, 0, Math.PI * 2, true);
          ctx.fill();
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
