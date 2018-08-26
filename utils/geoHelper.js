function isValidLatLong(lat, long){
  if(typeof lat === 'number' && typeof long === 'number'){
    return (long > -180 && long < 180) && (lat > -90 && lat < 90);
  }
  else return false;
}

module.exports = {
  isValidLatLong: isValidLatLong
}
