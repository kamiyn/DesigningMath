<template>
  <div>
    <p>Chapter 7 7-3 方向を考慮する</p>
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
/* http://localhost:3000/chapter07/3 */
import { defineComponent } from "vue";
import designingmath from "@/components/designingmath.vue";

class Maru {
  constructor(public x: number, public y: number) {}

  // 本では事前計算を保持する変数として宣言しているが必要な時に値を計算する関数として実装している
  public kyori(curYubiX: number, curYubiY: number): number {
    return Math.sqrt(
      Math.pow(curYubiX - this.x, 2) + Math.pow(curYubiY - this.y, 2)
    );
  }

  public kakudo(curYubiX: number, curYubiY: number): number {
    return Math.atan2(curYubiY - this.y, curYubiX - this.x);
  }
}

const offsetX = 0;
const offsetY = 0;
var unitKyori = 0;
var maruArrArr: Maru[][] = [];

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
      const unitYokoKazu = 20;
      const yokoInterval = screenWidth / (unitYokoKazu - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu = Math.ceil(screenHeight / tateInterval);
      unitKyori = yokoInterval;

      maruArrArr = [...Array(unitTateKazu).keys()].map((tateNum) =>
        [...Array(unitYokoKazu).keys()].map((yokoNum) => {
          const x =
            yokoInterval * yokoNum +
            offsetX +
            (tateNum % 2 === 1 ? yokoInterval / 2 : 0);
          const y = tateInterval * tateNum + offsetY;
          return new Maru(x, y);
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
      const screenSize = Math.min(screenWidth, screenHeight); // 比率計算用の画面サイズ
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      maruArrArr.forEach((maruY) =>
        maruY.forEach((maru) => {
          const parR = Math.max(
            1 - maru.kyori(curYubiX, curYubiY) / screenSize,
            0
          ); // 0以上にする
          const hankei = (unitKyori / 2) * parR;
          // 角度の描画
          const grayValue = parR * 255;
          ctx.fillStyle = `rgb(${grayValue},${grayValue},${grayValue})`;
          ctx.strokeStyle = "black";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(
            maru.x,
            maru.y,
            hankei,
            maru.kakudo(curYubiX, curYubiY) - Math.PI / 2,
            maru.kakudo(curYubiX, curYubiY) + Math.PI / 2,
            true
          );
          ctx.fill();

          ctx.strokeStyle = "black";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(maru.x, maru.y, hankei, 0, Math.PI * 2, true);
          ctx.stroke();
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
