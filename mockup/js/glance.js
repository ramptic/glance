var health = Object.freeze({
  healthy: 0,
  warnings: 1,
  fatal: 2
});

var counters = [];
var camera, scene, renderer;
var controls;
var objects = [];
var tiles = [];

function init(data) {
  var row = 0;
  var lastColumn = 1;

  data.forEach(function(counter) {
    (counter.column == lastColumn) ? row++ : row = 1;
    counters = counters.concat([counter.name, counter.value, counter.column, row, counter.status]);
    lastColumn = counter.column;
  });

  width = window.innerWidth;
  height = window.innerHeight;
  camera = new THREE.PerspectiveCamera(60, width / height , 1, 1000);
  camera.position.z = 2400;
  scene = new THREE.Scene();

  for (var i = 0; i < counters.length; i += 5) { // 5 = name + value + column + row + status

    var tile = document.createElement("div");
    tile.id = "counter" + i;
    tile.className = "tile";

    if (counters[ i + 4 ] == health.fatal) {
      tile.style.backgroundColor = "rgba(255,0,0, 0.6)";
    }
    else if (counters[ i + 4 ] == health.warnings) {
      tile.style.backgroundColor = "rgba(255,127,0,0.6)";
    } else {
      tile.style.backgroundColor = "rgba(0,127,0," + (Math.random() * 0.5 + 0.25 ) + ")";
    }

    tile.onclick = function() {
      var id = parseInt(this.id.replace("counter", ""));
      alert(id);
    }

    var counter = document.createElement("div");
    counter.className = "counter";
    counter.textContent = counters[i];
    tile.appendChild(counter);

    var details = document.createElement("div");
    details.className = "status";
    details.innerHTML = counters[i + 1].replace(/\n/g, "<br>");
    tile.appendChild(details);

    var object = new THREE.CSS3DObject(tile);
    object.position.x = Math.random() * 4000 - 2200;
    object.position.y = Math.random() * 4000 - 2200;
    object.position.z = Math.random() * 4000 - 2200;
    scene.add(object);
    objects.push(object);

    var object = new THREE.Object3D();
    object.position.x = (counters[i + 2] * 420) - 2300;
    object.position.y = - (counters[i + 3] * 420) + 1400;
    tiles.push(object);
  }

  renderer = new THREE.CSS3DRenderer();
  renderer.setSize(width, height);
  renderer.domElement.style.position = "absolute";
  document.getElementById("container").appendChild(renderer.domElement);

  transform(tiles, 2000);
  window.addEventListener("resize", onWindowResize, false);
}

function transform(tiles, duration) {
  TWEEN.removeAll();

  for (var i = 0; i < objects.length; i++) {
    var object = objects[i];
    var target = tiles[i];

    new TWEEN.Tween(object.position)
      .to({ x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
  }

  new TWEEN.Tween(this)
    .to({}, duration * 2)
    .onUpdate(render)
    .start();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  render();
}

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
}

function render() {
  renderer.render(scene, camera);
}

