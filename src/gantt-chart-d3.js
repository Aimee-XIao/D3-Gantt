/**
 * @author Dimitry Kudrayvtsev
 * @version 2.1
 */
import * as d3 from 'd3'
d3.gantt = function() {
    var FIT_TIME_DOMAIN_MODE = "fit";
    var FIXED_TIME_DOMAIN_MODE = "fixed";

    var margin = {
	top : 30,
	right : 30,
	bottom : 30,
	left : 60
    };
    var selector = '#bar';
    var timeDomainStart = d3.time.day.offset(new Date(),-3);
    var timeDomainEnd = d3.time.hour.offset(new Date(),+3);
    var timeDomainMode = FIT_TIME_DOMAIN_MODE;// fixed or fit
    var taskTypes = [];
    var taskStatus = [];
    var height = taskTypes.length ? (taskTypes.length * 30 - margin.top - margin.bottom-5) : (1000 - margin.top - margin.bottom-5);
    var width = 1500

    var tickFormat = "%H:%M";

    var keyFunction = function(d) {
	return d.startDate + d.taskName + d.endDate;
    };

    var rectTransform = function(d) {
    	console.log(y(d.taskName))
	return "translate(" + x(d.startDate) + "," + y(d.taskName) + ")";
			// return "translate(" +100 + "," + 200 + ")"
    };

    var x = d3.time.scale().domain([ timeDomainStart, timeDomainEnd ]).range([ 0, width ]).clamp(true);

    var y = d3.scale.ordinal().domain(taskTypes).rangeRoundBands([ 0, taskTypes.length * 60], 0.01);

    var xAxis = d3.svg.axis().scale(x).orient("top").tickFormat(d3.time.format(tickFormat)).tickSubdivide(true)
	    .tickSize(8).tickPadding(8);

    var yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);

    var initTimeDomain = function(tasks) {
	if (timeDomainMode === FIT_TIME_DOMAIN_MODE) {
	    if (tasks === undefined || tasks.length < 1) {
		timeDomainStart = d3.time.day.offset(new Date(), -3);
		timeDomainEnd = d3.time.hour.offset(new Date(), +3);
		return;
	    }
	    tasks.sort(function(a, b) {
		return a.endDate - b.endDate;
	    });
	    timeDomainEnd = new Date("2021-08-10 24:00:00");
	    tasks.sort(function(a, b) {
		return a.startDate - b.startDate;
	    });
	    timeDomainStart = new Date("2021-08-09 24:00:00");
	}
    };

    var initAxis = function() {
	x = d3.time.scale().domain([ timeDomainStart, timeDomainEnd ]).range([ 0, width ]).clamp(true);
	y = d3.scale.ordinal().domain(taskTypes).rangeRoundBands([ 0, taskTypes.length * 50]);
	xAxis = d3.svg.axis().scale(x).orient("top").tickFormat(d3.time.format(tickFormat)).tickSubdivide(true)
		.tickSize(8).tickPadding(8)

	yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);
    };

    function gantt(tasks) {

	initTimeDomain(tasks);
	initAxis();

	var svg = d3.select(selector)
	.append("svg")
	.attr("class", "chart")
	.attr("width", width + margin.left + margin.right)
	.attr("height", 825)
	.append("g")
        .attr("class", "gantt-chart")
	.attr("width", 1500)
	.attr("height", 825)
	.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

		var area = 	svg.append("foreignObject")
			.attr("class", "chat-area")
			.attr("width", 1480)
			.attr("height", 780)

    area.html("<div class='scroll'></div>")

    var areaBox = area.selectAll(".scroll")
			.append("svg")
			.attr("width", 7000)
			.attr("height", 800)

			areaBox.selectAll(".rect")
			.data(taskTypes)
				.enter()
				.append("rect")
			.attr("width", width)
			.attr("height", height - margin.top - margin.bottom)
				.attr("margin", 10)
			.attr({
				"stroke": "#ccc",
				"fill": "none",
				"stroke-width": 1
			})
				.attr("transform", function(d){return  "translate(0,"+ y(d) +")"})

			areaBox.selectAll(".chart")
	 .data(tasks, keyFunction).enter()
	 .append("rect")

	 .attr("rx", 5)
         .attr("ry", 5)
	 .attr("class", function(d){
	     if(taskStatus[d.status] == null){ return "bar";}
	     return taskStatus[d.status];
	     })
	 .attr("y", 0)
	 .attr("transform", rectTransform)
	 .attr("height", function(d) { return 30 })
	 .attr("width", function(d) {
	     return Math.max(1,(x(d.endDate) - x(d.startDate)));
	     });


	 svg.append("g")
	 .attr("class", "x axis")
	 .attr("transform", "translate(0, 0)")
	 .transition()
	 .call(xAxis);

	 svg.append("g").attr("class", "y axis").transition().call(yAxis);

	 return gantt;

    };

  gantt.redraw = function(tasks) {

	initTimeDomain(tasks);
	initAxis();

        var svg = d3.select(".chart");

        var ganttChartGroup = svg.select(".gantt-chart");
        var rect = ganttChartGroup.selectAll("rect").data(tasks, keyFunction);

        rect.enter()
         .insert("rect",":first-child")
         .attr("rx", 5)
         .attr("ry", 5)
	 .attr("class", function(d){
	     if(taskStatus[d.status] == null){ return "bar";}
	     return taskStatus[d.status];
	     })
	 .transition()
	 .attr("y", 0)
	 .attr("transform", rectTransform)
	 .attr("height", function(d) { return y.rangeBand(); })
	 .attr("width", function(d) {
	     return Math.max(1,(x(d.endDate) - x(d.startDate)));
	     });



        rect.transition()
          .attr("transform", rectTransform)
	 .attr("height", function(d) { return y.rangeBand(); })
	 .attr("width", function(d) {
	     return Math.max(1,(x(d.endDate) - x(d.startDate)));
	     });

	rect.exit().remove();

	svg.select(".x").transition().call(xAxis);
	svg.select(".y").transition().call(yAxis);

	return gantt;
    };
  gantt.margin = function(value) {
	if (!arguments.length)
	    return margin;
	margin = value;
	return gantt;
    };
  gantt.timeDomain = function(value) {
	if (!arguments.length)
	    return [ timeDomainStart, timeDomainEnd ];
	timeDomainStart = +value[0], timeDomainEnd = +value[1];
	return gantt;
    };
    /**
     * @param {string}
     *                vale The value can be "fit" - the domain fits the data or
     *                "fixed" - fixed domain.
     */
    gantt.timeDomainMode = function(value) {
	if (!arguments.length)
	    return timeDomainMode;
        timeDomainMode = value;
        return gantt;

    };

    gantt.taskTypes = function(value) {
	if (!arguments.length)
	    return taskTypes;
   	taskTypes = value;
	return gantt;
    };

    gantt.taskStatus = function(value) {
	if (!arguments.length)
	    return taskStatus;
	taskStatus = value;
	return gantt;
    };

    gantt.width = function(value) {
	if (!arguments.length)
	    return width;
	width = +value;
	return gantt;
    };

    gantt.height = function(value) {
	if (!arguments.length)
	    return height;
	height = +value;
	return gantt;
    };

    gantt.tickFormat = function(value) {
	if (!arguments.length)
	    return tickFormat;
	tickFormat = value;
	return gantt;
    };

    gantt.selector = function(value) {
	if (!arguments.length)
	    return selector;
	selector = value;
	return gantt;
    };
    return gantt;
};
