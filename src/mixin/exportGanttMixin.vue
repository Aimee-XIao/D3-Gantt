<script>
export default {
  data () {
    return {
      exportVisible: false
    }
  },
  methods: {
    openExportDialog () {
      this.$set(this, 'exportVisible', true)
    },
    closeExportDialog () {
      this.$set(this, 'exportVisible', false)
    }
  }
}
</script>
