const User = require('../../models/user/userSchema'); 

const generateReferralCode = async (name) => {
  const prefix = name.trim().slice(0, 3).toUpperCase(); // first 3 letters in uppercase
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code;

  while (true) {
    const randomStr = Array.from({ length: 5 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
    code = `${prefix}${randomStr}`;

    const existing = await User.findOne({ referelcode: code });
    if (!existing) break; // unique
  }

  return code;
};


module.exports = {
    generateReferralCode
}