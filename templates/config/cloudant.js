const { CLOUDANT } = require("./vars");
const cloudant = require("@cloudant/cloudant")(
  {
    url: CLOUDANT.URL,
    plugins: { iamauth: { iamApiKey: CLOUDANT.API_KEY } }
  },
  (err, cloudant) => {
    if (err) {
      return console.log("Failed to initialize Cloudant: " + err.message);
    }

    console.log("Cloudant initialized...");
  }
);
module.exports = cloudant;
