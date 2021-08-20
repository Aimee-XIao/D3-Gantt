<template>
  <y-form-model  ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout">
      <template v-for="item in list">
        <y-form-model-item :key="item.key" has-feedback :label="item.label" :prop="item.placehilder">
           <y-input v-if="item.type === 'text'" :placeholder="item.placeholder" :disabled="item.disabled" v-model="ruleForm[item.key]" :type="item.type"  />
           <y-date-picker
              v-else-if="item.type === 'datePicker'"
              :placeholder="item.placeholder"
              :showTime="{ format: 'HH:mm' }"
              :disabledDate="disabledDate"
              format="YYYY-MM-DD HH:mm"
              v-model="ruleForm[item.key]"

        />
          <y-radio-group  v-else-if="item.type === 'radio'" @change="handleChange($event, item)" name="radioGroup" :defaultValue="'Y'">
            <y-radio v-for="(ite, ind) in item.arr" :value="ite.isNear" :key="ind" >{{ ite.label }}</y-radio>
          </y-radio-group>
          <y-select
            v-else-if="item.type === 'select'"
            showSearch
            v-model="ruleForm[item.key]"
            placeholder="请选择"
            optionFilterProp="children"
            style="width: 200px"
            @focus="handleFocus"
            @blur="handleBlur"
            @change="handleChange($event, item)"
            :filterOption="filterOption"
          >
            <y-select-option v-for="(ite, ind) in item.arr" :value="ite.seat" :key="ind">{{ ite.seatName }}</y-select-option>
          </y-select>

        </y-form-model-item>

      </template>
    <y-form-model-item style="text-align: right" :wrapper-col="{ span: 14, offset: 4 }">
      <y-button type="primary" @click="submitForm('ruleForm')">
        提交
      </y-button>
      <y-button style="margin-left: 10px" @click="resetForm('ruleForm')">
        关闭
      </y-button>
    </y-form-model-item>
  </y-form-model>
</template>
<script>
import moment from "moment-mini";
export default {
  props:['list','formData'],
  data() {
    let checkPending;
    let checkAge = (rule, value, callback) => {
      clearTimeout(checkPending);
      if (!value) {
        return callback(new Error('Please input the age'));
      }
      checkPending = setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('Please input digits'));
        } else {
          if (value < 18) {
            callback(new Error('Age must be greater than 18'));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password again'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("Two inputs don't match!"));
      } else {
        callback();
      }
    };
    return {
      rules: {
        pass: [{ validator: validatePass, trigger: 'change' }],
        checkPass: [{ validator: validatePass2, trigger: 'change' }],
        age: [{ validator: checkAge, trigger: 'change' }],
      },
      ruleForm:{},
      layout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
      },
    };
  },
  mounted() {
    console.log('-----------------------', this.formData)
      this.$set(this, 'ruleForm', JSON.parse(JSON.stringify(this.formData)))
  },
  methods: {
    disabledDate(current) {
      // Can not select days before today and today
      return current && current < moment('2021-08-10').endOf('day')
    },


    handleChange ($event, item) {
      console.log($event, item)

    },
    handleBlur() {
      console.log('blur');
    },
    handleFocus() {
      console.log('focus');
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if(this.ruleForm.ete && moment(this.ruleForm.ete).diff(moment(this.ruleForm.std),'minutes') < 0) {
            this.$message.error('结束运行时间不能小于开始运行时间')
            return
          }

          this.$emit('submit', this.ruleForm)
          console.log('=================', this.ruleForm)
        } else {
          console.log('error submit!!');
          return false;
        }
      });

    },
    resetForm(formName) {
      this.ruleForm = {}
      // this.$refs[formName].resetFields();
      this.$emit('cancle')
    },
  }
}
</script>
