export default {
  name: 'job_list',
  data () {
    return {
      job_list: '[]'
    }
  },
  methods: {
  },
  mounted: function () {
    this.$nextTick(function () {
      this.$http.get('/api/job-list')
        .then(rows => {
          this.job_list = rows.body
        })
    })
  }
}
