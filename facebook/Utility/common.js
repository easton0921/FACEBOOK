//OTP GENERATE
function otpCreate(){
    return Math.floor(1000+Math.random()*9000)
};
//GTI GENRATE
async function generateRandomString(length = 10) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };
// regex of eamil
async function regex(email){
  let pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    console.log('Email:', email);

    if (pattern.test(email)) {
        return true; // Email is valid
    } else {
        return false; // Email is invalid
    }
};

module.exports = {
    otpCreate,
    generateRandomString,
    regex,
}