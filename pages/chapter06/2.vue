<template>
  <div>
    <p @click="onClick()">Chapter 6 6-2 色相を位置に展開</p>
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
/* http://localhost:3000/chapter06/2 */
import { defineComponent } from "vue";
import designingmath from "@/components/designingmath.vue";

// 本では配列で返して添え字用の定数を定義していましたが
// ここでは interface を定義し利用する側で補完可能にしています
interface IRGB {
  red: number;
  green: number;
  blue: number;
}

interface IHSB {
  hue: number;
  sat: number;
  bri: number;
}

function hsbToRgb(hsb: IHSB): IRGB {
  // 値の正規化
  const hue = (hsb.hue % 360) + (hsb.hue < 0 ? 360 : 0);
  const sat = Math.min(Math.max(hsb.sat, 0), 255);
  const bri = Math.min(Math.max(hsb.bri, 0), 255);
  const maxVal = bri;
  const minVal = (1 - sat / 255) * maxVal;

  if (hue < 60) {
    return {
      red: maxVal,
      green: minVal + ((hue - 0) / 60) * (maxVal - minVal),
      blue: minVal,
    };
  } else if (hue < 120) {
    return {
      red: maxVal - ((hue - 60) / 60) * (maxVal - minVal),
      green: maxVal,
      blue: minVal,
    };
  } else if (hue < 180) {
    return {
      red: minVal,
      green: maxVal,
      blue: minVal + ((hue - 120) / 60) * (maxVal - minVal),
    };
  } else if (hue < 240) {
    return {
      red: minVal,
      green: maxVal - ((hue - 180) / 60) * (maxVal - minVal),
      blue: maxVal,
    };
  } else if (hue < 300) {
    return {
      red: minVal + ((hue - 240) / 60) * (maxVal - minVal),
      green: minVal,
      blue: maxVal,
    };
  } else if (hue <= 360) {
    return {
      red: maxVal,
      green: minVal,
      blue: maxVal - ((hue - 300) / 60) * (maxVal - minVal),
    };
  } else {
    throw "invalid hue";
  }
}

const unitKazu = 8;
const unitYokoKazu = unitKazu;
const unitTateKazu = unitKazu * 2; // 半分ずつ重ねる
var unitSize: number;
var unitSizeX: number;
var unitSizeY: number;
var offsetX: number;
var offsetY: number;
const numPattern = 2;
var targetPattern = 0;
var startTime: number;

export default defineComponent({
  components: {
    designingmath,
  },
  setup() {},
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
      const passedTime = (new Date().getTime() - startTime) / 1000; // ミリ秒単位で 0から1の間を変化する

      const screenSize = Math.min(screenWidth, screenHeight); // 縦長、横長どちらでも使えるよう 短い方を基準に描画する
      unitSize = screenSize / unitKazu;
      unitSizeX = screenSize / unitYokoKazu;
      unitSizeY = screenSize / unitTateKazu;
      const totalLength = unitSize * unitKazu;
      offsetX = (screenWidth - totalLength) / 2;
      offsetY = (screenHeight - totalLength) / 2;

      const totalCount = (unitTateKazu + 1) * (unitYokoKazu + 1);
      var idx: number = 0;

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

          // 色の計算
          const rgb = hsbToRgb({
            hue: (idx++ / totalCount) * 360 + passedTime * 60 * targetPattern,
            sat: (curYubiX / screenWidth) * 255,
            bri: (curYubiY / screenHeight) * 255,
          });

          // 描画 本では drawUnit にあたる部分
          ctx.fillStyle = `rgb(${rgb.red},${rgb.green},${rgb.blue})`;
          ctx.beginPath();
          ctx.arc(x + hankei, y + hankei, hankei, 0, Math.PI * 2, true);
          ctx.fill();
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
