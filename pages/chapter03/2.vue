<template>
  <div>
    <p>Chapter 3 3-2 エリア内にぴったり収める</p>
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
/* http://localhost:3000/chapter03/2 */
import { defineComponent } from "vue";
import designingmath from "@/components/designingmath.vue";

const unitKazu = 16;
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
      const hankei = unitSize / 2;

      [...Array(unitKazu).keys()].forEach((tateNum) =>
        [...Array(unitKazu).keys()].forEach((yokoNum) => {
          const x = unitSize * yokoNum + offsetX;
          const y = unitSize * tateNum + offsetY;
          ctx.beginPath();
          // x は左端, y は上端なので 中心点に対しては半径分を足す
          ctx.arc(x + hankei, y + hankei, hankei, 0, Math.PI * 2, true);
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
