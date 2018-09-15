const mongoose = require('mongoose');

const URI = 'mongodb://luisfelipej:utem1234@ds251022.mlab.com:51022/climatizador';

mongoose.connect(URI)
    .then(db => console.log('BD conectada'))
    .catch(err => console.log(err));


module.exports = mongoose;