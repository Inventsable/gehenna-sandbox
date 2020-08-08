<template>
  <div :class="['color-picker-wrapper', { disabled, readOnly }]">
    <div @click="promptColorPicker" v-if="$slots.default">
      <slot />
    </div>
    <div class="color-picker-container" v-else>
      <!-- <Select
        flat
        v-if="selectModel"
        v-model="activeModel"
        :active="1"
        :items="['hex', 'rgb', 'cmyk']"
      /> -->
      <div class="color-picker-swatch" @click="promptColorPicker">
        <div
          class="color-picker-swatch-content"
          :style="{
            borderColor: this.active ? 'var(--color-selection)' : '#fff',
            background: this.styleString,
          }"
        />
      </div>
      <div v-if="!editable" :class="['color-picker-label']">
        {{ this.realModel.hex }}
      </div>
      <div
        v-else
        :class="['color-picker-input', activeModel, { filled, flat }]"
      >
        <div v-if="activeModel == 'hex'">
          <Input
            @input="updateValue"
            prefix="#"
            :max-length="6"
            :flat="flat"
            :filled="filled"
            uppercase
            placeholder="value"
            v-model="inputval"
            :style="{
              width: realInputWidth,
            }"
          />
        </div>
        <div v-else style="display: flex;">
          <Input-Scroll
            v-for="(key, i) in Object.keys(activeValue)"
            :key="i"
            style="width: 40px;"
            :prefix="key.charAt(0).toUpperCase()"
            v-model="activeValue[key]"
            :flat="flat"
            :filled="filled"
            :max="activeMax"
            :min="activeMin"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const RGB = require("color-space/rgb");
const CMYK = require("color-space/cmyk");
import { evalScript } from "brutalism";

