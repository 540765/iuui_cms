import Button from "../button/button";
import Icon from "../icon/icon";
import { t } from "@/lang/config";
import transfer from "../utils/transfer";
import { measureScrollBar } from "../utils/utils";
let cacheBodyOverflow = {};
// import
export default {
  name: "Drawer",
  directives: { transfer },
  props: {
    value: Boolean,
    title: { default: "Title", type: String },
    width: { default: 520, type: [Number, String] },
    height: { default: 256, type: [Number, String] },
    okText: String,
    cancelText: String,
    placement: { type: String, default: "right" },
    closable: { type: Boolean, default: true },
    footer: { type: Boolean, default: true },
    maskClosable: { type: Boolean, default: true },
    target: { type: Function, default: () => document.body },
    mask: { type: Boolean, default: true },
  },
  watch: {
    value(v) {
      this.rendered = true;
      this.$nextTick((e) => {
        this.visible = v;
        this.openHandle();
        this.resetBodyStyle(v);
      });
    },
  },
  data() {
    return {
      visible: this.value,
      rendered: this.value,
      open: this.value,
    };
  },
  beforeDestroy() {
    this.resetBodyStyle(false);
  },
  methods: {
    ok() {
      this.$emit("ok");
    },
    onKeyUp(e) {
      if (this.visible) {
        if (e.keyCode == 27) this.close();
      }
    },
    cancel() {
      this.$emit("cancel");
      this.close();
    },
    openHandle() {
      if (this.visible) {
        this.open = true;
      } else {
        setTimeout(() => {
          this.open = false;
        }, 300);
      }
    },
    close() {
      this.visible = false;
      this.$emit("input", false);
      this.$emit("cancel");
      this.$emit("close");
      this.openHandle();
    },
    maskToClose() {
      if (this.maskClosable) {
        this.close();
      }
    },
    resetBodyStyle(opened) {
      let target = this.target();
      if (opened && !cacheBodyOverflow.hasOwnProperty("overflow")) {
        cacheBodyOverflow = {
          width: target.style.width,
          overflow: target.style.overflow,
          overflowX: target.style.overflowX,
          overflowY: target.style.overflowY,
        };
      }
      if (opened) {
        let barWidth = measureScrollBar(true);
        let el = target == document.body ? document.documentElement : target;
        let hasBar =
          el.scrollHeight > el.clientHeight ||
          el.offsetHeight > el.clientHeight;
        if (barWidth && hasBar) {
          target.style.width = `calc(100% - ${barWidth}px)`;
          target.style.overflow = `hidden`;
        }
      } else {
        setTimeout(() => {
          Object.keys(cacheBodyOverflow).forEach((key) => {
            target.style[key] = cacheBodyOverflow[key] || "";
            delete cacheBodyOverflow[key];
          });
        }, 300);
      }
    },
  },
  render() {
    if (this.$isServer) return null;
    const {
      title,
      visible,
      cancelText,
      okText,
      ok,
      placement,
      cancel,
      $slots,
      width,
      height,
      open,
      closable,
      close,
    } = this;
    const hasFooter = this.footer || $slots.footer;
    const canelBtn = (
      <Button onClick={cancel}>{cancelText || t("drawer.cancel")}</Button>
    );
    const okBtn = (
      <Button type="primary" onClick={ok}>
        {okText || t("drawer.ok")}
      </Button>
    );
    const footNode = hasFooter ? (
      <div class="u-drawer-footer">
        {$slots.footer}
        {!$slots.footer && [canelBtn, okBtn]}
      </div>
    ) : null;
    const closeNode = closable ? (
      <span class="u-drawer-close" onClick={close}>
        <Icon type="close" />
      </span>
    ) : null;
    const transitionName = `u-drawer-${placement}`;
    const target = this.target();
    const inbody = target == document.body;
    const classes = [
      "u-drawer",
      `u-drawer-${placement}`,
      { "u-drawer-open": open },
      { "u-drawer-has-footer": hasFooter },
      { "u-drawer-nobody": !inbody },
      { "u-drawer-nomask": !this.mask },
    ];
    let styles = {};
    if (placement == "left" || placement == "right")
      styles.width = /%/.test(width) ? width : width + "px";
    if (placement == "top" || placement == "bottom")
      styles.height = /%/.test(height) ? height : height + "px";
    // const wrapCls =
    let maskNode = null;
    if (this.mask) {
      maskNode = (
        <transition name="u-drawer-fade">
          <div
            class={["u-drawer-mask", { "u-drawer-masu-nobody": !inbody }]}
            v-show={visible}
            onClick={this.maskToClose}
          ></div>
        </transition>
      );
    }
    return this.rendered ? (
      <div class={classes} v-transfer={target}>
        {maskNode}
        <transition name={transitionName} time={3500000}>
          <div class="u-drawer-box" v-show={visible} style={styles}>
            <div class="u-drawer-content">
              {closeNode}
              {title !== null && title !== false && (
                <div class="u-drawer-header">
                  <div class="u-drawer-header-inner">{title}</div>
                </div>
              )}
              <div class="u-drawer-body">{$slots.default}</div>
              {footNode}
            </div>
          </div>
        </transition>
      </div>
    ) : (
      ""
    );
  },
};
