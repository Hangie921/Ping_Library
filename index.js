// var gengod = require('./common/generate/god');//<---產生GOD 這行會影響unitest TODO
var main = require('./interface/session.js');
main.User = require('./bean/users');
main.Role = require('./bean/roles');
// main.Func = require('./bean/function');
main.Menu = require('./bean/menu');

main.UserService = require('./service/userService');
main.RoleService = require('./service/roleService');
// main.FunctioService = require('./service/functionService');
main.MenuService = require('./service/menuService');
main.SessionService = require('./service/sessionService');

main.response = require('./common/response');
module.exports = main;
