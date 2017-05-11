/**
 * Created by ss on 2017/4/13.
 * Code is based on D3.js library; please import <script src="./js/resource/d3.min.js"></script> in HMTL head
 */





//base class for diagram
var ChartDiagram = function () {
	this.color = "#4444ff";
	this.backgroundColor = "#000000";
	this.fillingColor = "#666";


	this.radio = (GraphicChart.radio ? GraphicChart.radio : 1.6);

	this.width = window.innerWidth;
	this.height = window.innerHeight;

	this.svg; // svg container

	this.margin = {
		top: 20,
		right: 20,
		bottom: 50,
		left: 50
	}; // should be avaible for outside
	this.parent; //parent container
	this.g;

	this.data;
	this.header;
	this.method;
	this.haveSample = true;
	this.sampleArea;

}

//set up graph width base on svg width and margin
ChartDiagram.prototype.gWidth = function () {
	console.log(this.constructor.name + " " + this.haveSample);
	if (this.constructor.name != "BarDiagram")
		return (this.width - this.margin.left - this.margin.right) * 0.7;
	return this.width - this.margin.left - this.margin.right;
};

//set up graph height base on svg height and margin
ChartDiagram.prototype.gHeight = function () {

	return this.height - this.margin.top - this.margin.bottom;
};

ChartDiagram.prototype.data = function (data) {
	this.data = data;
	return this;
};


ChartDiagram.prototype.margins = function (margin) {

	if (margin) {
		if (margin.top) {
			this.margin.top = margin.top;
		}
		if (margin.right) {
			this.margin.top = margin.right;
		}
		if (margin.bottom) {
			this.margin.top = margin.bottom;
		}
		if (margin.left) {
			this.margin.top = margin.left;
		}

		return this;
	}
	return this.margin;
};


ChartDiagram.prototype.heading = function (header) {
	if (header) {
		this.header = header;
		//console.log("on assignment header:"+this.header);
		return this;
	}
	return this.header;
};


ChartDiagram.prototype.container = function (parentSelector) {
	if (parentSelector) {
		this.parent = d3.select(parentSelector);
	} else {
		this.parent = d3.select("body");
	}
	this.width = Math.floor(parseFloat(this.parent.style('width')));
	this.height = this.width / this.radio; //Math.floor(parseFloat(this.parent.style('height')));
	return this;
}



ChartDiagram.prototype.createSVG = function () {

	this.width = Math.floor(parseFloat(this.parent.style('width')));

	this.height = this.width / this.radio;

	if (this.header) {

		this.parent.append('h4').attr("class", 'diagramHeader').text(this.header);
	}
	this.svg = this.parent
		.append("svg")
		.attr("width", this.width)
		.attr("height", this.height);
	this.g = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

	if (this.haveSample = true) {
		this.sampleArea = this.svg.append("g")
			.attr("transform", "translate(" + (this.margin.left + this.gWidth() * 1.1) + "," + this.margin.top + ")");
	}
	return this.g;
};

ChartDiagram.prototype.remove = function () {
	this.parent.select(".diagramHeader").remove();
	this.svg.remove();
};

ChartDiagram.prototype.update = function () {
	this.remove();
	this.render();
	if (this.map) {
		this.addMap(this.map);
	}
};

ChartDiagram.prototype.sample = function (haveSample) {

	this.haveSample = haveSample;
	console.log(this.constructor.name);
	console.log(this.haveSample);
	return this;
}

ChartDiagram.prototype.method = function (method) {
	this.method = method;
	return this;
}
/**
 *Class for create dot diagream
 * ----------need to be update in the future to fit various situation
 */
var DotDiagram = function () {
	ChartDiagram.call(this);

	this.opacity = 0.6;
	this.radius;
	this.color = {
		"red": "red",
		"orange": "orange",
		"yellow": "yellow",
		"green": "green",
		'null': "#666"
	};

	this.xAxis;
	this.yAxis;
	this.cx;
	this.cy;
	this.cr;
	this.xHeader;
	this.yHeader;
	this.map;

};

