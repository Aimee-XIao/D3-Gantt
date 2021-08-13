<template>
  <div>
    <div class="title">
      <img style="width: 32px;height: 32px;" src="../assets/plane.png" alt="">
      {{ propData.title }}
    </div>
    <div class="content">
      <ul>
        <li v-for="(val, key, index) in propData.flgMsg" class="content-item" :key="index">
          <div class="content-item-box" v-if=" key == 'flightNo' ">
            <p>航班号</p>
            <p>{{ val }}</p>
          </div>
          <div class="content-item-box" v-if=" key == 'line' ">
            <p>状态</p>
            <p>{{ val }}</p>
          </div>
          <div class="content-item-box" v-if=" key == 'lugNo' ">
            <p>行李转盘号</p>
            <p>{{ val }}</p>
          </div>
          <div class="content-item-box" v-if=" key == 'sta' ">
            <p>计划开始运行时间</p>
            <p>{{ val }}</p>
          </div>
          <div class="content-item-box" v-if=" key == 'ata' ">
            <p>计划停止运行时间</p>
            <p>{{ val }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import moment from "moment-mini"
export default {
  name: "flightMsg",
  props: {
    propData: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
}
</script>

<style  lang="scss">
.title {
  padding: 30px 20px 20px 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: bold;
  font-size: 20px;
  img {
    margin-right: 20px;
  }
}
.content {
  margin-top: 20px;
  ul {
    list-style: none;
    .content-item {
      //display: flex;
      //justify-content: space-between;
      //align-items: center;
      //padding: 14px;
      .content-item-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px;
      }
      &:nth-of-type(odd) {
        background-color: rgb(177, 223, 246);
      }
      &:nth-of-type(even) {
        background-color: rgb(198, 229, 245);
      }
    }
  }
}
</style>
