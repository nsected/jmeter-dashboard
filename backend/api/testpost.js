exports.echo = function (req, res) {
  let collection = req.params.collection
  let jtl_schema = req.app.get('schemas').jtl_schema
  let mongoose = req.app.get('mongoose')
  let model = req.app.get('models')[collection]
  let models = {}

  console.log(req.body)
  if (!model) {
    model = mongoose.model(collection, jtl_schema, collection)
    req.app.set('models')[collection] = model
  }

  model.find(req.body).then(rows => {
    console.log('builds sent')
    res.send(rows)
  })

}
