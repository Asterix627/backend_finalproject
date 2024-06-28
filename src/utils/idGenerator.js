const crypto = require("crypto")

function idGenerator(args) {
    console.log(args)
    const randomNumber = crypto.randomInt(10000, 99999); // Adjust the range as needed
    return `${args}-${randomNumber}`;
  }

module.exports = idGenerator;