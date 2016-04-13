var gengod = require('./common/generate/god');
var main = require('./interface/session.js');
main.User = require('./bean/users');
main.Role = require('./bean/roles');
main.Func = require('./bean/function');

main.UserService = require('./service/userService');
main.RoleService = require('./service/roleService');
main.FunctioService = require('./service/functionService');

main.response = require('./common/response');
module.exports = main;
