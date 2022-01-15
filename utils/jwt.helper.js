const jwt = require("jsonwebtoken");

let generateToken = (user, secretSignature, tokenLife, loggedBySocial, isadmin) => {
  return new Promise((resolve, reject) => {
    // Định nghĩa những thông tin của user
    const userData = {
      id: user.id,
      is_social_login: loggedBySocial,
      is_admin: isadmin,
    }
    // Thực hiện ký và tạo token
    jwt.sign(
      {data: userData},
      secretSignature,
      {
        algorithm: "HS256",
        expiresIn: tokenLife,
      },
      (error, token) => {
        if (error) {
          return reject(error);
        }
        resolve(token);
    });
  });
}

let verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        return reject(error);
      }
      resolve(decoded);
    });
  });
}


module.exports = {
  generateToken: generateToken,
  verifyToken: verifyToken,
};
