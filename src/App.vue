<template>
  <div id="app">
    <Menus refresh debug />
    <Panel>
      <Wrapper>
        <Button-Group>
          <Button block goto="https://github.com/Inventsable/brutalism/issues/new">Report a bug</Button>
        </Button-Group>
      </Wrapper>
    </Panel>
  </div>
</template>

<script>
import { evalScript } from "brutalism";
export default {
  components: {
    "battleaxe-logo": require("./components/battleaxeLogo.vue").default,
    "brutalism-title": require("./components/brutalismTitle.vue").default,
  },
  async mounted() {},
  methods: {
    testClick(item) {
      console.log("Context menu click:", item);
    },
    checkMenu(item, index, val) {
      console.log(item, index, val);
    },
    // Can invoke any function as await evalScript(`functionName('${parameterVar}')`) if script is preloaded
    // Check out the "script-path" prop of <Panel> component above for easy script file load.
    async runTestScript() {
      let result = await evalScript(`
        function test() {
          alert('Hello world!')
          return 'result from JSX file'
        }
        test();
      `);
      console.log(result);
    },
  },
};
</script>

<style></style>
