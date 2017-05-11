/**
 * Created by ss on 2017/4/12.
 */


function buildEarthModel(width,height,localizationLog,length) {
    
    var Detector = {

	canvas: !! window.CanvasRenderingContext2D,
	webgl: ( function () { try { var canvas = document.createElement( 'canvas' ); return !! window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ); } catch( e ) { return false; } } )(),
	workers: !! window.Worker,
	fileapi: window.File && window.FileReader && window.FileList && window.Blob,

	getWebGLErrorMessage: function () {

		var element = document.createElement( 'div' );
		element.className = 'webgl-error';

		if ( !this.webgl ) {

			element.innerHTML = window.WebGLRenderingContext ? [
				'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a>.<br />',
				'Find out how to get it <a href="http://get.webgl.org/">here</a>.'
			].join( '\n' ) : [
				'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a>.<br/>',
				'Find out how to get it <a href="http://get.webgl.org/">here</a>.'
			].join( '\n' );

		}

		return element;

	},

	addGetWebGLMessage: function (parent ) {

		parent.appendChild( Detector.getWebGLErrorMessage() );

	}

};

	var webglEl = document.getElementById('webgl');

	if (!Detector.webgl) {
		Detector.addGetWebGLMessage(webglEl);
		return;
	}
	
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);
    webglEl.appendChild(renderer.domElement);
	
	//var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(45 + length , width/height, 0.1, 1000);
	
	var earth = new Earth();
    
    camera.position.z = IS_EARTH_IN_MOBILE?2:1.5;
	earth.scene.add(camera);
    
    var controls = new THREE.TrackballControls(camera,webglEl);
	earth.createObject(localizationLog);

	//scene.add(earth.object);
	var Singletonlight = (function(){
         return new THREE.AmbientLight(0xffffff,0.001); 
    })();
    
  	earth.scene.add(Singletonlight);
	
	//earth.addAxisHelper(earth.mesh, 4);
	//earth.addAxisHelper(earth.object,5);

	var render=function(){
		requestAnimationFrame(render);
		earth.mesh.rotation.y += 0.001;
        controls.update();
		renderer.render(earth.scene,camera);
	}
	render();
   

	setInterval(function(){
		earth.earthquakeDots.forEach(function(dot){
			dot.animation()();
		})
	},500);
    
    return earth;
	

};


var Earth = function(){
	
	var vSegments = 128,
		hSegments=128,
		rotation = 0;
	
	this.radius=0.5;
	this.scene = new THREE.Scene();
	this.geo = new THREE.SphereGeometry(this.radius, vSegments, hSegments);
	
	this.material=new THREE.MeshPhongMaterial({
				map:new THREE.ImageUtils.loadTexture('img/2_no_clouds_4k.jpg'),
				specularMap:new THREE.ImageUtils.loadTexture('img/water_4k.png'),
				specular:    new THREE.Color('grey')								
			});
	
	this.mesh = new THREE.Mesh(this.geo,this.material);
	
	this.cloud = new THREE.Mesh(
			new THREE.SphereGeometry(this.radius*1.01, vSegments, hSegments),			
			new THREE.MeshPhongMaterial({
				map:new THREE.ImageUtils.loadTexture('img/fair_clouds_4k.png'),
				transparent: true
			})
		);
	
	this.space = new THREE.Mesh(
			new THREE.SphereGeometry(this.radius*6, vSegments, hSegments), 
			new THREE.MeshBasicMaterial({
				map: new THREE.ImageUtils.loadTexture('img/galaxy_starfield.png'), 
				side: THREE.BackSide
			})
		);
	
	this.object; // group of earth element
	this.earthquakeDots=[];
	//this.camera= new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
		
}
	
Earth.prototype.createObject=function(localizationLog){
	this.mesh.add(this.cloud);
	this.object=new THREE.Object3D();
	this.object.add(this.mesh);
	this.object.add(this.space);
	this.object.rotateZ(-Math.PI*23.5/180);
	this.scene.add(this.object);
    var theta = (localizationLog+180)*(Math.PI/180);
    this.mesh.rotateY(- theta + Math.PI/2 );
	//this.scene.add(this.camera);
	//console.log(this);
	
}


