var {serverError} = require('./basicResHandler');

function inputBodyBuffer(req, res, next) {
  if(req.method === "GET" || (req.headers['content-type'] && req.headers['content-type'].indexOf("multipart") >= 0)) {
    next();
    return;
  }
  var data = "";
  req.on("data", function(chunk) {
    data += chunk;
  });
  req.on("end", function() {
    try {
      if(data){
        req.body = JSON.parse(data);
      }
    }
    catch(ex) {
      return serverError(res, ex);
    }
    return next();
  });
}

module.exports.inputBodyBuffer = inputBodyBuffer;