DotDiagram.prototype = Object.create(ChartDiagram.prototype);
DotDiagram.prototype.constructor = DotDiagram;



/**
 *parse data from geojson
 * ----------need to be update in the future
 */

DotDiagram.prototype.depth = function () {
	this.xAxis = d3.scaleTime().rangeRound([0, this.gWidth()]);

	this.yAxis = d3.scaleLinear().rangeRound([0, this.gHeight()]);

	this.xAxis.domain(d3.extent(this.data, function (d) {
		return d.time;
	}));
	this.yAxis.domain(d3.extent(this.data, function (d) {
		return d.depth;
	}));

	this.cx = function (callback) {
		return (function (d) {
			return callback(d.time);
		});
	};

	this.cy = function (callback) {
		return (function (d) {
			return callback(d.depth);
		});
	};

	this.cr = function (d) {
		return Math.pow(d.mag, 2) / 4;
	};

	this.xHeader = "Time";
	this.yHeader = "Depth";
	console.log(this.gHeight() / 14);

};


DotDiagram.prototype.geo = function () {

	this.xAxis = d3.scaleLinear().rangeRound([0, this.gWidth()]);
	this.yAxis = d3.scaleLinear().rangeRound([this.gHeight(), 0]);
	this.xAxis.domain(d3.extent(this.data, function (d) {
		return d.lng;
	}));
	this.yAxis.domain(d3.extent(this.data, function (d) {
		return d.lat;
	}));

	this.cx = function (callback) {
		return (function (d) {
			return callback(d.lng);
		});
	};

	this.cy = function (callback) {
		return (function (d) {
			return callback(d.lat);
		});
	};

	this.cr = function (d) {
		return Math.pow(d.mag, 2) / 4;
	};

	this.xHeader = "Longitude";
	this.yHeader = "Latitude";



};

DotDiagram.prototype.addMap = function (iso3) {
	var x = this.xAxis;
	var y = this.yAxis;
	this.map = iso3;
	var linecoord = d3.line()
		.x(function (d) {
			return x(d[0]);
		})
		.y(function (d) {
			return y(d[1]);
		});
	if (this.g) {
		this.g.selectAll("circle").remove();
	} else {
		this.g = this.createSVG();
	}
	var g = this.g;
	var diagram = this;
	var draw = this.draw;
	var drawMap = function (data) {

		if (Array.isArray(data[0][0])) {
			data.forEach(drawMap);
		} else {

			g.append("path").attr("class", "mapline")
				.attr("d", linecoord(data))
				.attr("fill", "pink")
				.attr("stroke", "black")
				.attr("stroke-width", "2");
		}
	}
	d3.json("https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson", function (data) {
		var countryData;
		for (var i = 0; i < data.features.length; i++) {
			if (data.features[i].properties.adm0_a3 == iso3) {
				countryData = data.features[i].geometry.coordinates; //[lng,lat]
				break;
			}
		}
		countryData.forEach(drawMap);
		draw(diagram);
	});



}
DotDiagram.prototype.addSample = function () {
	if (this.sampleArea) {

		this.sampleArea
			.append("text")
			.attr("x", 5).attr("y", this.gHeight() / 14).text("Magnitude");
		var onelineHeight = this.gHeight() / 14;


		this.sampleArea.selectAll("icon1")
			.data([7, 6, 5, 4]).enter()
			.append("circle")
			.attr("fill", "#666eee")
			.attr("r", function (d) {
				console.log(d);
				return Math.pow(d, 2) / 4;
			})
			.attr("cx", this.gWidth() / 14)
			.attr("cy", function (d, i) {
				return onelineHeight * (i + 2);
			});
		this.sampleArea.selectAll("icontext1")
			.data([7, 6, 5, 4]).enter()
			.append("text")
			.attr("x", this.gWidth() / 7)
			.attr("y", function (d, i) {
				return onelineHeight * (i + 2) + 2;
			}).text(function (d) {
				return d;
			});

		function sampledata(color) {
			var sample = [];
			console.log(color);
			for (var data in color) {
				console.log(data);
				console.log(color[data]);
				sample.push({
					alert: data,
					color: color[data]
				});
			}
			console.log(sample);
			return sample;
		}
		var colorsample = sampledata(this.color);
		this.sampleArea
			.append("text")
			.attr("x", 5).attr("y", this.gHeight() / 2).text("Alert colors");
		this.sampleArea.selectAll("alerticon")
			.data(colorsample).enter()
			.append("circle").attr('fill', function (d) {
				return d["color"];
			})
			.attr('r', 9).attr("cx", this.gWidth() / 14)
			.attr("cy", function (d, i) {
				return onelineHeight * (i + 8);
			}).attr("opacity", "0.6");
		this.sampleArea.selectAll("alerttext")
			.data(colorsample).enter()
			.append("text")
			.attr("x", this.gWidth() / 7)
			.attr("y", function (d, i) {
				return onelineHeight * (i + 8) + 2;
			}).text(function (d) {
				return d["alert"];
			});
	}
}
/**
 * Creating svg from data
 *
 */
