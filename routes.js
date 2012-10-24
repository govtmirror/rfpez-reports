var filters = require('./library/filters');

exports.init = function(app){
  app.get('/', require('./controllers/main').index);

  app.get('/users/typeahead', filters.auth, require('./controllers/user').typeahead);

  app.get('/datasets', filters.auth, require('./controllers/dataset').index);
  app.post('/datasets', filters.auth, require('./controllers/dataset').create);
  app.get('/datasets/(:dataset_name).csv', filters.auth, require('./controllers/dataset').csv);
  app.get('/datasets/(:dataset_name)', filters.auth, require('./controllers/dataset').show);
  app.post('/datasets/(:dataset_name)', require('./controllers/dataset').postDatum);
  app.post('/datasets/(:dataset_name)/collaborators', require('./controllers/dataset').addCollaborator);

  app.get('/login', require('./controllers/auth').login);
  app.get('/logout', filters.auth, require('./controllers/auth').logout);
  app.get('/auth/github/callback',
          filters.loginGithub(),
          require('./controllers/auth').afterGithub);
};