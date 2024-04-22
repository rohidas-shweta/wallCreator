import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';

class CubeCreator {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -500, 1500);
        this.renderer = new THREE.WebGLRenderer();
        this.controls = null;
        this.savedCameraPosition = null;
        this.flag = false;
        this.count = 0;
        this.posArray = [];
        this.createEntity = false;
        this.gui = new GUI();
        this.raycaster = new THREE.Raycaster();
        this.mouse;
        this.intersectPoint = new THREE.Vector3();
        
    }
    init(){
        this.scene.background = new THREE.Color("#f1f7f7");
        this.camera.position.set(0,100,0);
        this.camera.lookAt(0,0,0);
        this.savedCameraPosition = this.camera.position.clone();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.renderer.domElement.addEventListener('mousemove',this.createRay.bind(this), true);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        var settings = {
            message: "dat.GUI",
            checkbox : false,
            setView: false
        }
        const createWall = this.gui.addFolder('Create Wall');
        this.gui.add(settings, 'checkbox').onChange((value) => {
            this.createEntity = value;
            this.controls.enabled = !value;
        });
        this.gui.add(settings, 'setView').onChange((value) => {
            if (value) {
                this.camera.position.copy(this.savedCameraPosition);
            }
        });
        createWall.open();
        this.plane = new THREE.Plane();
        this.planeNormal = new THREE.Vector3();
        this.planeNormal.copy(this.camera.position).normalize();
        this.plane.setFromNormalAndCoplanarPoint(this.planeNormal, this.scene.position);
        
        window.addEventListener('resize', this.onWindowResize.bind(this), true);
        this.renderer.domElement.addEventListener('click',this.createPoints.bind(this), true);


        document.addEventListener("DOMContentLoaded", this.animate.bind(this));
    }

    createRay(event) {
        this.mouse = new THREE.Vector2((event.clientX/window.innerWidth * 2 - 1),
        -(event.clientY / window.innerHeight) * 2 + 1);
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        this.raycaster.ray.intersectPlane(this.plane, this.intersectPoint)
        
    }

    createPoints(event){
        if(this.createEntity === true){
            
            this.flag = true;
            if(this.count == 0){
                this.posArray = []
            }
            console.log("posArray", this.posArray);
            let geometry = new THREE.SphereGeometry(2,30,30);
            let material = new THREE.MeshBasicMaterial({color:'#44585b'});
            let mesh = new THREE.Mesh(geometry, material);
            this.scene.add(mesh);
            mesh.position.copy(this.intersectPoint);
            let point1 = new THREE.Vector3().copy(mesh.position);
            this.posArray.push(point1);
            this.count++;
            console.log(this.count);
            console.log(this.posArray);
            if(this.count == 2){
                console.log("create cube")
                let pointsArray = this.posArray
                this.posArray = [];
                this.createCube(pointsArray)
            }

        }
    }
    createCube(pointsArray) {
       let distance = pointsArray[0].distanceTo(pointsArray[1]);
       let width = distance;
       let height = distance/2;
       let depth = 50;      
       let geometry = new THREE.BoxGeometry(width, height, depth);
        let material = new THREE.MeshBasicMaterial({ color: '#52bfdc',transparent: true});
        let wall = new THREE.Mesh(geometry, material);

        let center = new THREE.Vector3().addVectors(pointsArray[0], pointsArray[1]).multiplyScalar(0.5);
        wall.position.copy(center); 
        let direction = new THREE.Vector3().subVectors(pointsArray[1], pointsArray[0]);
        direction.normalize();

        let rotation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1,0,0), direction);
        wall.applyQuaternion(rotation);

        this.scene.add(wall);
        let wireframeGeometry = new THREE.EdgesGeometry(geometry); // Create edges geometry
        let wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.5 }); // Set transparent material
        let wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial); // Create wireframe mesh
        wall.add(wireframe); 
        
        this.camera.rotation.y += Math.PI/2;
        this.count = 0;
        this.flag = false;
        let params = {
            width : width,
            height : height,
            depth : depth
        }
        console.log("params", params)
        this.addToDatabase(params)

    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        render();
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.render();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
        this.controls.update();
    }
    addToDatabase(params) {
        fetch('http://localhost:5000/insert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
        .then(response => response.json())
        .then(insertedData => {
            console.log('Data inserted successfully:', insertedData);
        })
        .catch(error => console.error('Error inserting data:', error));
    }
    
}

const cubeCreator = new CubeCreator();
cubeCreator.init();