<template>
  <div>
    <p>Chapter 6 6-1 HSB → RGB 変換</p>
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
/* http://localhost:3000/chapter05/1 */
import { defineComponent } from "vue";
import designingmath from "@/components/designingmath.vue";

// 本では配列で返して添え字用の定数を定義していましたが
// ここでは interface を定義し利用する側で補完可能にしています
interface IRGB {
  red: number;
  green: number;
  blue: number;
}

function hsbToRgb(
  hueOriginal: number,
  satOriginal: number,
  briOriginal: number
): IRGB {
  // 値の正規化
  const hue = (hueOriginal % 360) + (hueOriginal < 0 ? 360 : 0);
  const sat = Math.min(Math.max(satOriginal, 0), 255);
  const bri = Math.min(Math.max(briOriginal, 0), 255);
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

var shikiso = 0;

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

      shikiso = ++shikiso % 360;
      const saido = Math.ceil((curYubiX / screenWidth) * 255); // 設定するだけなら小数値を含んでもよいが表示上の都合で整数値に切り上げ
      const meido = Math.ceil((curYubiY / screenHeight) * 255);
      const rgbCol = hsbToRgb(shikiso, saido, meido);

      const squareWidth = screenWidth / 2;
      const squareHeight = screenWidth / 2;

      ctx.clearRect(0, 0, screenWidth, screenHeight);
      ctx.fillStyle = `rgb(${rgbCol.red},${rgbCol.green},${rgbCol.blue})`;
      ctx.fillRect(
        squareWidth / 2,
        screenHeight / 2 - squareHeight / 2,
        squareWidth,
        squareHeight
      );
      ctx.fillStyle = "black";
      ctx.font = "36px serif";
      ctx.fillText(
        `色相: ${shikiso}/360`,
        squareWidth * 1.5 + 10,
        screenHeight / 2 + squareHeight / 2 - 105
      );
      ctx.fillText(
        `彩度: ${saido}/255`,
        squareWidth * 1.5 + 10,
        screenHeight / 2 + squareHeight / 2 - 55
      );
      ctx.fillText(
        `明度: ${meido}/255`,
        squareWidth * 1.5 + 10,
        screenHeight / 2 + squareHeight / 2 - 5
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
