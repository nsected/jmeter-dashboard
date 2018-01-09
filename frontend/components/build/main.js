import barChart from './BarChart'
import donut from './donut'
export default {
  name: 'build',
  data () {
    return {
      job: '',
      buildData: '',
      build: '',
      elapsedAvg: '',
      errPercentage: '',
      testTime: ''
    }
  },
  filters: {
    dateFilter: function (str) {
      return str.slice(0, 10)
    }
  },
  methods: {
    listSetWidth: function () {
      this.setWidth([
        {from: 'build-item-from', to: 'build-item-to'}
      ])
    },
    setWidth: function (elems) {
      let self = this
      // debounce
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
            barChart(self.buildData)
            donut(self.buildData)
            self.buildStats(self.buildData)
          }
        })
      }, 100)
    },
    buildStats: function (data) {
      function round (value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
      }
      function diffMinutes (dt1, dt2) {
        return round((dt2 - dt1) / 60000, 0)
      }

      let allTime = 0
      let errCount = 0
      data.forEach(req => {
        allTime += req.elapsed_time
        errCount += req.error_flag
      })
      this.errPercentage = round((100 * errCount / data.length), 1)
      this.elapsedAvg = parseInt(allTime / data.length)
      let dt1 = new Date(data[0].time_stamp)
      let dt2 = new Date(data[data.length - 1].time_stamp)
      this.testTime = diffMinutes(dt1, dt2)
    }
  },
  updated: function () {
  },
  mounted: function () {
    this.build = this.$route.params.build
    this.$http.post('/api/testpost/' + this.$route.params.name, {'build': parseInt(this.build)})
      .then(rows => {
        for (let i = 0; i < rows.body.length; i++) {
          rows.body[i].thread = i + 1
        }
        this.buildData = rows.body
        this.listSetWidth()
      })
    window.addEventListener('resize', this.listSetWidth)
  },
  watch: {
    '$route' (to, from) {
      let self = this
      this.$http.post('/api/testpost/' + to.params.name, {'build': parseInt(to.params.build)})
        .then(rows => {
          for (let i = 0; i < rows.body.length; i++) {
            rows.body[i].thread = i + 1
          }
          this.buildData = rows.body
          this.build = this.$route.params.build
          barChart(this.buildData)
          donut(this.buildData)
          self.buildStats(this.buildData)
        })
    }
  }
}
