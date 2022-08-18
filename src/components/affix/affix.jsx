import resize from "../utils/resize";
export default {
  name: "Affix",
  directives: { resize },
  props: {
    offsetTop: { type: Number, default: 0 },
    offsetBottom: { type: Number, default: -1 },
    target: {
      type: Function,
      default: () => {
        return window;
      },
    },
  },
  data() {
    return {
      fixed: false,
      with: 0,
      height: 0,
      offsetTopValue: 0,
    };
  },
  beforeDestory() {
    if (this.target() == window) {
      target.removeEventListener("scroll", this.updatePosition);
    }
  },
  mounted() {
    let target = this.target();
    if (Object.prototype.toString.apply(target) != "[object HTMLDivElement]") {
      console.log("错误");
    }
    if (target && !this.$isServer) {
      target.addEventListener("scroll", this.updatePosition);
    }
  },
  methods: {
    updatePosition(e) {
      let { offsetBottom, offsetTop, $refs } = this;
      let target = this.target();
      if (
        Object.prototype.toString.apply(target) != "[object HTMLDivElement]"
      ) {
        console.log(target.getBoundingClientRect());
      }
      if (!$refs.blob || !target) return;

      let rect = $refs.blob.getBoundingClientRect();
      let container =
        target != window && target != document
          ? target.getBoundingClientRect()
          : { top: 0, bottom: document.documentElement.clientHeight };
      let hasbottom = typeof offsetBottom == "number" && offsetBottom >= 0;
      let fx = hasbottom
        ? container.bottom - rect.bottom >= offsetBottom
        : rect.top - container.top <= offsetTop;
      if (!fx) {
        this.offsetTopValue = rect.top;
        if (target == window || target == document) {
          if (this.offsetTopValue > offsetTop && !hasbottom) {
            this.offsetTopValue = offsetTop;
          }
          if (hasbottom && container.bottom - rect.bottom < offsetBottom) {
            this.offsetTopValue = container.bottom - offsetBottom - rect.height;
          }
        } else {
          // 
        }
      }
      if (this.offsetTopValue == 0) {
        this.offsetTopValue = rect.top;
      }
      if (this.fixed != fx) {
        this.fixed = fx;
        this.width = rect.width;
        this.height = rect.height;
        this.$emit("change", this.fixed);
      }
    },
  },
  render() {
    let blobStyle = null,
      fixedStyle = null,
      classes = null;
    if (this.fixed) {
      blobStyle = {
        width: `${this.width}px`,
        height: `${this.height}px`,
      };
      fixedStyle = {
        width: `${this.width}px`,
        height: `${this.height}px`,
        top: `${this.offsetTopValue}px`,
      };
      classes = { ["u-affix"]: this.fixed };
    }
    return (
      <div style={blobStyle} ref="blob" v-resize={this.updatePosition}>
        <div style={fixedStyle} class={classes}>
          {this.$slots.default}
        </div>
      </div>
    );
  },
};
