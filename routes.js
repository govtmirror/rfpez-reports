exports.init = function(app){
  app.get('/', require('./controllers/main').index);
  app.post('/collections/(:dataset_name)', require('./controllers/main').postDatum);
};