DotDiagram.prototype.render = function (parseDataMethod) {
	if (parseDataMethod)
		this.method = parseDataMethod;


	var g = this.createSVG();
	var groupHeight = this.gHeight();
	var groupWidth = this.gWidth();
	if (this.method) {
		this.method();
	}
	this.addSample();
	this.draw();

};

DotDiagram.prototype.draw = function (diagram) {
	var color = function (colors) {
		return (function (d) {
			return colors[d.alert];
		});
	};
	if (!diagram) {
		diagram = this;
	}
	var mouseover = function (d) {
		d3.select("body")
			.append("div").attr("class", "info").style("left", d3.event.pageX + "px").style("top", d3.event.pageY + "px") //.style("position","absolute")
			.html(function () {
				var string = '';
				for (var pro in d) {
					if (pro == 'time') {
						var time = (new Date(d[pro])).toUTCString();
						string = string + pro + " : " + time + "<br>";
					} else
						string = string + pro + " : " + d[pro] + "<br>";
				}
				return string.substring(0, string.length - 4);
			})
	};
	diagram.g.append("g")
		.attr("transform", "translate(0," + diagram.gHeight() + ")")
		.call(d3.axisBottom(diagram.xAxis))
		.append('text').attr('text-anchor', 'end').text(diagram.xHeader)
		.select(".domain")
		.remove();

	diagram.g.append('g')
		.call(d3.axisLeft(diagram.yAxis))
		.append('text')
		.attr('fill', diagram.backgroundColor)
		.attr('transform', "rotate(-90)")
		.attr('y', 6)
		.attr('dy', '0.71em') ///////----------size
		.attr('text-anchor', 'end')
		.text(diagram.yHeader);

	diagram.g.selectAll("dot")
		.data(diagram.data)
		.enter()

		.append("circle")
		.attr("r", diagram.cr)
		.attr("cx", diagram.cx(diagram.xAxis))
		.attr("cy", diagram.cy(diagram.yAxis))
		.attr("opacity", diagram.opacity)

		.attr("fill", color(diagram.color))


		.on("mouseover", mouseover)
		.on("mouseout", function (d, i) {
			console.log(i);
			d3.select(this).style("stroke-width", 0);
			d3.select(".info").remove()
		});



}

var PieChart = function () {
	ChartDiagram.call(this);
	//this.radio=1;
	this.colors = ["#ffff00", "#ffcc44", "#ff8888", "#ff44cc", "#ff00ff", "#cc44ff", "#8888ff", "#44ccff", "#00ffff", "#44ffee"];
	this.pie;
	this.gradient;
	this.radius;
	this.pathD;
};

PieChart.prototype = Object.create(ChartDiagram.prototype);
PieChart.prototype.constructor = PieChart;

