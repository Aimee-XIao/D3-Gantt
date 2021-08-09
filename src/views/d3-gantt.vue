<template>
 <div id="bar">

 </div>
</template>

<script>
import moment  from "moment-mini";
export default {
  name: "d3-gantt",
  data() {
    return {
      lubList: [
        {
          lugNo: '04',
          flight: 'Mu2305',
          start: "2021-07-05 11:00",
          end: '2021-07-06 12:00',
          num: 25
        },
        {
          lugNo: '05',
          flight: 'Mu2305',
          start: "2021-07-05 11:00",
          end: '2021-07-06 12:00',
          num: 40
        }
      ],
      list: [
        {
          age: 10,
          num: 520
        },
        {
          age: 12,
          num: 100
        },
        {
          age: 15,
          num: 150
        },
        {
          age: 16,
          num: 200
        },
        {
          age: 17,
          num: 150
        }
      ],
      width : 1534,
      height: 500,
      margin : { left : 30, top: 30, right: 30, bottom: 30},
      barWidth :50,
      barHeight: 50,
      barPadding: 10,

    }
  },
  computed: {
    svgHeight() {
      return this.height + this.margin.top + this.margin.bottom
    },
    svgWidth() {
      return this.width + this.margin.left + this.margin.right
    }
  },
  mounted() {
    this.draw()
  },
  methods: {
    draw() {
      var svg = this.$d3.select("#bar")
        .append("svg")
        .attr("width", this.svgWidth)
        .attr("height", this.svgHeight)

      var scale = this.$d3.scale.linear()
        .domain([0,this.$d3.max(this.list, function (d){ return d.num})])
        .range([this.height, 0])

      var scale_x = this.$d3.scale.ordinal()
        .domain([0, this.list.map(function(d) { return d.age; })])
        .rangeBands([0,this.width], 0.1);
      var chart = svg.append("g")
        .attr("transform", "translate("+ this.margin.left + ","+ this.margin.top + ")")

      var x_axis = this.$d3.svg.axis().scale(scale_x),
        y_axis = this.$d3.svg.axis().scale(scale).orient("left")

      chart.append("g")
        .call(x_axis)
        .attr("transform", "translate(0,"+ this.height +")")

      chart.append("g")
        .call(y_axis)
        .attr("transform", "translate(5,0)")
      var that = this
      var bar =  chart.selectAll(".item")
        .data(this.list)
        .enter()
        .append("g")
        .attr("class", "item")
        .attr("transform", function(d, i){return "translate(0,"+ i * (that.barPadding + that.barHeight)+")"})


      bar.append("rect")
        .attr("height", 50)
        .attr("width", function (d){return scale_x(d.age)})
        .attr("fill", "gray")

      bar.append("text")
        .text(function (d){return d.num})
        .attr("y", function (d){return scale(d.num)})
        .attr("x", scale_x.rangeBand() / 2)
        .attr("text-anchor", "end")
        .attr("dy", 15)

    }
  }
};
</script>

<style>
.domain, .tick line{
  stroke: gray;
  fill: none;
  stroke-width: 1;
}
</style>
