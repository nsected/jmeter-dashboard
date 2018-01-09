module.exports = function(router) {
  let test = require('./api/test');
  let job_list = require('./api/job_list/job_list');
  let builds_list = require('./api/builds_list/builds_list');
  let testpost = require('./api/testpost');

  router.get('/test/:collection', test.echo)
  router.get('/job-list', job_list.job_list)
  router.get('/builds-list/:collection', builds_list.builds_list)
  router.post('/testpost/:collection', testpost.echo)

  return router;
};