PieChart.prototype.createSVG = function () {
	this.width = Math.floor(parseFloat(this.parent.style('width')));
	this.height = this.width / this.radio;

	if (this.header) {

		this.parent.append('h4').attr("class", 'diagramHeader').text(this.header);
	}
	this.svg = this.parent
		.append("svg")
		.attr("width", this.width)
		.attr("height", this.height);
	this.radius = this.height * 0.4;
	this.g = this.svg.append("g").attr("transform", "translate(" + (this.margin.left + this.radius) + "," + (this.radius + this.margin.top) + ")");
	if (this.haveSample = true) {
		this.sampleArea = this.svg.append("g")
			.attr("transform", "translate(" + (this.margin.left + this.gWidth()) + "," + this.margin.top + ")");
	}
	return this.g;
};

PieChart.prototype.addSample = function () {
	console.log(this.sampleArea)
	if (this.sampleArea) {

		this.sampleArea
			.append("text")
			.attr("x", 5).attr("y", this.gHeight() / 14).text("Country");
		var onelineHeight = this.gHeight() / 14;

		this.sampleArea.selectAll("alerticon")
			.data(this.colors).enter()
			.append("circle").attr('fill', function (d) {
				console.log(d);
				return d;
			})
			.attr('r', 9).attr("cx", this.gWidth() / 14)
			.attr("cy", function (d, i) {
				return onelineHeight * (i + 3);
			}) //.attr("opacity","0.6");
		this.sampleArea.selectAll("alerttext")
			.data(this.data).enter()
			.append("text")
			.attr("x", this.gWidth() / 7)
			.attr("y", function (d, i) {
				return onelineHeight * (i + 3) + 2;
			}).text(function (d) {
				return d.country;
			});
	}
}
PieChart.prototype.country = function () {
	this.pie = d3.pie()
		.sort(null).value(function (d) {
			return d.counts;
		});
	this.gradient = this.g.append("defs")
		.selectAll(".gradient")
		.data(this.colors)
		.enter()
		.append("radialGradient")
		.attr("id", function (d, i) {
			return "gradient" + i;
		})
		.attr("gradientUnits", "userSpaceOnUse")
		.attr("cx", 0)
		.attr("cy", 0)
		.attr("r", this.radius * 2.5)
		.attr("spreadMethod", "pad");

	this.gradient.append("stop")
		.attr("offset", "0%")
		.attr("stop-color", function (d) {
			return d;
		});
	this.gradient.append("stop")
		.attr("offset", "30%")
		.attr("stop-color", function (d) {
			return d;
		})
		.attr("stop-opacity", 1);
	this.gradient.append("stop")
		.attr("offset", "70%")
		.attr("stop-color", function (d) {
			return "white";
		})
		.attr("stop-opacity", 1);
	this.pathD = function (radius) {
		return (function (d) {
			return d3.arc().outerRadius(radius).innerRadius(0)(d);
		});
	}

};

PieChart.prototype.render = function (method) {
	if (method)
		this.method = method;
	this.createSVG();
	this.addSample();
	if (this.method)
		this.method();

	var mouseover = function (data) {
		return (function (d, i) {

			d3.select(this).style("stroke-width", 5).style("stroke", "blue");
			d3.select("body")
				.append("div").attr("class", "info").style("left", d3.event.pageX + "px").style("top", d3.event.pageY + "px") //.style("position","absolute")
				.html(data[i].country + "<br>" + data[i].counts);
		});
	}

	this.g.selectAll("g")
		.data(this.pie(this.data))
		.enter()

		.append("path")
		.attr("id", function (d, i) {
			return "pieseg" + i;
		})
		.attr("fill", function (d, i) {
			return "url(#gradient" + i + ")";
		})
		.attr("d", this.pathD(this.radius) /*function(d){console.log(d);return d3.arc().outerRadius(this.radius).innerRadius(0)(d);}*/ )
		.each(function (d) {
			this._current = d;
		})
		.on("mouseover", mouseover(this.data))
		.on("mouseout", function (d, i) {
			console.log(i);
			d3.select(this).style("stroke-width", 0);
			d3.select(".info").remove()
		});

};


var BarDiagram = function () {
	ChartDiagram.call(this);
	this.xAxis;
	this.yAxis;
	this.cx;
	this.cy;
	this.bHeight;
	this.changeColor;
	this.id;
	this.haveSample = false;
};

BarDiagram.prototype = Object.create(ChartDiagram.prototype);
BarDiagram.prototype.constructor = BarDiagram;


