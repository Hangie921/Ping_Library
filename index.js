// var gengod = require('./common/generate/god');//<---產生GOD 這行會影響unitest TODO
var main = require('./interface/session.js');
main.Company = require('./bean/company');
main.User = require('./bean/users');
main.Role = require('./bean/roles');
main.Menu = require('./bean/menu');
main.Group = require('./bean/group');

main.CompanyService = require('./service/companyService');
main.UserService = require('./service/userService');
main.RoleService = require('./service/roleService');
main.MenuService = require('./service/menuService');
main.GroupService = require('./service/groupService');
main.SessionService = require('./service/sessionService');
main.response = require('./common/response');
module.exports = main;
