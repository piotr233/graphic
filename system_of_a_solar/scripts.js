let scene, free_camera, static_camera;
let debug_mode = true;



function orbit(pivot, object, angle_x, angle_y, angle_z) {
	let R = Math.pow((object.position.x - pivot.position.x), 2) +
		Math.pow((object.position.y - pivot.position.y), 2) +
		Math.pow((object.position.z - pivot.position.z), 2);

	R = Math.sqrt(R);
	//console.log(R);

	let to_return = new THREE.Vector3(
		pivot.position.x,
		pivot.position.y + R * Math.sin(Math.PI * angle_x / 180),
		pivot.position.z + R * Math.cos(Math.PI * angle_x / 180)

	);


	return to_return;


}
function addpoint(object) {


	let x = new THREE.Mesh(
		new THREE.SphereGeometry(1.4, 10, 10, 10),
		new THREE.MeshBasicMaterial({ color: 0xffae00 }));

	path.add(x);
	x.position.copy(object.position);

}
function moonorbit(pivot, angle_x, R) {



	let to_return = new THREE.Vector3(
		50,
		pivot.position.y + R * Math.sin(Math.PI * angle_x / 180),
		pivot.position.z + R * Math.cos(Math.PI * angle_x / 180)

	);


	return to_return;


}



const loader = new THREE.TextureLoader();

let color = '#edebbf';
let intensity = 1
let distance = 300
let decay = 0.1;


let player_obj_geometry, player_obj_material;

let sun, Arrakis, ziemia, vulkan, donut, weird_thing;
let pivot_Arrakis, pivot_ziemia, pivot_vulkan, pivot_donut, pivot_weird_thing, pivot_moon, pivot_sun;

let sprite;

let cherry, moon;

let ancor_point;

let cherry_group;

const raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var INTERSECTED;

function onMouseMove(event) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

}


