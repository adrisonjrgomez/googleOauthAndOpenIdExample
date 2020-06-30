const axios = require("axios").default;
const rootEnpoint = "https://accounts.google.com/o/oauth2/v2/auth?";

/**
 * @function genRoute
 *
 * This is a HOF that return a routeGenerator for an especific google services.
 *
 * @param {string} scope
 * Scope is the reference of the google service that your server it's going to access.
 *
 * @returns {funcion} callback
 *
 */
const genRoute = (scope) => ({ callbackUri, googleId }) => {
  return `${rootEnpoint}redirect_uri=${callbackUri}&prompt=consent&response_type=code&client_id=${googleId}&scope=${scope}&access_type=offline`;
};

/**
 * @function getData
 *
 * this is a HOF that return a getter function from google services data
 *
 * @param {string} url
 *
 * @returns {function} callback
 *
 */

const getData = (url) => async ({
  googleId,
  callbackUri,
  googleSecret,
  code,
}) => {
  const credential = { googleId, callbackUri, googleSecret, code };
  try {
    const { data } = await axios.post(
      "https://oauth2.googleapis.com/token",
      getTokenOptions(credential)
    );
    const accessToken = data.access_token;
    const userInfo = await axios.get(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    return userInfo.data;
  } catch (error) {
    return null;
  }
};

/**
 *
 * @param {object} {
 *  callbackUri: uri from you service get the google code authorize by the user,
 *  googleId & googleSecret: Identifier that google give to identify outside systems EX: like web application, etc. You can get it in
 *  https://console.cloud.google.com/apis/ register your project and your endpoint of your OpenID or Oauth services.
 *
 *      Example:
 *          In this project:
 *              http://localhost:4000/google/openid
 *              http://localhost:4000/google/openid/callback
 *              http://localhost:4000/google/oauth
 *              http://localhost:4000/google/oauth/callback
 *
 *      NOTE: DO NOT SHARE THAT INFO and DON'T UPLOAD THOSE CREDENTIAL IN YOUR CODE
 *
 * }
 */

const getTokenOptions = ({ callbackUri, googleId, googleSecret, code }) => ({
  code: code,
  redirect_uri: callbackUri,
  client_id: googleId,
  client_secret: googleSecret,
  grant_type: "authorization_code",
  code_verifier: "",
});

module.exports = {
  // getter for OpenId route,
  getOpenIdRoute: genRoute("openid"),
  // getter for Oauth route,
  getOauthRoute: genRoute(
    "https://www.googleapis.com/auth/userinfo.email+https://www.googleapis.com/auth/userinfo.profile"
  ),
  // get access tokken and extract data from google
  getDataFromOpenId: getData("https://www.googleapis.com/userinfo/v2/me"),
  // get access tokken and extract data from google
  getDataFromOauth: getData("https://www.googleapis.com/oauth2/v2/userinfo"),
};
