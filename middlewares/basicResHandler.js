var logger = require('../lib/logger');

function serverError(res, ex){
  const sc = 500;
  logger.error(`${sc} - Exception for ${res.req.originalUrl}`, ex);
  res.status(sc).send({msg: 'Sorry, something went wrong!'});
}

function clientError(res, msg){
  const sc = 400;
  logger.warn(`${sc} - Client error for ${res.req.originalUrl}`, msg);
  res.status(sc).send({msg});
}

function unauthorised(res, msg){
  const sc = 401;
  logger.warn(`${sc} - Unauthorised request ${res.req.originalUrl}`);
  res.status(sc).send({msg});
}

function success(res, obj){
  const sc = 200;
  logger.verbose(`${sc} - Success ${res.req.originalUrl}`);
  // if(Array.isArray(obj)){
  //   obj['msg'] = 'ok';
  // }
  // else if(Object.keys(obj).length > 0 && obj.constructor === Object){
  //   obj.msg = 'ok';
  // }
  res.status(sc).send(obj);
}

module.exports = {
  serverError: serverError,
  clientError: clientError,
  unauthorised: unauthorised,
  success: success
};
