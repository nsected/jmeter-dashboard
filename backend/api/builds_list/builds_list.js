exports.builds_list = function (req, res) {
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

  model.aggregate([
    {
      $group: {
        _id: '$build',
        elapsed_time: {$avg: '$elapsed_time'},
        error_count: {$sum: '$error_flag'},
        requests: {'$sum': 1},
        time_stamp: {$first: '$time_stamp'}
      }
    },
    {
      $sort: {'_id': 1}
    },
    {
      $project: {
        '_id': 1,
        'elapsed_time': {$trunc: '$elapsed_time'},
        'error_count': 1,
        'requests': 1,
        "time_stamp": 1
      }
    }
  ]).then(rows => {
    console.log('build list sent')
    res.send(rows)
  })
}
