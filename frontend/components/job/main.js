import chart from './chart'

export default {
  name: 'job',
  data () {
    return {
      job: '',
      jobData: '',
      build: ''
    }
  },
  methods: {
    listSetWidth: function () {
      this.setWidth([
        {from: 'build-list-from', to: 'build-list-to'}
      ])
    },
    setWidth: function (elems) {
      // debounce
      let self = this
      clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(function () {
        elems.forEach(elemSet => {
          if (document.getElementById(elemSet.from)) {
            let fromWidth = document.getElementById(elemSet.from).offsetWidth
            let fromHeight = document.getElementById(elemSet.from).offsetHeight
            let to = document.getElementById(elemSet.to)
            to.setAttribute('style',
              `width: ${fromWidth}px;
               height: ${window.innerHeight - fromHeight}px`
            )
            chart(self.jobData, self.$route.params.name, 'redraw', self)
          }
        })
      }, 100)
    }
  },
  filters: {
    underscoresFilter: function (str) {
      if (!str) return ''
      str = str.toString()
      str = str.replace(/_/g, ' ')
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  updated: function () {
    this.listSetWidth()
  },
  mounted: function () {
    let self = this
    window.addEventListener('resize', this.listSetWidth)
    this.$http.get('/api/builds-list/' + this.$route.params.name, {})
      .then(rows => {
        chart(rows.body, this.$route.params.name, self)
        this.jobData = rows.body
        this.listSetWidth()
      })
  },
  watch: {
    '$route' (to, from) {
      let self = this
      if (to.params.name !== from.params.name) {
        this.$http.get('/api/builds-list/' + to.params.name, {})
          .then(rows => {
            chart(rows.body, to.params.name, self)
            this.jobData = rows.body
          })
      }
    }
  }
}
