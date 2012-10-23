var filters = require('./library/filters');

exports.init = function(app){
  app.get('/', require('./controllers/main').index);

  app.get('/datasets', filters.auth, require('./controllers/dataset').index);
  app.get('/datasets/(:dataset_name).csv', filters.auth, require('./controllers/dataset').csv);
  app.get('/datasets/(:dataset_name)', filters.auth, require('./controllers/dataset').show);
  app.post('/datasets/(:dataset_name)', filters.auth, require('./controllers/dataset').postDatum);

  app.get('/applications', filters.auth, require('./controllers/application').index);
  app.get('/applications/new', filters.auth, require('./controllers/application').new);
  app.post('/applications', filters.auth, require('./controllers/application').create);

  app.get('/login', require('./controllers/auth').login);
  app.get('/logout', filters.auth, require('./controllers/auth').logout);
  app.get('/auth/github/callback',
          filters.loginGithub(),
          require('./controllers/auth').afterGithub);
};