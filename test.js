db.daily_prom_tests.aggregate(
  [
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
      $sort: {"_id": 1}
    },
    {
      $project: {
        '_id': 1,
        "elapsed_time": {$trunc: "$elapsed_time"},
        "error_count": 1,
        "requests": 1,
        "time_stamp": 1
      }
    }
  ]
)

db.hashtag.aggregate([
  {
    '$group': {
      '_id': {
        'year': {'$year': '$tweettime'},
        'dayOfYear': {'$dayOfYear': '$tweettime'},
        'interval': {
          '$subtract': [
            {'$minute': '$tweettime'},
            {'$mod': [{'$minute': '$tweettime'}, 15]}
          ]
        }
      },
      'count': {'$avg': 1}
    }
  }
])
