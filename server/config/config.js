/**
 * Config var for app
**/
module.exports = {
  mongoDBUrl: process.env.MONGODB_URL || process.env.MONGOLAB_URI  || 'mongodb://root:qwerty@ds121192.mlab.com:21192/emissary',
  port: process.env.PORT || 4941,
  secret: process.env.SECRET || 'mysecret'
};
