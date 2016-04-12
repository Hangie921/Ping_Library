var gengod = require('./common/generate/god');
var main = require('./interface/session.js');
main.Users =  require('./bean/users');
main.Roles =  require('./bean/roles');
main.Functions =  require('./bean/function');
module.exports = main;