BarDiagram.prototype.yearly = function () {
	this.xAxis = d3.scaleBand().rangeRound([0, this.gWidth()]).padding(0.2);
	this.yAxis = d3.scaleLinear().rangeRound([this.gHeight(), 0]);
	this.xAxis.domain(this.data.map(function (d) {
		return d.month
	}));
	this.yAxis.domain([0, d3.max(this.data, function (d) {
		return d.counts;
	})]);

	this.cx = function (callback) {
		return (function (d) {
			return callback(d.month);
		});
	};

	this.cy = function (callback) {
		return (function (d) {
			return callback(d.counts);
		});
	};
	this.bHeight = function (groupHeight, callback) {
		return (function (d) {
			return groupHeight - callback(d.counts);
		})
	};

	this.changeColor = function (color) {
		return (
			function (d) {
				d3.select("#" + d.month)
					.attr("fill", color);
				
				if (!d3.select("body").select(".info").empty()) {
					d3.select("body").select(".info").remove()
				} else {
					d3.select("body")
						.append("div").attr("class", "info")
						.style("left", d3.event.pageX + "px")
						.style("top", d3.event.pageY + "px")
						.html(d.counts+" times");
				}
			}
		)
	};
	this.id = function (d) {
		return d.month;
	};
	this.xHeader = "Month";
	this.yHeader = "Counts";
};

BarDiagram.prototype.seasonal = function () {
	this.xAxis = d3.scaleBand().rangeRound([0, this.gWidth()]).padding(0.2);
	this.yAxis = d3.scaleLinear().rangeRound([this.gHeight(), 0]);
	this.xAxis.domain(this.data.map(function (d) {
		return d.dayrange
	}));
	this.yAxis.domain([0, d3.max(this.data, function (d) {
		return d.counts;
	})]);

	this.cx = function (callback) {
		return (function (d) {
			return callback(d.dayrange);
		});
	};

	this.cy = function (callback) {
		return (function (d) {
			return callback(d.counts);
		});
	};
	this.bHeight = function (groupHeight, callback) {
		return (function (d) {
			return groupHeight - callback(d.counts);
		})
	};

	this.changeColor = function (color) {
		return (
			function (d, i) {
				if (d)
					console.log(d3.select("body").select(".info").empty());
				d3.select("#seasonalbar" + i)
					.attr("fill", color);
				if (!d3.select("body").select(".info").empty()) {
					d3.select("body").select(".info").remove()
				} else {
					d3.select("body")
						.append("div").attr("class", "info")
						.style("left", d3.event.pageX + "px")
						.style("top", d3.event.pageY + "px")
						.html(d.counts+" times");
				}
			}
		)
	};
	this.id = function (d, i) {
		return "seasonalbar" + i;
	};
	this.xHeader = "Day Range";
	this.yHeader = "Counts";
}

BarDiagram.prototype.render = function (method) {
	if (method)
		this.method = method;
	console.log(this.haveSample)
	var g = this.createSVG();
	var groupHeight = this.gHeight();
	var groupWidth = this.gWidth();
	if (this.method)
		this.method();

	g.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + groupHeight + ")")
		.call(d3.axisBottom(this.xAxis))

	g.append("g")
		.attr("class", "axis axis--y")
		.call(d3.axisLeft(this.yAxis))
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("dy", "0.71rem")
		.attr("text-anchor", "end")
		.text("counts");


	g.selectAll(".bar").data(this.data)
		.enter()
		.append("rect")
		.attr("class", "bar")
		.attr("id", this.id)
		.attr("x", this.cx(this.xAxis)) //function(d){return x(d.month);})
		.attr("y", this.cy(this.yAxis)) //function(d){return y(d.counts);})
		.attr("width", this.xAxis.bandwidth())
		.attr("height", this.bHeight(groupHeight, this.yAxis)) //function(d){ return groupHeight-y(d.counts);})
		.attr("fill", this.color)
		.on("mouseover", this.changeColor("red"))
		.on("mouseout", this.changeColor(this.color));


}