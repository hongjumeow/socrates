class LoadModelDemo {
    constructor(){
        this.Initialize();
    }
    Initialize(){
        this.renderer = new THREE.WebGLRenderer({antialias:true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth,window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        window.addEventListener('resize',() => {
            this.OnWindowResize();
        },false);

        this.camera = new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,1.0,1000);
  
        this.camera.position.set(75,20,0);

        this.scene = new THREE.Scene();

        // let light = new THREE.DirectionalLight(0x696969,0.3);
        // light.position.set(20,100,10);
        // light.target.position.set(0,0,0);
        // light.castShadow = true;
        // light.shadow.bias = -0.001;
        // light.shadow.mapSize.width = 2048;
        // light.shadow.mapSize.height = 2048;
        // light.shadow.camera.near = 0.1;
        // light.shadow.camera.far = 500.0;
        // light.shadow.camera.near = 0.5;
        // light.shadow.camera.far = 500.0;
        // light.shadow.camera.left = 100;
        // light.shadow.camera.right = -100;
        // light.shadow.camera.top = 100;
        // light.shadow.camera.bottom = -100;
        // this.scene.add(light);

        let light = new THREE.AmbientLight(0xffffff,1);
        this.scene.add(light);


        const controls = new THREE.OrbitControls(
            this.camera, this.renderer.domElement);
        controls.target.set(0,-10, 0);
        controls.update();



        const loader = new THREE.CubeTextureLoader();
        this.scene.background = loader.load([
            './skybox_space/corona_pz.png',
            './skybox_space/corona_nz.png',
            './skybox_space/corona_py.png',
            // './IMG_0205.jpg',
            './skybox_space/corona_ny.png',
            './skybox_space/corona_px.png',
            './skybox_space/corona_nx.png',

        ]);
            
        // const plane = new THREE.Mesh(
        //     new THREE.PlaneGeometry(10000, 10000, 10, 10),
        //     new THREE.MeshStandardMaterial({
        //         color: 0x000000,
        //     }));
        // plane.castShadow = false;
        // plane.receiveShadow = true;
        // plane.rotation.x = -Math.PI / 2;
        // this.scene.add(plane)

        this._mixers = [];
        this._previousRAF = null;
        this.LoadModel();
        this._RAF();
    }
    LoadModel(){
        const loader = new THREE.FBXLoader();

        loader.load('./resources/hongjuname.fbx',(fbx)=>{
            fbx.scale.setScalar(0.2);
            fbx.traverse(c=>{
                const textureload = new THREE.TextureLoader().load('./brushed_metal.jpeg');
                c.castShadow=true;
                c.material = new THREE.MeshBasicMaterial({
                    map:textureload,
                    });
                });
            fbx.rotation.x=-Math.PI/2;
            this.scene.add(fbx);

        })
    }
    OnWindowResize() {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._threejs.setSize(window.innerWidth, window.innerHeight);
    }

  _RAF() {
    requestAnimationFrame((t) => {
      if (this._previousRAF === null) {
        this._previousRAF = t;
      }

      this._RAF();

      this.renderer.render(this.scene, this.camera);
      this._Step(t - this._previousRAF);
      this._previousRAF = t;
    });
  }

  _Step(timeElapsed) {
    const timeElapsedS = timeElapsed * 0.001;
    if (this._mixers) {
      this._mixers.map(m => m.update(timeElapsedS));
    }

    if (this._controls) {
      this._controls.Update(timeElapsedS);
    }
  }
};
let _APP = null;
window.addEventListener('DOMContentLoaded',()=>{
    _APP = new LoadModelDemo();
});
