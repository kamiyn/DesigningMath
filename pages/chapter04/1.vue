<template>
  <div>
    <p>Chapter 4 4-1 〇を並べる</p>
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
/* http://localhost:3000/chapter04/1 */
import { defineComponent } from "vue";
import designingmath from "@/components/designingmath.vue";

const unitKazu = 8;
const unitYokoKazu = unitKazu;
const unitTateKazu = unitKazu;
var unitSize: number;
var offsetX: number;
var offsetY: number;

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
      const totalLength = unitSize * unitKazu;
      offsetX = (screenWidth - totalLength) / 2;
      offsetY = (screenHeight - totalLength) / 2;

      [...Array(unitTateKazu).keys()].forEach((tateNum) =>
        [...Array(unitYokoKazu).keys()].forEach((yokoNum) => {
          const x = unitSize * yokoNum + offsetX;
          const y = unitSize * tateNum + offsetY;
          const hankei = unitSize / 2;

          ctx.fillStyle = "rgb(255, 200, 200)";
          ctx.strokeStyle = "red";
          ctx.beginPath();
          ctx.arc(
            x + hankei /* 配置用の半径は維持する */,
            y + hankei,
            hankei /* 描画用の半径 */,
            0,
            Math.PI * 2,
            true
          );
          ctx.fill();
          ctx.stroke();
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
