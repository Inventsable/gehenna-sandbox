<template>
  <div id="app">
    <Menus refresh debug />
    <Panel>
      <Wrapper>
        <Anno>{{version}}</Anno>
        <Divider />
        <Button label="Number.clamp" evalScript="test1()" @evalScript="msg" />
        <Button label="Object.entries" evalScript="test2()" />
        <Button label="RGBColor.fromHex" evalScript="test3()" />
        <Button label="get('layers').filter" evalScript="test4()" />
      </Wrapper>
    </Panel>
  </div>
</template>

<script>
const fs = require("fs");
import spy from "cep-spy";
export default {
  mounted() {
    this.version = this.getGehennaVersion();
  },
  data: () => ({
    version: "",
  }),
  methods: {
    msg(data) {
      if (data && data !== "undefined") console.log(data);
    },
    getGehennaVersion() {
      let root = `${spy.path.root}/node_modules/gehenna/package.json`;
      let data = fs.readFileSync(root, "utf-8");
      if (data) {
        return JSON.parse(data)._id;
      }
    },
  },
};
</script>

<style></style>