let path = new THREE.Group();
//scene.add(path);
function init() {


	scene = new THREE.Scene();

	scene.add(path);


	free_camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
	static_camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
	static_camera.position.z = 0;
	static_camera.position.x = -400;
	static_camera.rotation.y -= 3.14 / 2;


	free_camera.position.z = 100;




	scene.background = new THREE.CubeTextureLoader().setPath('/graphic/system_of_a_solar/textures/skybox/').load([
		'px.png',
		'nx.png',
		'py.png',
		'ny.png',
		'pz.png',
		'nz.png'
	]);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	controls = new THREE.OrbitControls(free_camera, renderer.domElement);
	controls.update();


	document.body.appendChild(renderer.domElement);


	const axesHelper = new THREE.AxesHelper(5);
	if (debug_mode) scene.add(axesHelper);



	let ambient = new THREE.AmbientLight(0x555555, 0.5);
	scene.add(ambient);



	const pint_light = new THREE.PointLight(0x777777, 5, 1000);
	pint_light.position.set(0, 0, 0);
	scene.add(pint_light);

	//sun
	sun = new THREE.Mesh(new THREE.SphereGeometry(20, 20, 20, 20),
		new THREE.MeshBasicMaterial({ map: loader.load('/graphic/system_of_a_solar/textures/sun.jpg') }));
	scene.add(sun);
	sun.position.set(5, 0, 0);
	pivot_sun = new THREE.Object3D();
	pivot_sun.position.set(0, 0, 0);


	sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.TextureLoader().load('/graphic/system_of_a_solar/textures/sunGlow.png') }));
	sprite.scale.set(150, 150, 1);
	sprite.opacity = 0.6;
	scene.add(sprite);



	// diuna

	Arrakis = new THREE.Mesh(
		new THREE.SphereGeometry(10, 20, 20, 20),
		new THREE.MeshLambertMaterial({ cmap: loader.load('/graphic/system_of_a_solar/textures/marsMap.jpg') }));
	scene.add(Arrakis);
	Arrakis.position.set(30, 45, 0);


	pivot_Arrakis = new THREE.Object3D();
	pivot_Arrakis.position.set(30, 0, 0);



	// ziemia

	ziemia = new THREE.Mesh(
		new THREE.CylinderGeometry(10, 10, 1, 30),
		new THREE.MeshLambertMaterial({ map: loader.load('/graphic/system_of_a_solar/textures/earthmap1k.jpg') }));
	scene.add(ziemia);
	ziemia.position.set(60, 90, 0);
	ziemia.rotation.z += Math.PI * 90 / 180;


	pivot_ziemia = new THREE.Object3D();
	pivot_ziemia.position.set(60, 0, 0);

	moon = new THREE.Mesh(
		new THREE.SphereGeometry(2, 20, 20, 20),
		new THREE.MeshLambertMaterial({ map: loader.load('/graphic/system_of_a_solar/textures/moonmap4k.jpg') }));
	scene.add(moon);
	moon.position.set(50, 90, 0);

	pivot_moon = new THREE.Object3D();
	//pivot_moon.position.set(ziemia.position);
	console.log(pivot_moon.position);

	// vulkan

	vulkan = new THREE.Mesh(
		new THREE.SphereGeometry(10, 20, 20, 20),
		new THREE.MeshLambertMaterial({ map: loader.load('/graphic/system_of_a_solar/textures/asteroidTest.jpg') }));
	scene.add(vulkan);
	vulkan.position.set(120, 120, 0);

	pivot_vulkan = new THREE.Object3D();
	pivot_vulkan.position.set(120, 0, 0);

	// donut

	donut = new THREE.Mesh(
		new THREE.TorusGeometry(10, 3, 16, 100),
		new THREE.MeshLambertMaterial({ map: loader.load('/graphic/system_of_a_solar/textures/saturnmap.jpg') }));
	scene.add(donut);
	donut.position.set(150, 180, 0);
	pivot_donut = new THREE.Object3D();
	pivot_donut.position.set(150, 0, 0);





	// weird_thing

	weird_thing = new THREE.Mesh(new THREE.TorusKnotBufferGeometry(13, 1, 64, 40),
		new THREE.MeshLambertMaterial({ map: loader.load('/graphic/system_of_a_solar/textures/earthcloudmap.jpg') }));

	scene.add(weird_thing);
	weird_thing.position.set(150, 180, 0);

	pivot_weird_thing = new THREE.Object3D();
	pivot_weird_thing.position.set(150, 0, 0);


	render();
}


let camera_counter = 0;
let bool_asteroid = false;

let asteroid = new Array();
let asteroid_path = new Array();

window.addEventListener('keydown', function (event) {
	switch (event.keyCode) {
		case 37: // Left
			if (bool_asteroid) asteroid.rotation.y += 0.07;

			break;

		case 39: // Right


			if (bool_asteroid) asteroid.rotation.y -= 0.07;

			break;

		case 38: // Up
			if (bool_asteroid) asteroid.position.z -= Math.cos(asteroid.rotation.y) * step;
			if (bool_asteroid) asteroid.position.x += Math.sin(asteroid.rotation.y) * step;
			break;


		case 40: // Down
			if (bool_asteroid) asteroid.position.z += Math.cos(asteroid.rotation.y) * step;
			if (bool_asteroid) asteroid.position.x += Math.sin(asteroid.rotation.y) * step;

			break;


		case 32: //space


			camera_counter++;

			let x = new THREE.Mesh(
				new THREE.SphereGeometry(20, 20, 20, 20),
				new THREE.MeshBasicMaterial({ color: 0xff0000 }));


			asteroid.push(x);
			asteroid_path.push(free_camera.rotation);
			console.log(asteroid_path[asteroid_path.length - 1]);

			scene.add(asteroid[asteroid.length - 1]);

			asteroid[asteroid.length - 1].position.copy(free_camera.position);
			bool_asteroid = true;




			break;



	}
}, false);

