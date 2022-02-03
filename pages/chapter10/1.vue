<template>
  <div>
    <p>Chapter 10 10-1 投影変換</p>
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
/* http://localhost:3000/chapter10/1 */
import { defineComponent } from "vue";
import designingmath from "@/components/designingmath.vue";

class Choten {
  constructor(public x: number, public y: number, public z: number) {}

  // 本では直接 + 3000 している部分を引数にしている
  gxyz(gc: number): Choten {
    return new Choten(this.x, this.y, this.z + gc);
  }

  // 本では先に sc = 2000 としている部分を引数にしている
  tx(gc: number, sc: number): number {
    const g = this.gxyz(gc);
    return (sc * g.x) / g.z;
  }

  ty(gc: number, sc: number): number {
    const g = this.gxyz(gc);
    return (sc * g.y) / g.z;
  }
}

const henLength = 400;
var choten: Choten[] = [
  new Choten(henLength, henLength, henLength),
  new Choten(henLength, henLength, -henLength),
  new Choten(-henLength, henLength, -henLength),
  new Choten(-henLength, henLength, henLength),
  new Choten(henLength, -henLength, henLength),
  new Choten(henLength, -henLength, -henLength),
  new Choten(-henLength, -henLength, -henLength),
  new Choten(-henLength, -henLength, henLength),
];

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
      const gc = 3000; // 物体までの距離 (スクリーンの向こう側)
      const sc = 2000; // スクリーンまでの距離

      ctx.clearRect(0, 0, screenWidth, screenHeight);

      ctx.save();
      ctx.translate(screenWidth / 2, screenHeight / 2); // 原点を画面キャンバス中央に移動

      ctx.lineWidth = 2;
      ctx.lineJoin = "round";

      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.moveTo(choten[0].tx(gc, sc), choten[0].ty(gc, sc));
      ctx.lineTo(choten[1].tx(gc, sc), choten[1].ty(gc, sc));
      ctx.lineTo(choten[2].tx(gc, sc), choten[2].ty(gc, sc));
      ctx.lineTo(choten[3].tx(gc, sc), choten[3].ty(gc, sc));
      ctx.lineTo(choten[0].tx(gc, sc), choten[0].ty(gc, sc));
      ctx.lineTo(choten[4].tx(gc, sc), choten[4].ty(gc, sc));
      ctx.lineTo(choten[5].tx(gc, sc), choten[5].ty(gc, sc));
      ctx.lineTo(choten[6].tx(gc, sc), choten[6].ty(gc, sc));
      ctx.lineTo(choten[7].tx(gc, sc), choten[7].ty(gc, sc));
      ctx.lineTo(choten[4].tx(gc, sc), choten[4].ty(gc, sc));
      ctx.moveTo(choten[1].tx(gc, sc), choten[1].ty(gc, sc));
      ctx.lineTo(choten[5].tx(gc, sc), choten[5].ty(gc, sc));
      ctx.moveTo(choten[2].tx(gc, sc), choten[2].ty(gc, sc));
      ctx.lineTo(choten[6].tx(gc, sc), choten[6].ty(gc, sc));
      ctx.moveTo(choten[3].tx(gc, sc), choten[3].ty(gc, sc));
      ctx.lineTo(choten[7].tx(gc, sc), choten[7].ty(gc, sc));
      ctx.stroke();

      ctx.restore();
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
