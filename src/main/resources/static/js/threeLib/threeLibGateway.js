/**
 * Created by ss on 2017/4/12.
 */
function buildEnvironment(){
     
 var width= window.innerWidth * 0.8;
 var height= window.innerHeight;
 var localizationLog = -87.62;//longitude of Chicago
 var length = 10;
 //var localPoint = ;
 
 dots = [];

//var dot =new Dot(39,130,3,0)

var earth = buildEarthModel(width,height,localizationLog,length);//add the number of length to make the earth smaller 

	setInterval(function(){
		earth.addDot([Math.random()*180-90,Math.random()*360-180,Math.random()*9,Math.random()*380]);
		console.log(earth.earthquakeDots.length)
	},5000)
	
	setInterval(function(){
		earth.removeDot(6);
		console.log(earth.earthquakeDots.length)
	},30000)
//	earth.addDot([0,0,5,40]);
//	earth.addDot([0,90,4,40]);
	
 }