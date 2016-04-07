
module.exports.codeEnum ={
         Unknown_Error: 999,
         OK: 200,
         Bad_Request: 400,
         Unauthorized:401,
         Not_Found:404,
         Already_Exists:601,
         Password_Error:602,
         No_Results:603
};

module.exports.obj = function (status_code,rtn_values) {
  return {code: status_code,values:rtn_values};
};