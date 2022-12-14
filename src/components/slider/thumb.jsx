import Tooltip from "../tooltip/tooltip";
export default {
  props: {
    vertical: Boolean,
    disabled: Boolean,
    range: Boolean,
    reverse: Boolean,
    max: Number,
    min: Number,
    step: Number,
    value: [Number, Array],
    tipFormatter: [Function, Object],
    type: String,
    tooltipVisible: Boolean,
  },
  inject: {
    bar: { default: null },
  },
  data() {
    return {
      index: 1,
      showTip: false,
    };
  },
  methods: {
    mouseMove(e) {
      if (this.isMouseDown) {
        let { clientX, clientY } = e;
        // let r = e.target.getBoundingClientRect()
        // console.log(e)
        // let clientX = r.left + r.width / 2, clientY = r.top + r.height / 2
        // console.log(clientX, clientY, r)

        let { width, height, left, right, top, bottom } =
          this.bar.$refs.rail.getBoundingClientRect();
        let { value, range, step, max, min, vertical, reverse, type } = this,
          v = value;

        let percent = 0,
          diff = max - min;
        if (reverse) {
          percent = vertical
            ? (height - (clientY - top)) / height
            : (width - (clientX - left)) / width;
        } else {
          percent = vertical
            ? (clientY - top) / height
            : (clientX - left) / width;
        }
        if (percent >= 1) percent = 1;
        else if (percent <= 0) percent = 0;
        // this.defaultValue = value
        // console.log(percent)
        let x = range ? (type == "right" ? v[1] : v[0]) : v;

        // x = times(Math.round((percent * diff + min) / step), step)
        x = this.bar.getMinStep(percent * diff);

        if (x >= max) x = max;
        else if (x <= min) x = min;

        v = range ? (type == "right" ? [v[0], x] : [x, v[1]]) : x;
        // console.log(v)
        this.$emit("input", v);
      }
    },
    mouseUp(e) {
      this.isMouseDown = false;
      this.index = 1;
      if (this.tooltipVisible === true) {
        this.showTip = true;
      } else {
        this.showTip = false;
      }
      document.removeEventListener("mousemove", this.mouseMove);
      document.removeEventListener("mouseup", this.mouseUp);
    },
    onMouseDown(e) {
      if (this.disabled) return;
      this.isMouseDown = true;
      this.showTip = true;
      this.index = 2;
      // this.mouseMove(e)
      document.addEventListener("mousemove", this.mouseMove);
      document.addEventListener("mouseup", this.mouseUp);
    },
  },
  render() {
    let {
      vertical,
      value,
      index,
      disabled,
      max,
      min,
      tipFormatter,
      range,
      type,
      reverse,
      tooltipVisible,
    } = this;
    const props = {
      class: "u-slider-thumb",
      style: {
        // left: `${percent}%`,
        zIndex: index,
      },
      on: {
        mousedown: this.onMouseDown,
        mouseenter: () => {
          if (!disabled) this.showTip = true;
        },
        mouseleave: (e) => {
          if (this.tooltipVisible == true) {
            this.showTip = true;
            return;
          }
          if (!this.isMouseDown) {
            this.showTip = false;
          }
        },
      },
    };
    let percent,
      diff = max - min;
    if (type == "right") {
      percent = (((range ? value[1] : value) - min) / diff) * 100;
    } else {
      percent = ((value[0] - min) / diff) * 100;
    }
    let sty = {};
    if (vertical) {
      sty = reverse
        ? { bottom: `${percent}%`, transform: "translateY(50%)" }
        : { top: `${percent}%` };
    } else {
      sty = reverse
        ? { right: `${percent}%`, transform: "translateX(50%)" }
        : { left: `${percent}%` };
    }
    props.style = Object.assign(props.style, sty);

    if (tipFormatter === null || tooltipVisible === null)
      return <div {...props}></div>;

    let tip = "";
    if (type == "right") {
      tip = this.range ? value[1] : value;
    } else {
      tip = value[0];
    }
    tip = tip.toString();

    if (tipFormatter !== undefined) {
      tip = tipFormatter(tip);
    }
    const tipProps = {
      props: {
        title: tip,
        value: this.showTip,
        show: tooltipVisible,
        trigger: "nromal",
      },
      on: {
        input: (value) => (this.showTip = value),
      },
    };
    return (
      <Tooltip {...tipProps}>
        <div {...props}></div>
      </Tooltip>
    );
  },
};
