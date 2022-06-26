//Here's an example of the Command pattern:
var Action = function (fn) {
  this.execute = fn;
};

var command = new Action(function () {
  alert("Hello");
});

function inputHandler(e) {
  switch (e.type) {
    case "keydown":
      command.execute();
    case "mousedown":
      // code here
      break;
  }
}

window.addEventListener("keydown", inputHandler);
window.addEventListener("mousedown", inputHandler);
