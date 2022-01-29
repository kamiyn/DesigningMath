<template>
  <div>
    <p>0.vue 関数テンプレート</p>
    <designingmath
      :setupFunc="setupFunc"
      :loopFunc="loopFunc"
      :touchstartFunc="touchStartFunc"
      :touchEndFunc="touchEndFunc"
      :touchMoveFunc="touchMoveFunc"
    />
  </div>
</template>

<script lang="ts">
/* http://localhost:3000/chapter01/0 */
import { defineComponent } from "vue";
import designingmath from "@/components/designingmath.vue";

export default defineComponent({
  components: {
    designingmath,
  },
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
    },
    touchstartFunc(
      ctx: CanvasRenderingContext2D,
      screenWidth: number,
      screenHeight: number,
      curYubiX: number,
      curYubiY: number,
      yubiTouched: boolean
    ) {
      console.log("touchstartFunc");
    },
    touchMoveFunc(
      ctx: CanvasRenderingContext2D,
      screenWidth: number,
      screenHeight: number,
      curYubiX: number,
      curYubiY: number,
      yubiTouched: boolean
    ) {
      console.log("touchMoveFunc");
    },
    touchEndFunc(
      ctx: CanvasRenderingContext2D,
      screenWidth: number,
      screenHeight: number,
      curYubiX: number,
      curYubiY: number,
      yubiTouched: boolean
    ) {
      console.log("touchEndFunc");
    },
  },
});
</script>
