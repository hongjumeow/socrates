let camera, renderer, scene;
let mesh;

let mixers = [];
let previousRAF = null;

// let loadingScreen = {
//     scene: new THREE.Scene(),
//     camera: new THREE.PerspectiveCamera(60,window.innerWidth/2/window.innerHeight,1.0,1000),
    
//     box: new THREE.Mesh(
//         new THREE.BoxGeometry(0.5,0.5,0.5),
//         new THREE.MeshBasicMaterial({color:0x4444ff})
//         )
// };

// let RESOURCES_LOADED = false;

function init(){

    renderer = new THREE.WebGLRenderer({canvas: document.querySelector("#canvas")});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth,window.innerHeight);

    camera = new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,1.0,1000);
    camera.position.set(50,0,50);
    scene = new THREE.Scene();

//     loadingScreen.box.position.set(0,0,5);
//     loadingScreen.camera.lookAt(loadingScreen.box.position);
//     loadingScreen.scene.add(loadingScreen.box);
    
    renderer.render(scene,camera);


    const controls = new THREE.OrbitControls(
        camera, renderer.domElement);
    controls.target.set(0,0, 0);
    controls.update();

    let light = new THREE.AmbientLight(0xffffff,1);
    light.position.set(100,50,100);
    scene.add(light);

    let earth = new THREE.SphereGeometry(10,100,100);
    createPlanet(earth,'./resources/earth.jpeg',0,0,0);
          
    const loader = new THREE.CubeTextureLoader();

    scene.background = loader.load([
        './skybox_space/corona_pz.png',
        './skybox_space/corona_nz.png',
        './skybox_space/corona_py.png',
        './skybox_space/corona_ny.png',
        './skybox_space/corona_px.png',
        './skybox_space/corona_nx.png',

    ]);

    const fbxloader = new THREE.FBXLoader();
    fbxloader.load('./resources/dancer/girl.fbx',(fbx)=>{
        fbx.scale.setScalar(0.15);
        fbx.traverse(c=>{
            c.castShadow = true;

        });

        fbx.position.copy(new THREE.Vector3(2, -3.8, 4.7));
        const anim = new THREE.FBXLoader();
        anim.load('./resources/dancer/Sitting.fbx',(anim)=>{
            const m = new THREE.AnimationMixer(fbx);
            mixers.push(m);
            const idle = m.clipAction(anim.animations[0]);
            idle.play();
        });
        scene.add(fbx);
    });
    RAF();

    // const timeElapsed = timeElapsed *0.001;

}
function RAF(){
    requestAnimationFrame((t)=>{
        if(previousRAF ===null){
            previousRAF =t;
        }
        RAF();
        renderer.render(scene,camera);
        const timeElapsedS = (t-previousRAF) * 0.001;
        if(mixers){
            mixers.map(m=>m.update(timeElapsedS));
        }
        previousRAF = t;
    });
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
//     if(RESOURCES_LOADED == false){
//         requestAnimationFrame(animate);
//         renderer.render(loadingScreen.scene,loadingScreen.camera);
//     }
    resize();
    
    mesh.rotation.y+=0.0005;
    renderer.render(scene,camera);
    requestAnimationFrame(animate);
}
let spinnerWrapper = document.querySelector('.spinner-wrapper');
window.addEventListener('load', function(){
    spinnerWrapper.parentElement.removeChild(spinnerWrapper);
});
init();
animate();
