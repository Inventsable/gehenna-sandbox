## This is a sandbox testing panel to verify a separate npm package

Gehenna is now an internal dependency of the brutalism library. This is to let us store shared scripting shims and utilities in a more convenient place instead of needing them to be local files within bombino templates.

[See the package repo for details about use](https://github.com/battleaxedotco/gehenna)

The below is functional scripting code in Adobe (in .ts, compiled to .jsx on save):

```js
function clampTest() {
  let min = 1;
  let max = 6;
  for (let value = 0; value <= 8; value++) alert(value.clamp(min, max));
  // Reports 1, 1, 2, 3, 4, 5, 6, 6, 6
}

function objectEntries() {
  let testObject = {
    msg: "Hello",
    data: "World",
    foo: "bar",
    num: 12,
  };

  for (const [key, value] of Object.entries(testObject))
    alert(key + " == " + value);
  // Reports:
  //    msg == Hello
  //    data == World
  // etc.
}

function interruptedFind() {
  // If this layer does not exist, the alert is never called.
  // The script fails and reports Error 1302: No such element
  let target = app.activeDocument.layers.getByName("jacob");
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
function forInObject(testObject) {
  for (var i in testObject) alert(i + " == " + testObject[i]);
}

// Correct
function ObjectKeys(testObject) {
  Object.keys(testObject).forEach((key) => {
    alert(key);
  });
}
```

The .jsx equivalent:

```js
function clampTest() {
  var min = 1;
  var max = 6;
  for (var value = 0; value <= 8; value++) alert(value.clamp(min, max));
  // Reports 1, 1, 2, 3, 4, 5, 6, 6, 6
}
function objectEntries() {
  var testObject = {
    msg: "Hello",
    data: "World",
    foo: "bar",
    num: 12,
  };
  for (var _i = 0, _a = Object.entries(testObject); _i < _a.length; _i++) {
    var _b = _a[_i],
      key = _b[0],
      value = _b[1];
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
  var target = app.activeDocument.layers.getByName("jacob");
  alert(target);
  //
  // See method below for a better solution via gehenna
}
function nonInterruptedFind() {
  // This works just like Layer.getByName, but is class agnostic.
  // It can work on anything iterable and is a standard Array.find() ES6 method:
  var target = get("layers").find(function(layer) {
    return layer.name == "test";
  });
  alert(target);
  alert("Doesn't fail! Works even when layer is not found");
}
// Say we want to find specific layers matching a certain condition, then act on each:
function filterThenIterateLayers() {
  get("layers")
    .filter(function(layer) {
      // Filter out any non-generically named layer:
      return /^Layer\s\d{1,}$/.test(layer.name);
    })
    .forEach(function(layer) {
      // Now act on resulting layers
      alert(layer.name);
      // Reports "Layer 1", "Layer 5", "Layer 6", etc.
    });
}
// Correct. Does not display Prototype[method]
function forInObject(testObject) {
  for (var i in testObject) alert(i + " == " + testObject[i]);
}
// Correct
function ObjectKeys(testObject) {
  Object.keys(testObject).forEach(function(key) {
    alert(key);
  });
}
```
