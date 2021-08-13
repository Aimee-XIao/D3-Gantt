<template>
  <g ref="categoryAxis" class="categoryAxisGroup"></g>
</template>

<script>
export default {
  name: "yAxis",
  props: ["series"],
  data() {
    return {
      categotyMemberGroup: null,
      html: "<line ref='rowLine' class='rowLine' style='stroke: #e0e0e0; stroke-width: 1'></line><g class='categotyMemberGroup'><rect class='categoryBlock'/><text class='categoryLabel' style=' fill: rgb(51, 51, 51); text-anchor: middle;dominant-baseline: middle; font-weight: bold;'/><line class='rowLine' style='stroke: #e0e0e0; stroke-width: 1'></line> </g>",
      yAxis: {
        transStyle: {
          width: 130,
          height: 40,
        },
        fontStyle: {
          fontSize: 14,
        },
        boundaryGap: [0, 0],
        top: 50,
        bottom: 20,
        margin: [0.5],
        height: 7280,
      },
    };
  },
  mounted() {
    this.draw(this.series);
  },
  computed: {
    topY() {
      return function (i) {
        return i * this.yAxis.transStyle.height;
      };
    },
    margin() {
      let val = this.yAxis.margin || [];
      let margins = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      };
      switch (val.length) {
        case 1:
          margins = {
            top: val[0],
            right: val[0],
            bottom: val[0],
            left: val[0],
          };
          break;
        case 2:
          margins = {
            top: val[0],
            right: val[1],
            bottom: val[0],
            left: val[1],
          };
          break;
        case 3:
          margins = {
            top: val[0],
            right: val[1],
            bottom: val[2],
            left: val[1],
          };
          break;
        case 4:
          margins = {
            top: val[0],
            right: val[1],
            bottom: val[2],
            left: val[3],
          };
          break;
      }
      return margins;
    },
  },
  watch: {
    series: {
      handler(newData) {
        this.draw(newData);
      },
      deep: true,
    },
  },
  methods: {
    draw(data) {
      this.$nextTick(() => {
        if (this.$refs.categoryAxis) {
          this.$refs.categoryAxis.innerHTML = this.html;
        }
        this.categotyMemberGroup = this.$refs.categoryAxis.querySelector(
          ".categotyMemberGroup"
        );
        if (this.$refs.rowLine) {
          this.$d3
            .select(this.$refs.rowLine)
            .attr("x1", this.margin.left)
            .attr("y1", 0)
            .attr("x2", this.yAxis.transStyle.width - this.margin.right)
            .attr("y2", 0);
        }
        let memberGroup, block;
        for (let i = 0; i < data.length; i++) {
          let obj = data[i];
          let info = obj.standNo;
          let id = obj.standNo;
          let topY = this.topY(i) + this.yAxis.boundaryGap[0];
          memberGroup = this.categotyMemberGroup.cloneNode(true);
          this.$refs.categoryAxis.appendChild(memberGroup);
          block = memberGroup.querySelector(".categoryBlock");
          this.$d3
            .select(memberGroup)
            .attr("id", "m" + id)
            .attr("transform", `translate(0, ${topY})`)
            .attr("width", this.yAxis.transStyle.width)
            .attr("height", this.yAxis.transStyle.height);
          let clickBlock = this.clickBlock;
          this.$d3
            .select(block)
            .attr("transform", `translate(${this.margin.left}, 0)`)
            .attr(
              "width",
              this.yAxis.transStyle.width - this.margin.left - this.margin.right
            )
            .attr(
              "height",
              this.yAxis.transStyle.height -
                this.margin.top -
                this.margin.bottom
            )
            .attr("fill", function () {
              return i % 2 == 0 ? "#b1dff6" : "#c6e5f5";
            })
            .attr("stroke-width", 0)
            .on("click", function () {
              if (obj.dataArray.length) {
                clickBlock(block, obj.dataArray[0]);
              }
            });

          let label = memberGroup.querySelector(".categoryLabel");
          this.$d3
            .select(label)
            .attr(
              "transform",
              `translate(${this.yAxis.transStyle.width / 2}, ${
                this.yAxis.transStyle.height / 2
              })`
            )
            .attr("font-size", this.yAxis.fontStyle.fontSize)
            .text(info);

          this.$d3
            .select(memberGroup.querySelector(".rowLine"))
            .attr("x1", this.margin.left)
            .attr("y1", this.yAxis.transStyle.height - this.margin.bottom)
            .attr("x2", this.yAxis.transStyle.width - this.margin.right)
            .attr("y2", this.yAxis.transStyle.height - this.margin.bottom);
        }
      });
    },
    clickBlock(block, obj) {
      console.log("obj", obj);
      this.$emit("clickBlock", obj);
    },
  },
};
</script>

<style scoped>
.categoryAxisGroup {
  user-select: none;
}
</style>
