/**
 * Created by ss on 2017/4/13.
 */
/*
-------------depthdotchart 以 x 为时间，y轴为震源深度，圆点半径表示震级，颜色表示alert的颜色； ---------------------

[ { 
mag:number, 
place：string,
time:number, 
alert:string, 
depth:number ----geometry.coordinates[2]

},{}....... ]


------------- geodotchart base on 以 X 为纬度，Y 为经度。 ---------------------

[ { 
mag:number, 
place:string,
lat:number, 
lng:number,
alert:string,
time:number

},{}....... ]



------------- top10countryChart ---------------------

[
{country: string, counts:number}
,{}...]


------------- yearlyBarChart ---------------------
--by month
[
{"month":"Jan","counts":300},{}，{}....
]

------------- seasonalBarChart in 10 days range---------------------
[
{"dayrange":"1/1 -1/10","counts":300},
{"dayrange":"1/11 -1/20","counts":300}，{}....
]

*/

var GraphicChart={
	radio:1.6,// chart width/height
	charts:[]
}


/**
 * Create dot base on depth and timeline
 * Params: data: array of data objects;
 *			parentSelector: a string used to select dom element(s)
 *			margin(optional): a object to over write the default margin of svg element, it can contains any of the following properties: top, bottom, left, right
 * 			heading(optional): a string of the header of the diagram
 */

GraphicChart.createDepthDotChart=function(data,parentSelector,margin,heading){
	var depthchart=new DotDiagram().data(data).container(parentSelector);
	GraphicChart.charts.push(depthchart);
	if(margin){
	    depthchart.margins(margin);
	}
	if(heading){
		depthchart.heading(heading);
	}
	depthchart.method(depthchart.depth);
	depthchart.render();
	return depthchart;
}

/**
 * Create dot base on latitude and longitude
 */
GraphicChart.createGeoDotChart=function(data,parentSelector,margin,heading,country_abbr){

    var geochart=new DotDiagram().data(data).container(parentSelector);
    GraphicChart.charts.push(geochart);
    	if(margin){
    	    geochart.margins(margin);
    	}
    	if(heading){
    		geochart.heading(heading);
    	}
    geochart.method(geochart.geo);
     geochart.render();

    if(country_abbr){
        geochart.addMap(country_abbr);
    }
    return geochart;

}

/**
 * Create pie chart base top 10 countries
 */
GraphicChart.createTop10PieChart=function(data,parentSelector,margin,heading){
    var top10chart=new PieChart().data(data).container(parentSelector);
    GraphicChart.charts.push(top10chart);
    	if(margin){
    	    top10chart.margins(margin);
    	}
    	if(heading){
    		top10chart.heading(heading);
    	}
    top10chart.method(top10chart.country);
    top10chart.render();
    return top10chart;

}


GraphicChart.createYearlyBarChart=function(data,parentSelector,margin,heading){
	
    var yearlychart= new BarDiagram().data(data).container(parentSelector);
    GraphicChart.charts.push(yearlychart);
    	if(margin){
    	    yearlychart.margin(margin);
    	}
    	if(heading){
    		yearlychart.heading(heading);
    	}
	yearlychart.sample(false);
    yearlychart.method(yearlychart.yearly);
    yearlychart.render();
    return yearlychart;
}

GraphicChart.createSeasonalBarChart=function(data,parentSelector,margin,heading){
    var seasonalchart= new BarDiagram().data(data).container(parentSelector);
    this.charts.push(seasonalchart);
    	if(margin){
    	    seasonalchart.margins(margin);
    	}
    	if(heading){
    		seasonalchart.heading(heading);
    	}
	seasonalchart.sample(false);
    seasonalchart.method(seasonalchart.seasonal);
    seasonalchart.render();
    return seasonalchart;
}


/**
 * update diagram size
 */

GraphicChart.update=function(){
	GraphicChart.charts.forEach(function(chart){
		chart.update();
	});
}

/**
* remove all diagram
*/

GraphicChart.removeAll=function(){
	GraphicChart.charts.forEach(function(chart){
		chart.remove();
		delete(chart);
	});
	GraphicChart.charts=[];
}


