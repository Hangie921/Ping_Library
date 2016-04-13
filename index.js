var gengod = require('./common/generate/god');
var main = require('./interface/session.js');
main.User =  require('./bean/users');
main.Role =  require('./bean/roles');
main.Fun =  require('./bean/function');
module.exports = main;
