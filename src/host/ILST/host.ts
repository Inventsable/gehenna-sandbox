console.log("Host is online");

function getLayerByProperty(property, value) {
  Array.prototype.find = function(callback) {
    for (var i = 0; i < this.length; i++)
      if (callback(this[i], i, this)) return this[i];
    return null;
  };
  function get(type, parent) {
    if (arguments.length == 1 || !parent) parent = app.activeDocument;
    var result = [];
    if (!parent[type]) return [];
    for (var i = 0; i < parent[type].length; i++) {
      result.push(parent[type][i]);
      if (parent[type][i][type])
        result = [].concat(result, get(type, parent[type][i]));
    }
    return result || [];
  }
  return get("layers").find(function(layer) {
    return layer[property] == value;
  });
}

function test1() {
  var test = get("layers").map((layer) => {
    return getProperty(layer, "color.toHex()");
  });
  var test2 = get("color", app.activeDocument.layers[0]);
  alert(test);
  alert(test2);
}
function test2() {
  objectEntries();
}
function test3() {
  let color = new RGBColor().fromHex("#ff0000");
  for (const [key, value] of Object.entries(color)) alert(key + " == " + value);
  // red == 255
  // green == 0
  // blue == 0
  // typename == "RGBColor"
}
function test4() {
  filterThenIterateLayers();
}

function test5() {
  return JSON.stringify(
    get("layers").map((layer) => {
      return {
        name: layer.name,
        color: layer.color.toHex(),
      };
    })
  );
}

function testConsole() {
  console.log("Hello");
  console.error("World");
  console.debug("Testing");
}

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
