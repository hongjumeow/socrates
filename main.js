let camera, renderer, scene;
let mesh;


    camera = new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,1.0,1000);
    camera.position.set(50,0,50);
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({canvas: document.querySelector("#canvas")});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;


    // loadingScreen.box.position.set(0,0,5);
    // loadingScreen.camera.lookAt(loadingScreen.box.position);
    // loadingScreen.scene.add(loadingScreen.box);

    renderer.render(scene,camera);


    const controls = new THREE.OrbitControls(
        camera, renderer.domElement);
    controls.target.set(0,0, 0);
    controls.minDistance =20;
    controls.maxDistance = 150;
    controls.noKeys = true;
    // controls.rotateSpeed = 1.4;
    controls.update();
    controls.enablePan = true;
    controls.enableDamping = true;


    let light = new THREE.AmbientLight(0xffffff,1);
    light.position.set(100,50,100);
    scene.add(light);

    function createPlanet(planet,type,x,y,z){
 
        let texture = new THREE.TextureLoader().load(type);
        let material = new THREE.MeshBasicMaterial({map:texture});
    
        mesh=new THREE.Mesh(planet,material);
        mesh.position.set(x,y,z);
        mesh.rotation.x+=0.5;
        scene.add(mesh);
        
    }
    let geometry = new THREE.SphereGeometry(10,100,100);
    createPlanet(geometry,'./resources/earth.jpeg',0,0,0);
          
    const loader = new THREE.CubeTextureLoader();

    // scene.background = loader.load([
    //     './skybox_space/corona_pz.png',
    //     './skybox_space/corona_nz.png',
    //     './skybox_space/corona_py.png',
    //     './skybox_space/corona_ny.png',
    //     './skybox_space/corona_px.png',
    //     './skybox_space/corona_nx.png',

    // ]);
    let stars = new THREE.Mesh(
        new THREE.SphereGeometry(120, 1200, 1200),
        new THREE.MeshBasicMaterial({
          map:  THREE.ImageUtils.loadTexture('resources/galaxy_starfield.png'),
          side: THREE.BackSide
        })
    );
    scene.add(stars);

    // create a sphere
    // let sphere = new THREE.SphereGeometry();
    // let sphereMaterial = new THREE.MeshPhongMaterial({
    //     color: 0xffffff,
    //     shading : THREE.FlatShading,
    // });
    // let menu = new THREE.Mesh(sphere,sphereMaterial);
    // menu.position.set(20,20,0);
    // scene.add(menu);

    // get animation file

    let mixers = [];
    let previousRAF = null;

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

    const fbxloader2 = new THREE.FBXLoader();
    fbxloader2.load('./resources/dancer/aj.fbx',(fbx)=>{
        fbx.scale.setScalar(0.15);
        fbx.traverse(c=>{
            c.castShadow = true;
        });
        fbx.position.copy(new THREE.Vector3(-2, 3.8, -4.7));
        fbx.rotation.x=Math.PI;

        const anim = new THREE.FBXLoader();
        anim.load('./resources/dancer/Sitting.fbx',(anim)=>{
            const m = new THREE.AnimationMixer(fbx);
            mixers.push(m);
            const idle = m.clipAction(anim.animations[0]);
            idle.play();
        });
        scene.add(fbx);
    });

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
    RAF();
    function animate(){
        // if(RESOURCES_LOADED == false){
        //     requestAnimationFrame(animate);
        //     renderer.render(loadingScreen.scene,loadingScreen.camera);
        // }
        resize();
        mesh.rotation.y+=0.0005;
        renderer.render(scene,camera);
        requestAnimationFrame(animate);
    }
    animate();

    // var raycaster = new THREE.Raycaster(),INTERSECTED;
    // var mouse = new THREE.Vector2();
    // raycaster.setFromCamera(mouse, camera);
    // var intersects = raycaster.intersectObjects(menu);
    // if (intersects.length > 0) {
    //     if (INTERSECTED != intersects[0].object) {
    //         if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
    //         INTERSECTED = intersects[0].object;
    //         INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
    //         //setting up new material on hover
    //         INTERSECTED.material.emissive.setHex(Math.random() * 0xff00000 - 0xff00000);
    //     }
    // } else {
    //     if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
    //     INTERSECTED = null;
    // }


    // function onDocumentMouseDown(event) {
    //     event.preventDefault();
    //     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    //     raycaster.setFromCamera(mouse, camera);
    //     var intersects = raycaster.intersectObjects(menu);
    //     if (intersects.length > 0) {
    //     //get a link from the userData object
    //         window.open('https://www.instagram.com/');
    //     }
    // };

    // document.addEventListener('mousedown', onDocumentMouseDown, false);

    // const timeElapsed = timeElapsed *0.001;




function resize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


let spinnerWrapper = document.querySelector('.spinner-wrapper');
window.addEventListener('load', function(){
    spinnerWrapper.parentElement.removeChild(spinnerWrapper);
});
window.addEventListener('resize', function(){
    resize();
});
// init();

// animate();
