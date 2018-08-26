var jwt = require('jsonwebtoken');
var {unauthorised} = require('./basicResHandler');
const SECRET = 'whatulike';

function verifyToken(req, res, next) {
  var token = req.headers.tkn || "";
  if (!token.length)
    return unauthorised(res, 'Token absent');
  jwt.verify(token, SECRET, function(err, decoded) {
    if (err)
    return unauthorised(res, 'Failed to authenticate token.');
    req.tkn = decoded.id;
    next();
  });
}
module.exports.verifyToken = verifyToken;