document.onkeydown = function (key) {




	key.preventDefault();

	//console.log(key);
	mouse.x = (key.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (key.clientY / window.innerHeight) * 2 + 1;



}



angle_arrakis = 0;
angle_ziemia = 0, angle_vulkan = 0, angle_donut = 0, angle_weird_thing = 0, angle_sun = 0;

let planet_counter = 0;
let frame_counter = 0;
let step = 0.5;

function render() {

	{

		raycaster.setFromCamera(mouse, free_camera);

		const intersects = raycaster.intersectObjects(scene.children);

		if (intersects.length > 0) {

			if (INTERSECTED != intersects[0].object) {

				//if (INTERSECTED) INTERSECTED.material.setColor(0x00ff00);

				INTERSECTED = intersects[0].object;
				//INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
				//INTERSECTED.material.emissive.setHex(0xff0000);

			}

		} else {

			//if (INTERSECTED) INTERSECTED.material.setColor(0x0000ff);

			INTERSECTED = null;

		}
	}

	{ // arbit calculation

		angle_sun -= 0.6;
		sun.position.copy(orbit(pivot_sun, sun, angle_sun, 0, 0));
		sun.rotation.x += Math.random() % 10 / 100;
		sun.rotation.z += Math.random() % 10 / 100;
		sun.rotation.y += Math.random() % 10 / 100;


		sprite.position.copy(sun.position);

		angle_arrakis += 0.1;
		Arrakis.position.copy(orbit(pivot_Arrakis, Arrakis, angle_arrakis, 0, 0));
		Arrakis.rotation.x += Math.random() / 10;
		Arrakis.rotation.y += Math.random() / 10;
		Arrakis.rotation.z += Math.random() / 10;

		angle_ziemia += 0.4;
		ziemia.position.copy(orbit(pivot_ziemia, ziemia, angle_ziemia, 0, 0));


		pivot_moon.position.x = ziemia.position.x;

		pivot_moon.position.y = ziemia.position.y;

		pivot_moon.position.z = ziemia.position.z;


		moon.position.copy(moonorbit(pivot_moon, angle_weird_thing, 8));


		angle_vulkan += 1.4;
		vulkan.position.copy(orbit(pivot_vulkan, vulkan, angle_vulkan, 0, 0));
		vulkan.rotation.x += Math.random() / 10;
		vulkan.rotation.y += Math.random() / 10;
		vulkan.rotation.z += Math.random() / 10;

		angle_donut -= 0.9;
		donut.position.copy(orbit(pivot_donut, donut, angle_donut, 0, 0));
		donut.rotation.x += Math.random() / 10;
		donut.rotation.y += Math.random() / 10;
		donut.rotation.z += Math.random() / 10;



		angle_weird_thing -= 1.4;
		weird_thing.position.copy(orbit(pivot_weird_thing, weird_thing, angle_weird_thing, 0, 0));
		weird_thing.rotation.x += Math.random() / 10;
		weird_thing.rotation.y += Math.random() / 10;
		weird_thing.rotation.z += Math.random() / 10;
	}



	{// adding path points
		frame_counter++;

		if (frame_counter % 4 == 0) {
			if (frame_counter % 40 == 0) { addpoint(sun); planet_counter++; }
			if (frame_counter % 40 == 0) {
				addpoint(Arrakis); planet_counter++;
			}
			if (frame_counter % 20 == 0) {
				addpoint(ziemia);
				planet_counter++;
			}
			addpoint(vulkan);
			addpoint(donut);
			addpoint(weird_thing);

			planet_counter += 3;

		}
		for (i = 0; i < planet_counter; i++) path.children[i].position.x += 0.4;


	}

	{
		asteroid

		for (i = 0; i < asteroid.length; i++) {
			asteroid[i].position.x += Math.sin(asteroid_path[i][0]) * step;

			asteroid[i].position.y += Math.sin(asteroid_path[i][1]) * step;
			asteroid[i].position.z += Math.cos(asteroid_path[i][2]) * step;
		}

	}





	if (camera_counter % 2 == 0) renderer.render(scene, free_camera);
	else renderer.render(scene, static_camera);

	requestAnimationFrame(render);






}


window.addEventListener('mousemove', onMouseMove, false);


init();
