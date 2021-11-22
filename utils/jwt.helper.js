const jwt = require("jsonwebtoken");

let generateToken = (user, secretSignature, tokenLife, loggedBySocial) => {
  return new Promise((resolve, reject) => {
    // Định nghĩa những thông tin của user
    const userData = {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      id_uni: user.id_uni,
      email: user.email,
      address: user.address,
      phone: user.phone,
      is_social_login: loggedBySocial,
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
