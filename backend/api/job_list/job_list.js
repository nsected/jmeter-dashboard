exports.job_list = function (req, res) {
  let connection = req.app.get('connection')

  connection.db.listCollections().toArray(function (err, jobs) {
    if (err) {
      console.error(err)
    } else {
      let list = []
      jobs.forEach(job => {
        list.push(job.name)
      })
      res.send(list)
    }
  })
}
