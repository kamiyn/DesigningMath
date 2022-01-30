<template>
  <div>
    <p>Chapter 4 4-7 それぞれの波をずらす</p>
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
/* http://localhost:3000/chapter04/7 */
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
      const screenSize = Math.min(screenWidth, screenHeight); // 縦長、横長どちらでも使えるよう 短い方を基準に描画する
      unitSize = screenSize / unitKazu;
      unitSizeX = screenSize / unitYokoKazu;
      unitSizeY = screenSize / unitTateKazu;
      const totalLength = unitSize * unitKazu;
      offsetX = (screenWidth - totalLength) / 2;
      offsetY = (screenHeight - totalLength) / 2;
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
      const par2 = ((new Date().getTime() - startTime) % 3000) / 3000; // ミリ秒単位で 0から1の間を変化する
      const kakudoA = par2 * Math.PI * 2; // 回転角度
      const kakudo324 = 0.9 * Math.PI * 2; // 90% 324度 を表すラジアン
      var idx = 0;

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
          const kakudoB =
            ((idx++ % (unitYokoKazu + 2)) / (unitYokoKazu + 1)) * Math.PI * 2; // 描画する個数に対して更に+1 した周期

          // 下地を塗りつぶす
          ctx.fillStyle = "white";
          ctx.beginPath();
          ctx.arc(
            x + hankei /* 配置用の半径は維持する */,
            y + hankei,
            hankei,
            0,
            Math.PI * 2,
            true
          );
          ctx.fill();

          // 4個の赤い円の描画 (半径を5分割して間の4か所に描画する)
          const arcNum = 4;
          ctx.lineWidth = hankei / (arcNum * 2 + 1); // W-R-W-R-W-R-W-R-W
          ctx.strokeStyle = "red";
          [...Array(arcNum).keys()].forEach((lineIdx) => {
            const kakudoC = ((lineIdx + 1) / (arcNum + 1)) * Math.PI;
            ctx.beginPath();
            ctx.arc(
              x + hankei /* 配置用の半径は維持する */,
              y + hankei,
              (hankei / (arcNum + 1)) * (lineIdx + 1) /* 描画用の半径 */,
              kakudoA + kakudoB + kakudoC + 0,
              kakudoA + kakudoB + kakudoC + kakudo324,
              false
            );
            ctx.stroke();
          });
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
