export default {
  name: "TimeLine",
  props: {
    mode: {
      type: String,
      default: "left",
      validator: (val) => {
        return ["left", "right", "center", "alternate"].indexOf(val) > -1;
      },
    },
  },
  render() {
    const classes = ["u-timeline", `u-timeline-${this.mode}`];
    return <ul class={classes}>{this.$slots.default}</ul>;
  },
};
