<template>
  <div id="app">
    <Menus refresh debug />
    <Panel>
      <Wrapper v-if="isDefault">
        <Anno>{{ version }}</Anno>
        <Divider />
        <Button label="Number.clamp" evalScript="test1()" @evalScript="msg" />
        <Button label="Object.entries" evalScript="test2()" />
        <Button label="RGBColor.fromHex" evalScript="test3()" />
        <Button label="get('layers').filter" evalScript="test4()" />
        <Button
          label="getLayerLabelColors"
          evalScript="test5()"
          @evalScript="(colors) => (labels = colors)"
        />
        <Color-Picker
          v-for="(color, i) in labels"
          :key="i"
          :label="`${color.name} == ${color.color}`"
          :value="color.color"
          read-only
        />
      </Wrapper>
      <Wrapper v-else>
        <Watcher
          v-model="testProp"
          property="app.selection.length"
          @update="checkUpdate"
          :interval="200"
        />
        <Anno>{{testProp}}</Anno>
        <Divider />

        <Swatch v-model="rgb" :model="activeModel" editable select-model />
        <Anno>{{ hex }}</Anno>
        <Divider />

        <Swatch v-model="rgb" model="rgb" editable />
        <Anno>{{ rgb }}</Anno>
        <Divider />

        <Swatch v-model="cmyk" model="cmyk" editable />
        <Anno>{{ cmyk }}</Anno>
        <Divider />

        <Button label="Randomize" @click="randomize" />
        <Button :label="`Model is ${activeModel}`" @click="scrollModel" />
      </Wrapper>
    </Panel>
  </div>
</template>

<script>
const fs = require("fs");
import spy from "cep-spy";
import { evalScript } from "brutalism";
export default {
  mounted() {
    this.version = this.getGehennaVersion();
  },
  components: {
    Swatch: require("@/components/Color-Picker").default,
    Watcher: require("@/components/Watcher").default,
  },
  data: () => ({
    version: "",
    isDefault: false,
    testProp: false,
    labels: [],
    hex: "#ff0000",
    activeModel: "rgb",
    rgb: {
      red: 0,
      green: 100,
      blue: 100,
    },
    cmyk: {
      cyan: 20,
      magenta: 20,
      yellow: 20,
      black: 20,
    },
  }),
  methods: {
    scrollModel() {
      let models = ["hex", "rgb", "cmyk"];
      let index = models.indexOf(this.activeModel);
      let next = index + 1 >= models.length ? 0 : index + 1;
      this.activeModel = models[next];
    },
    randomize() {
      this.randomizeHex();
      this.randomizeRGB();
      this.randomizeCMYK();
    },
    rollForHex() {
      let attempt = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      if (attempt.length !== 7) attempt = this.rollForHex();
      return attempt;
    },
    randomizeHex() {
      // this.hex = this.rollForHex();
      this.hex = `#${Math.floor(Math.random() * 2 ** 24)
        .toString(16)
        .padStart(0, 6)}`;
    },
    randomizeRGB() {
      this.rgb.red = this.randomIntFromInterval(0, 255);
      this.rgb.green = this.randomIntFromInterval(0, 255);
      this.rgb.blue = this.randomIntFromInterval(0, 255);
    },
    randomizeCMYK() {
      this.cmyk.cyan = this.randomIntFromInterval(0, 100);
      this.cmyk.magenta = this.randomIntFromInterval(0, 100);
      this.cmyk.yellow = this.randomIntFromInterval(0, 100);
      this.cmyk.black = this.randomIntFromInterval(0, 100);
    },
    randomIntFromInterval(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    msg(data) {
      console.log(data);
    },
    getGehennaVersion() {
      let root = `${spy.path.root}/node_modules/gehenna/package.json`;
      let data = fs.readFileSync(root, "utf-8");
      if (data) {
        return JSON.parse(data)._id;
      }
    },
    checkUpdate() {
      console.log("UPDATED");
    },
  },
};
</script>

<style></style>
