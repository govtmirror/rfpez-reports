var filters = require('./library/filters');

exports.init = function(app){
  app.get('/', require('./controllers/main').index);

  app.get('/datasets', require('./controllers/dataset').index);
  app.get('/datasets/(:dataset_name).csv', require('./controllers/dataset').csv);
  app.get('/datasets/(:dataset_name)', require('./controllers/dataset').show);
  app.post('/datasets/(:dataset_name)', require('./controllers/dataset').postDatum);

  app.get('/applications', require('./controllers/application').index);
  app.get('/applications/new', require('./controllers/application').new);
  app.post('/applications', require('./controllers/application').create);

  app.get('/logout', require('./controllers/auth').logout);
  app.get('/auth/github/callback',
          filters.auth(),
          require('./controllers/auth').github);
};