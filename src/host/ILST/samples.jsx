function clampTest() {
  // Reports 1, 1, 2, 3, 4, 5, 6, 6, 6
  let min = 1;
  let max = 6;
  for (let value = 0; value <= 8; value++) {
    alert(value + " ?== " + value.clamp(min, max));
  }
}

function objectEntries() {
  let testObject = {
    msg: "Hello",
    data: "World",
    foo: "bar",
    num: 12,
  };

  for (const [key, value] of Object.entries(testObject)) {
    alert(key + " == " + value);
  }
  // Reports:
  //    msg == Hello
  //    data == World
  // etc.
}

function interruptedFind() {
  // If this layer does not exist, the alert is never called.
  // The script fails and reports Error 1302: No such element
  let target = app.activeDocument.layers.getByName("jonny");
  alert(target);
  //
  // See method below for a better solution via gehenna
}

function nonInterruptedFind() {
  // This works just like Layer.getByName, but is class agnostic.
  // It can work on anything iterable and is a standard Array.find() ES6 method:
  let target = get("layers").find((layer) => layer.name == "test");
  alert(target);
  alert("Doesn't fail! Works even when layer is not found");
}

// Say we want to find specific layers matching a certain condition, then act on each:
function filterThenIterateLayers() {
  get("layers")
    .filter((layer) => {
      // Filter out any non-generically named layer:
      return /^Layer\s\d{1,}$/.test(layer.name);
    })
    .forEach((layer) => {
      // Now act on resulting layers
      alert(layer.name);
      // Reports "Layer 1", "Layer 5", "Layer 6", etc.
    });
}

// Correct. Does not display Prototype[method]
function forInObject() {
  for (var i in testObject) alert(i + " == " + testObject[i]);
}

// Correct
function ObjectKeys() {
  Object.keys(testObject).forEach((key) => {
    alert(key);
  });
}
