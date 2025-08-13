const systemConfig = require("../../config/system")
const version = "/API/v1"
module.exports.path = (req,res, next)=>{
    const PATH_ADMIN = `${version}${systemConfig.prefixAdmin}`;

    res.locals.pathAdmin = PATH_ADMIN

    next();
}