<template>
  <div>
    <p>Chapter 8 8-4 指との距離で回転方向を変える</p>
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
/* http://localhost:3000/chapter08/4 */
import { defineComponent } from "vue";
import designingmath from "@/components/designingmath.vue";

class Maru {
  public muki: number = 1;
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

  // 指の位置を中心に変換し続けたいだったため immutable でなく変換して更新する関数にした
  rotate(curYubiX: number, curYubiY: number, kaitenOrig: number): void {
    const kyoriPar = Math.floor(this.kyori(curYubiX, curYubiY) / 250);
    this.muki = ((kyoriPar % 2) - 0.5) * 2;
    const kaiten = kaitenOrig * this.muki; // 回転角度に 向きを適用

    // 指の位置を中心にするために並行移動
    const xx1 = this.x - curYubiX;
    const yy1 = this.y - curYubiY;
    // 一次変換で回転
    const xx2 = xx1 * Math.cos(kaiten) - yy1 * Math.sin(kaiten);
    const yy2 = xx1 * Math.sin(kaiten) + yy1 * Math.cos(kaiten);
    // 原点を戻して値を代入
    this.x = xx2 + curYubiX;
    this.y = yy2 + curYubiY;
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
      ctx.clearRect(0, 0, screenWidth, screenHeight);
      maruArrArr.forEach((maruY) =>
        maruY.forEach((maru) => {
          if (yubiTouched) {
            maru.rotate(curYubiX, curYubiY, Math.PI / 36);
          }
          const hankei = unitKyori / 4; // 半径は ● の距離の 1/4
          ctx.fillStyle = maru.muki > 0 ? "black" : "red"; // 回転方向による色分け
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(maru.x, maru.y, hankei, 0, Math.PI * 2, true);
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
