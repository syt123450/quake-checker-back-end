/**
 * Created by ss on 2017/4/12.
 */

 var IS_EARTH_IN_MOBILE = false;

function buildEnvironment(width, height, data){
     
 // var width= window.innerWidth * 0.8;
 // var height= window.innerHeight;
 var localizationLog = -87.62;//longitude of Chicago
 var length = 10;
 //var localPoint = ;
 


//var dot =new Dot(39,130,3,0)

    var earth = buildEarthModel(width,height,localizationLog,length);//add the number of length to make the earth smaller

    var earthquakeAnimation_addDay = function (data, index) {
        setTimeout(function () {
            console.log(index+":"+data[index].length)
            if (data[index].length > 0) {
                for (var i = 0, n = data[index].length - 1; i <= n; n--) {
                    earth.addDot(data[index][n]);
                }
            }
            if(index >= 3){
                console.log("Removed:"+index+":"+data[index-3].length)
                console.log(earth.mesh.children.length)
                earth.removeDot(data[index-3].length);
            }
            index = index + 1;
            if (index < data.length) {
                setTimeout(earthquakeAnimation_addDay(data, index), 1000);
            }
        }, 1000);
    }



	// setTimeout(earthquakeAnimation_addDay(test_data(), 0), 1000);
    setTimeout(earthquakeAnimation_addDay(data, 0), 1000);
	////////---------------------


 }

var relocatedCameraForMobile = function () {
    IS_EARTH_IN_MOBILE = true;
 }