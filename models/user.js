module.exports = function(mongoose) {
  var User = mongoose.model('User', {
    uid:  {type: Number, unique: true},
    id: {type: Number, unique: true},
    email: {type: String, unique: true},
    phone: {type: Number},
    display_name: {type: String}
  });
  return User;
};