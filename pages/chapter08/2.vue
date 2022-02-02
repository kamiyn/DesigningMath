<template>
  <div>
    <p>Chapter 8 8-2 ●全体を回転する</p>
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
/* http://localhost:3000/chapter08/2 */
import { defineComponent } from "vue";
import designingmath from "@/components/designingmath.vue";

class Maru {
  constructor(public x: number, public y: number) {}

  // 本ではオブジェクトを使いまわして足し算し続けている
  // immutable オブジェクトとして実装している
  rotatedMaru(kaiten: number): Maru {
    return new Maru(
      this.x * Math.cos(kaiten) - this.y * Math.sin(kaiten),
      this.x * Math.sin(kaiten) + this.y * Math.cos(kaiten)
    );
  }
}

const offsetX = 0;
const offsetY = 0;
var unitKyori = 0;
var maruArrArr: Maru[][] = [];
var kaiten = 0; // タッチすることにより回転している角度を表す

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
      const unitYokoKazu = 10;
      const yokoInterval = screenWidth / (unitYokoKazu - 1);
      const tateInterval = yokoInterval * Math.sin(Math.PI / 3);
      const unitTateKazu = Math.ceil(screenHeight / tateInterval) + 1;
      unitKyori = yokoInterval;

      maruArrArr = [...Array(unitTateKazu).keys()].map((tateNum) =>
        [...Array(unitYokoKazu).keys()].map((yokoNum) => {
          const x =
            yokoInterval * yokoNum +
            offsetX -
            (tateNum % 2 === 0 ? yokoInterval / 2 : 0); // ここの位置は前章と違う
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
      if (yubiTouched) {
        kaiten += Math.PI / 36; // 5度回転させる
        console.log(kaiten);
      }
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      maruArrArr.forEach((maruY) =>
        maruY.forEach((maru) => {
          const rotated = maru.rotatedMaru(kaiten);
          const hankei = unitKyori / 4; // 半径は ● の距離の 1/4
          ctx.fillStyle = "black";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(rotated.x, rotated.y, hankei, 0, Math.PI * 2, true);
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
