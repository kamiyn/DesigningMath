<template>
  <canvas
    class="canvasElement"
    ref="canvasElement"
    width="1280"
    height="1600"
    @touchstart="doTouchstart"
    @touchmove="doTouchmove"
    @touchend="doTouchend"
    @mousedown="doMousedown"
    @mousemove="doMousemove"
    @mouseup="doMouseup"
  ></canvas>
</template>

<style scoped>
.canvasElement {
  position: relative;
  width: 100%;
  height: auto;
  max-width: 640px;
}
</style>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref, PropType } from "vue";

export type DataType = {
  canvasElement: Ref<HTMLCanvasElement>;
  curYubiX: number;
  curYubiY: number;
  yubiTouched: boolean;
  timerId: number;
};

var timerId: number;

export interface DesigningMathCallbackFunction {
  (
    ctx: CanvasRenderingContext2D,
    screenWidth: number,
    screenHeight: number,
    curYubiX: number,
    curYubiY: number,
    yubiTouched: boolean
  ): void;
}

export default defineComponent({
  name: "designingmath",
  props: {
    setupFunc: {
      type: Function as PropType<DesigningMathCallbackFunction>,
      required: true,
    },
    loopFunc: {
      type: Function as PropType<DesigningMathCallbackFunction>,
      required: true,
    },
    touchstartFunc: {
      type: Function as PropType<DesigningMathCallbackFunction>,
      required: true,
    },
    touchMoveFunc: {
      type: Function as PropType<DesigningMathCallbackFunction>,
      required: true,
    },
    touchEndFunc: {
      type: Function as PropType<DesigningMathCallbackFunction>,
      required: true,
    },
  },
  methods: {
    screenWidth(): number {
      return this.canvasElement.width;
    },
    screenHeight(): number {
      return this.canvasElement.height;
    },
    getCtx(): CanvasRenderingContext2D {
      return this.canvasElement.getContext("2d");
    },
    updateTouchPosition(evt) {
      var rect = this.canvasElement.getBoundingClientRect();
      var bai = this.screenWidth() / rect.width;
      this.curYubiX =
        (evt.changedTouches[0].pageX - (rect.left + window.pageXOffset)) * bai;
      this.curYubiY =
        (evt.changedTouches[0].pageY - (rect.top + window.pageYOffset)) * bai;
    },
    doTouchstart(evt) {
      this.updateTouchPosition(evt);
      this.yubiTouched = true;
      if (this.touchStartFunc) {
        this.touchStartFunc(
          this.getCtx(),
          this.screenWidth(),
          this.screenHeight(),
          this.curYubiX,
          this.curYubiY,
          this.yubiTouched
        );
      }
    },
    doTouchmove(evt) {
      this.updateTouchPosition(evt);
      if (this.touchMoveFunc) {
        this.touchMoveFunc(
          this.getCtx(),
          this.screenWidth(),
          this.screenHeight(),
          this.curYubiX,
          this.curYubiY,
          this.yubiTouched
        );
      }
    },
    doTouchend(evt) {
      this.updateTouchPosition(evt);
      this.yubiTouched = false;
      if (this.touchEndFunc) {
        this.touchEndFunc(
          this.getCtx(),
          this.screenWidth(),
          this.screenHeight(),
          this.curYubiX,
          this.curYubiY,
          this.yubiTouched
        );
      }
    },
    updateMousePosition(evt) {
      var rect = this.canvasElement.getBoundingClientRect();
      var bai = this.screenWidth() / rect.width;
      this.curYubiX = (evt.clientX - rect.left) * bai;
      this.curYubiY = (evt.clientY - rect.top) * bai;
    },
    doMousedown(evt) {
      this.updateMousePosition(evt);
      this.yubiTouched = true;
      if (this.touchStartFunc) {
        this.touchStartFunc(
          this.getCtx(),
          this.screenWidth(),
          this.screenHeight(),
          this.curYubiX,
          this.curYubiY,
          this.yubiTouched
        );
      }
    },
    doMousemove(evt) {
      this.updateMousePosition(evt);
      if (this.touchMoveFunc) {
        this.touchMoveFunc(
          this.getCtx(),
          this.screenWidth(),
          this.screenHeight(),
          this.curYubiX,
          this.curYubiY,
          this.yubiTouched
        );
      }
    },
    doMouseup(evt) {
      this.updateMousePosition(evt);
      this.yubiTouched = false;
      if (this.touchEndFunc) {
        this.touchEndFunc(
          this.getCtx(),
          this.screenWidth(),
          this.screenHeight(),
          this.curYubiX,
          this.curYubiY,
          this.yubiTouched
        );
      }
    },
  },
  computed: {},
  mounted(): void {
    console.log(this.canvasElement);
    this.curYubiX = this.screenWidth() / 2;
    this.curYubiY = this.screenHeight() / 2;
    if (this.setupFunc) {
      this.setupFunc(
        this.getCtx(),
        this.screenWidth(),
        this.screenHeight(),
        this.curYubiX,
        this.curYubiY,
        this.yubiTouched
      );
    }
    if (this.loopFunc) {
      this.timerId = setInterval(() => {
        this.loopFunc(
          this.getCtx(),
          this.screenWidth(),
          this.screenHeight(),
          this.curYubiX,
          this.curYubiY,
          this.yubiTouched
        );
      }, 33);
    }
  },
  setup(): DataType {
    const canvasElement = <Ref<HTMLCanvasElement | null>>ref(null);
    // DOM 要素は初回レンダリングの後に ref に代入されます
    // mounted() の時点では Ref 解除される
    return {
      canvasElement,
      curYubiX: undefined,
      curYubiY: undefined,
      yubiTouched: false,
      timerId: timerId,
    };
  },
});
</script>
