exports.init = function(app){
  app.get('/', require('./controllers/main').index);

  app.get('/datasets', require('./controllers/dataset').index);
  app.get('/datasets/(:dataset_name)', require('./controllers/dataset').show);
  app.post('/datasets/(:dataset_name)', require('./controllers/dataset').postDatum);

  app.get('/applications', require('./controllers/application').index);
  app.get('/applications/new', require('./controllers/application').new);
  app.post('/applications', require('./controllers/application').create);

  // app.get('/auth/github/callback',
  //         passport.authenticate('github', { failureRedirect: '/login' }),
  //         require('./controllers/auth').github);
};