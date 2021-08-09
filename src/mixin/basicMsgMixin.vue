<script>
export default {
  methods: {
    showSuccess (info, tip) {
      let msg = info || '操作'
      this.$message.info({
        iconClass: 'a',
        customClass: 'msg-success',
        duration: 1500,
        dangerouslyUseHTMLString: true,
        message: `
          <div class="msg-box-cont show-success">
            <div class="msg-deco"></div>
            <div class="msg-font"><p>` + msg + `成功 !</p>${tip ? ('<p>' + tip + '</p>') : ''}</div>
            <div class="msg-deco"></div>
          </div>`
      })
    },
    showWarning (info, tip) {
      let msg = info || '操作'
      this.$message.info({
        iconClass: 'a',
        customClass: 'msg-warning',
        duration: 1500,
        dangerouslyUseHTMLString: true,
        message: `
          <div class="msg-box-cont show-warning">
            <div class="msg-deco"></div>
            <div class="msg-font"><p>` + msg + `异常 !</p>` + (tip ? ('<p>' + tip + '</p>') : '') + `</div>
            <div class="msg-deco"></div>
          </div>`
      })
    },
    showWarningCustom (info, tip, dur) {
      let msg = info || '操作'
      this.$message.info({
        iconClass: 'a',
        customClass: 'msg-warning',
        duration: dur === 0 ? dur : 1500,
        dangerouslyUseHTMLString: true,
        message: `
          <div class="msg-box-cont show-warning">
            <div class="msg-deco"></div>
            <div class="msg-font"><p>` + msg + `</p>` + (tip ? ('<p>' + tip + '</p>') : '') + `</div>
            <div class="msg-deco"></div>
          </div>`
      })
    },
    showError (info, tip) {
      let msg = info || '操作'
      this.$message.info({
        iconClass: 'a',
        customClass: 'msg-error',
        duration: 1500,
        dangerouslyUseHTMLString: true,
        message: `
          <div class="msg-box-cont show-error">
            <div class="msg-deco"></div>
            <div class="msg-font"><p>` + msg + `失败 !</p>` + (tip ? ('<p>' + tip + '</p>') : '') + `</div>
            <div class="msg-deco"></div>
          </div>`
      })
    },
    showErrorCustom (info, tip, dur) {
      let msg = info
      this.$message.info({
        iconClass: 'a',
        customClass: 'msg-error',
        duration: dur === 0 ? dur : 1500,
        dangerouslyUseHTMLString: true,
        message: `
          <div class="msg-box-cont show-error">
            <div class="msg-deco"></div>
            <div class="msg-font"><p>` + msg + `</p>` + (tip ? ('<p>' + tip + '</p>') : '') + `</div>
            <div class="msg-deco"></div>
          </div>`
      })
    },
    showInfo (info) {
      this.$message.info(info)
    }
  }
}
</script>
