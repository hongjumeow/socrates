let camera, renderer, scene;
let mesh;

function init(){

    renderer = new THREE.WebGLRenderer({canvas: document.querySelector("#canvas")});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth,window.innerHeight);

    camera = new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,1.0,1000);
    camera.position.set(50,0,50);
    scene = new THREE.Scene();

    renderer.render(scene,camera);


    const controls = new THREE.OrbitControls(
        camera, renderer.domElement);
    controls.target.set(0,0, 0);
    controls.update();

    let light = new THREE.AmbientLight(0xffffff,1);
    light.position.set(100,50,100);
    scene.add(light);

    let earth = new THREE.SphereGeometry(10,100,100);
    createPlanet(earth,'./resources/earth.png',0,0,0);
          
    const loader = new THREE.CubeTextureLoader();

    scene.background = loader.load([
        './skybox_space/corona_pz.png',
        './skybox_space/corona_nz.png',
        './skybox_space/corona_py.png',
        './skybox_space/corona_ny.png',
        './skybox_space/corona_px.png',
        './skybox_space/corona_nx.png',

    ]);


}

function createPlanet(planet,type,x,y,z){
 
    var texture = new THREE.TextureLoader().load(type);
    var material = new THREE.MeshBasicMaterial({map:texture});

    mesh=new THREE.Mesh(planet,material);
    mesh.position.set(x,y,z);
    mesh.rotation.x+=0.5;
    scene.add(mesh);
    
}


function resize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(){
    resize();
    mesh.rotation.y+=0.0005;
    renderer.render(scene,camera);
    requestAnimationFrame(animate);
}

init();
animate();
