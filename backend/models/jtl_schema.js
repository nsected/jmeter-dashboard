let mongoose = require('mongoose')
module.exports = {
  jtl_schema: mongoose.Schema(
    {
      elapsed_time: Number,
      idle_time: Number,
      latency: Number,
      connect_time: Number,
      time_stamp: Date,
      success_flag: Boolean,
      label: String,
      response_code: Number,
      response_message: String,
      thread_name: String,
      data_type: String,
      bytes: Number,
      sent_bytes: Number,
      active_threads_group: Number,
      active_threads_all: Number,
      job_number: Number
    }
  )
}