Earth.prototype.addAxisHelper=function(mesh,size){
	//console.log(mesh);
	var axisHelper = new THREE.AxisHelper( size );
	mesh.add(axisHelper);
}

Earth.prototype.rotateIt=function(){

	this.mesh.rotation.y=+0.001;

}

Earth.prototype.addDot=function(dotInfo){
	var dot = new Dot(dotInfo[0],dotInfo[1],dotInfo[2],dotInfo[3]);
	dot.animation();
	this.earthquakeDots.push(dot);
	dot.object.position.set(dot.position.x,dot.position.y,dot.position.z);
	dot.object.lookAt(new THREE.Vector3(0,0,0));
	this.mesh.add(dot.object);
	console.log(this.earthquakeDots.length);
	console.log("childen:"+this.mesh.children.length)
}

Earth.prototype.removeDot = function(number){
	for(var i=0; i<number; i++){
		var removeDot = this.earthquakeDots[0];
		this.mesh.remove(removeDot.object);
		this.earthquakeDots[0]
		delete removeDot;
		delete this.earthquakeDots[0];
		console.log(this.earthquakeDots[0]);
		console.log(this.earthquakeDots.length);
		console.log("childen:"+this.mesh.children.length)
		this.earthquakeDots=this.earthquakeDots.slice(1)
	}
	console.log(this.earthquakeDots.length);
}


function Dot(lat,lon,mag,dep){
		
	const RADIUS = 0.5;

	this.latitude = lat;
	this.longitude = lon;
	this.magnitude = mag;
	this.depth = dep;
	this.position={};
	var phi   = (90-lat)*(Math.PI/180);
	var theta = (lon+180)*(Math.PI/180);
    

	this.position.x = -((RADIUS) * Math.sin(phi)*Math.cos(theta));

	this.position.y = ((RADIUS) * Math.cos(phi));

	this.position.z = -((RADIUS) * Math.sin(phi)*Math.sin(theta));

	this.radius=0.001+Math.pow(this.magnitude,0.25)/500;
    //this.radius = 0.01 + Math.sin(Math.PI * mag /10) * 0.006 ;

	const COLORS = ["#ff9933","#ff4000","#e60000"];

	this.color=(this.depth<60)?COLORS[0]:((this.depth>=300)?COLORS[2]:COLORS[1]);

	this.geo = new THREE.TorusGeometry(this.radius,this.radius/3,7, 40 );//(0.2,0.2,0.02); //this.radius, 39, 39 );
	this.material=new THREE.MeshBasicMaterial({
                color: this.color
            });
	
	this.material.transparent=true;
	this.material.opacity=0.7;
	this.material.needUpdate=true;
	this.mesh = new THREE.Mesh(this.geo,this.material);
	this.mesh.position.z=-0.001;
	var object = new THREE.Object3D(); 
	object.add(this.mesh);
	this.object=object;
	
	this.verticesPos=[];
	for(var i=0; i<this.geo.vertices.length; i++){

			this.verticesPos.push(this.geo.vertices[i]);
	}
	//this.animation();
	return this;
}

Dot.prototype.animation=function(){
	//console.log(this);
	var dotGeo=this.geo;
	//console.log(dotGeo.vertices);
	var startPositons=this.verticesPos;;
	var radio=1.5;
	return (function(){
		
		if(dotGeo.vertices[0].z > -0.0045){
		dotGeo.vertices.forEach(function(vertice){
			vertice.x= vertice.x*radio;
			vertice.y= vertice.y*radio;
			vertice.z -=0.001;
			
		})
		}else{
			dotGeo.vertices.forEach(function(vertice,i){
			vertice.x= vertice.x/radio;
			vertice.y= vertice.y/radio;
			vertice.z +=0.001;
			
		})
		}
		dotGeo.verticesNeedUpdate=true;
	})
}


