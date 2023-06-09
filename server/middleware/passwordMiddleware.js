const bcrypt = require('bcrypt');

const hashPassword = async function(next) {
  if (this.isModified('password') || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
};

const matchPassword = async function(candidatePassword) {


  const isMatch = await bcrypt.compare(candidatePassword, this.password);


  return isMatch;
};

module.exports = {
  hashPassword,
  matchPassword
};
