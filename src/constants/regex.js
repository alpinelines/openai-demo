module.exports.regexIsURL = (value) => {
  return /^(http(s):\/\/.)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/.test(value);
};

module.exports.regexIsValidPassword = (value) => {
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    throw new Error('Password must contain at least one letter and one number');
  }
};
