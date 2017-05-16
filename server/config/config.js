/**
 * Config var for app
**/
module.exports = {
  mongoDBUrl: process.env.MONGODB_URL || process.env.MONGOLAB_URI  || 'mongodb://root:qwerty@ds143211.mlab.com:43211/emissary',
  port: process.env.PORT || 4941,
  secret: process.env.SECRET || 'mysecret'
};
