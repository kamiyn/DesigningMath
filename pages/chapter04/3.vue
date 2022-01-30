<template>
  <div>
    <p>Chapter 4 4-3 互い違いに配置する</p>
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
/* http://localhost:3000/chapter04/3 */
import { defineComponent } from "vue";
import designingmath from "@/components/designingmath.vue";

const unitKazu = 8;
const unitYokoKazu = unitKazu;
const unitTateKazu = unitKazu * 4; // 縦に並ぶ数を4倍にする
var unitSize: number;
var unitSizeX: number;
var unitSizeY: number;
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
      const screenSize = Math.min(screenWidth, screenHeight); // 縦長、横長どちらでも使えるよう 短い方を基準に描画する
      unitSize = screenSize / unitKazu;
      unitSizeX = screenSize / unitYokoKazu;
      unitSizeY = screenSize / unitTateKazu;
      const totalLength = unitSize * unitKazu;
      offsetX = (screenWidth - totalLength) / 2;
      offsetY = (screenHeight - totalLength) / 2;

      // 縦方向に上から詰めて 上にある〇が裏側に来るようにする、が外側のループ
      // 横・縦とも 描画する個数を1つ増やす
      [...Array(unitTateKazu + 1).keys()].forEach((tateNum) =>
        [...Array(unitYokoKazu + 1).keys()].forEach((yokoNum) => {
          const hankei = unitSize / 2;
          const x =
            unitSizeX * yokoNum +
            offsetX +
            (tateNum % 2 === 1 ? -unitSize / 2 : 0); // 奇数行の位置を〇の大きさの半分ずらす
          const y = unitSizeY * (tateNum - 1) + offsetY; // 全体の縦の位置を 1/4 だけ上にずらす

          ctx.fillStyle = "rgba(255, 200, 200, 0.7)"; // アルファ値を指定して薄ピンク色にする
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
