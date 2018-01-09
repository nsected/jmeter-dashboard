exports.connect=function (mongoose, config, app) {
  let jtl_schema = require(__basedir + '/models/jtl_schema')
  const connection = mongoose.connect(config.db.url, { useMongoClient: true });
  mongoose.Promise = global.Promise;

  app.set('mongoose', mongoose);
  app.set('connection', connection);
  app.set('schemas', {
    "jtl_schema": jtl_schema
  });
  app.set('models',{

  })
}