export default {
  props: {
    readOnly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [Object, String],
      default: () => {
        return {
          red: 255,
          green: 0,
          blue: 0,
        };
      },
    },
    model: {
      type: String,
      default: "hex",
    },
    selectModel: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "Some color value",
    },
    editable: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "No value",
    },
    showValue: {
      type: Boolean,
      default: false,
    },
    prefsId: {
      type: String,
      default: "",
    },
    uppercase: {
      type: Boolean,
      default: false,
    },
    filled: {
      type: Boolean,
      default: false,
    },
    flat: {
      type: Boolean,
      default: false,
    },
    inputWidth: {
      type: String,
      default: "",
    },
  },
  data: () => ({
    active: false,
    activeModel: "rgb",
    type: "colorPicker",
    inputval: "",
    schema: [
      {
        apps: ["AEFT"],
        callback: "promptAEFT",
      },
      {
        apps: ["PHXS"],
        callback: "promptPHXS",
      },
      {
        apps: ["ILST"],
        callback: "promptILST",
      },
    ],
    realModel: {
      hex: "",
      cmyk: {
        cyan: 0,
        magenta: 0,
        yellow: 0,
        black: 0,
      },
      rgb: {
        red: 127,
        green: 127,
        blue: 127,
      },
      hsb: {
        hue: 127,
        saturation: 127,
        brightness: 127,
      },
      lab: {
        L: 127,
        A: 127,
        B: 127,
      },
    },
  }),
  computed: {
    activeMax() {
      return this.activeModel == "rgb" ? 255 : 100;
    },
    activeMin() {
      return this.activeModel == "lab" ? -128 : 0;
    },
    styleString() {
      return this.realModel.hex;
    },
    activeValue: {
      get() {
        return this.realModel[this.activeModel] || null;
      },
      set(val) {
        console.log("SETTING ACTIVE VAL");
        console.log(this.activeModel, val);
        if (/string/i.test(typeof val)) {
          this.realModel[this.activeModel] = val;
          this.inputval = val.replace(/^\#/, "");
        } else Object.assign(this.realModel[this.activeModel], val);
        this.$emit("input", val);
      },
    },
    realInputWidth() {
      if (this.inputWidth) return this.inputWidth;
      else if (this.flat) return "52px";
      else if (this.filled) return "54px";
      else return "52px";
    },
  },
  mounted() {
    this.activeModel = this.model;
    this.realModel[this.activeModel] = this.value;
    if (this.activeModel == "hex") this.inputval = this.value.replace("#", "");
    this.updateModelToKey();
  },
  watch: {
    model(val) {
      console.log("MODEL SHOULD SWITCH TO:", val);
      this.activeModel = val;
    },
    value: {
      handler(val) {
        this.realModel[this.activeModel] = val;
        this.updateModelToKey();
      },
      deep: true,
    },
    activeModel(val) {
      console.log("MODEL CHANGE TO", val);
    },
    activeValue: {
      handler(val) {
        console.log("VALUE CHANGE:", val);
      },
      deep: true,
    },
  },
  methods: {
    updateValue(value) {
      if (this.activeModel == "hex") {
        let temp = `#${value}`;
        if (this.validateAsHexString(`${value}`)) this.activeValue = temp;
      } else {
        console.log("Caughtcha");
      }
    },
    async promptILST() {
      let inputColor =
        this.activeModel == "cmyk"
          ? `var temp = new CMYKColor().create(${Object.keys(
              this.realModel.cmyk
            ).map((col) => this.realModel.cmyk[col])})`
          : `var temp = new RGBColor().create(${Object.keys(
              this.realModel.rgb
            ).map((col) => this.realModel.rgb[col])})`;
      let code = `(function() {
        ${inputColor}
        var result = app.showColorPicker(temp);
        if (result !== temp) {
          return JSON.stringify(result)
        } else return false;
      }())`;
      let value = await evalScript(code);
      if (value) {
        let hostValue = {};
        Object.entries(value)
          .filter((val) => {
            return !/typename/.test(val[0]);
          })
          .map((val) =>
            val.map((v) => (/number/i.test(typeof v) ? Math.round(v) : v))
          )
          .forEach((val) => {
            let k = val[0],
              v = val[1];
            hostValue[k] = v;
          });
        if (this.activeModel == "hex") hostValue = this.toHex(hostValue);
        this.activeValue = hostValue;
      }
      return null;
    },
    async promptColorPicker() {
      return await this.promptILST();
    },
    validateAsHexString(value) {
      return (
        value.length < 7 && /^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)
      );
    },
    updateModelToKey(key) {
      if (!key || arguments < 1) key = this.activeModel;
      console.log("UPDATING VIA", key);
      if (key == "hex") {
        this.realModel.rgb = this.fromHex(this.realModel.hex);
        this.realModel.cmyk = this.toCMYK(this.realModel.rgb);
      } else if (key == "rgb") {
        this.realModel.hex = this.toHex(this.realModel.rgb);
        this.realModel.cmyk = this.toCMYK(this.realModel.rgb);
      } else if (key == "cmyk") {
        this.realModel.rgb = this.toRGB(this.realModel.cmyk);
        this.realModel.hex = this.toHex(this.realModel.rgb);
      }
    },
    /**
     * Conversion from RGB to Hex
     *
     * @param {String} rgb
     */
    toHex(rgb) {
      // console.log("TO rgb:", rgb);
      return (
        "#" +
        ((1 << 24) + (rgb.red << 16) + (rgb.green << 8) + rgb.blue)
          .toString(16)
          .slice(1)
      );
    },
    /**
     * Conversion from Hex to RGB
     *
     * @param {String} hex Hexadecimal string to convert
     * @returns {Object} RGB format
     */
    fromHex(hex) {
      if (hex.length == 4) {
        let prefix = hex.match(/#.{2}/)[0].replace("#", "");
        let suffix = hex.match(/.$/)[0];
        hex = `#${prefix}${prefix}${suffix}${suffix}`;
        console.log(hex);
      }

      try {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return {
          red: parseInt(result[1], 16),
          green: parseInt(result[2], 16),
          blue: parseInt(result[3], 16),
        };
      } catch (err) {
        console.error(hex, this.activeModel);
        console.error(err);
      }
    },
    toCMYK(rgb) {
      let result = RGB.cmyk([rgb.red, rgb.blue, rgb.green]).map((arg) => {
        return +("" + arg.toFixed(2));
      });
      return {
        cyan: result[0],
        magenta: result[1],
        yellow: result[2],
        black: result[3],
      };
    },
    toRGB(cmyk) {
      let result = CMYK.rgb([cmyk.cyan, cmyk.magenta, cmyk.yellow, cmyk.black]);
      return {
        red: Math.round(result[0]),
        green: Math.round(result[1]),
        blue: Math.round(result[2]),
      };
    },
  },
};
</script>

<style>
:root {
  --col: #fff;
}

.color-picker-wrapper .brutalism-select-wrapper {
  width: 70px;
}
</style>
