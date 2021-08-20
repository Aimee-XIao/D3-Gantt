<template>
<div class="menuBox" :style="{top: top, left: left}">
 <ul>
   <li  v-for="(item,index) in config" :key="index" @click="openConfig(item, index)" >
   <p v-if="index == 0" style="width: 100%; padding: 10px;
      box-sizing: border-box;">{{ item.title}}</p>
   <p v-if="index == 1" style="width: 100%; padding: 10px;
      box-sizing: border-box;" :class="isFinsh? '': 'disabled'">{{ item.title}}</p></li>
 </ul>
</div>
</template>

<script>
export default {
  name: "fightContent",
  props: ['selfStyle', 'currentObj'],
  data() {
    return {
      isFinsh: false,
      top: 0,
      left: 0,
      config: [
        {
          title: '机位配置',
          id: '01'
        },
        {
          title: '运行时间配置',
          id: '02'
        }
      ]
    }
  },
  mounted() {
    this.$nextTick(() => {
      if(this.currentObj.dataArray.length < 1) {
        this.isFinsh = true
      }

      this.top = this.selfStyle.top - 15 + 'px'
      this.left =  this.selfStyle.left + 'px'
    })
  },
  methods: {
    openConfig(item, index) {
      if(!this.isFinsh && index == 1) return
      this.$emit('config', item)
    }
  }
};
</script>

<style scoped lang="scss">

.menuBox {
  width: 160px;
  position: absolute;
  z-index: 333;
  background-color: #fff;
  border-radius: 6px;
  ul {
    width: 100%;
    margin: 0;
    list-style: none;
    li {
      width: 100%;
      text-align: left;

      cursor: pointer;
      border-bottom: 1px solid #ececec;
    }
    .disabled {
      background: #ececec;
      color: #bdb9b9;
      border-bottom: 1px solid #ffffff;
  }
    .disabled:last-of-type {
      border-bottom: 1px solid #ececec;
    }
  }
}
</style>
