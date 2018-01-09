exports.echo = function (req, res) {
  let collection = req.params.collection
  let jtl_schema = req.app.get('schemas').jtl_schema
  let mongoose = req.app.get('mongoose')
  let model = req.app.get('models')[collection]
  let query = {}
  let models = {}

  console.log(req.query)

  for (let param in req.query) {
    query[param] = parseInt(req.query[param])|req.query[param]
  }

  console.log(query)
  if (!model) {
    model = mongoose.model(collection, jtl_schema, collection)
    req.app.set('models')[collection] = model
  }

  model.find(query, 'job_number elapsed_time label').then(rows => {
    res.send(rows)
  })

}
