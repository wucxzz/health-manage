const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(proxy('/ehr', { target: 'http://test-ehr.baijiahulian.com' }));
};
