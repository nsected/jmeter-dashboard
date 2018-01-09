import job from '../job/job.vue'
import jobList from '../job_list/job_list.vue'
import build from '../build/build.vue'

export default {
  components: {
    'job': job,
    'job_list': jobList,
    'build': build
  },
  name: 'dashboard',
  data () {
    return {
      resizeTimer: null
    }
  },
  methods: {

  },
  mounted: function () {

  }
}
