<template>
 <div>
   <y-select v-model="terminals"  placeholder="Tags Mode" style="width: 120px;float: left;" @change="handleChange">
     <y-select-option v-for="(ite, ind) in terminal" :value="ite.ter" :key="ind">{{ ite.label }}</y-select-option>
   </y-select>
   <div id="bar" > </div>
 </div>
</template>

<script>
import '../gantt-chart-d3'
import moment  from "moment-mini";
export default {
  name: "d3-gantt",
  data() {
    return {
      terminals: null,
      terminal:[{
        ter: "T1",
        label: '国内 T1'
      },
        {
          ter: "T2",
          label: '国内 T2'
        },
        {
          ter: "T3",
          label: '国际 T3'
        }],
      tasks:[
        {"startDate":new Date("2021-08-10 04:00:00"),"endDate":new Date("2021-08-10 06:00:00"),"taskName":"L-01","status":"RUNNING"},
        {"startDate":new Date("2021-08-09 24:00:00"),"endDate":new Date("2021-08-10 03:00:00"),"taskName":"L-02","status":"RUNNING"},
        {"startDate":new Date("2021-08-10 01:00:00"),"endDate":new Date("2021-08-10 04:00:00"),"taskName":"L-03","status":"FAILED"},
        {"startDate":new Date("2021-08-10 12:00:00"),"endDate":new Date("2021-08-10 16:00:00"),"taskName":"L-07","status":"RUNNING"},
        {"startDate":new Date("2021-08-10 05:00:00"),"endDate":new Date("2021-08-10 10:00:00"),"taskName":"L-10","status":"SUCCEEDED"},
        {"startDate":new Date("2021-08-10 04:00:00"),"endDate":new Date("2021-08-10 06:00:00"),"taskName":"L-11","status":"KILLED"},
        {"startDate":new Date("2021-08-09 24:00:00"),"endDate":new Date("2021-08-10 03:00:00"),"taskName":"L-14","status":"RUNNING"},
        {"startDate":new Date("2021-08-10 01:00:00"),"endDate":new Date("2021-08-10 04:00:00"),"taskName":"L-15","status":"FAILED"},
        {"startDate":new Date("2021-08-10 12:00:00"),"endDate":new Date("2021-08-10 16:00:00"),"taskName":"L-16","status":"RUNNING"},
        {"startDate":new Date("2021-08-10 05:00:00"),"endDate":new Date("2021-08-10 10:00:00"),"taskName":"L-19","status":"SUCCEEDED"},
        ],
      taskNames:[ "L-01", "L-02", "L-03", "L-07", "L-08","L-10","L-11","L-12","L-13","L-14","L-15","L-16","L-17","L-18","L-19"],
      taskStatus: {
        "SUCCEEDED" : "bar",
        "FAILED" : "bar-failed",
        "RUNNING" : "bar-running",
        "KILLED" : "bar-killed"
      }

    }
  },


  mounted() {
    this.example()
  },
  methods: {
    handleChange(value) {
    },
    example() {

      this.tasks.sort(function(a, b) {
        return a.endDate - b.endDate;
      });
      var maxDate = this.tasks[this.tasks.length - 1].endDate;
      this.tasks.sort(function(a, b) {
        return a.startDate - b.startDate;
      });
      var minDate = this.tasks[0].startDate;

      var format = "%H:%M";

      var gantt = this.$d3.gantt().taskTypes(this.taskNames).taskStatus(this.taskStatus).tickFormat(format);
      gantt(this.tasks);
      this.example.addTask = function() {

        var lastEndDate = Date.now();
        if (this.tasks.length > 0) {
          lastEndDate = this.tasks[this.tasks.length - 1].endDate;
        }

        var taskStatusKeys = Object.keys(this.taskStatus);
        var taskStatusName = taskStatusKeys[Math.floor(Math.random()*taskStatusKeys.length)];
        var taskName = this.taskNames[Math.floor(Math.random()*this.taskNames.length)];

        this.tasks.push({"startDate":this.$d3.time.hour.offset(lastEndDate,Math.ceil(1*Math.random())),"endDate":this.$d3.time.hour.offset(lastEndDate,(Math.ceil(Math.random()*3))+1),"taskName":taskName,"status":taskStatusName});
        gantt.redraw(this.tasks);
      };

      this.example.removeTask = function() {
        this.tasks.pop();
        gantt.redraw(this.tasks);
      };
    }
  }
};
</script>

<style scoped>

.chart {
  font-family: Arial, sans-serif;
  font-size: 12px;
}

.scroll {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.axis path,.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

rect {
  height: 50px;
}
.bar {
  fill: #33b5e5;
}

.bar-failed {
  fill: #CC0000;
}

.bar-running {
  fill: #669900;
}

.bar-succeeded {
  fill: #33b5e5;
}

.bar-killed {
  fill: #ffbb33;
}

#forkme_banner {
  display: block;
  position: absolute;
  top: 0;
  right: 10px;
  z-index: 10;
  padding: 10px 50px 10px 10px;
  color: #fff;
  background:
    url('http://dk8996.github.io/Gantt-Chart/images/blacktocat.png')
    #0090ff no-repeat 95% 50%;
  font-weight: 700;
  box-shadow: 0 0 10px rgba(0, 0, 0, .5);
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
  text-decoration: none;
}

#twittme_banner {
  display: block;
  position: absolute;
  top: 0;
  right: 180px;
  z-index: 10;
  padding: 10px 50px 10px 10px;
  color: #fff;
  background:
    url('http://dk8996.github.io/Gantt-Chart/images/twitter.png')
    #0090ff no-repeat 95% 50%;
  font-weight: 700;
  box-shadow: 0 0 10px rgba(0, 0, 0, .5);
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
  text-decoration: none;
}

</style>
