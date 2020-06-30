//@ts-check
const {
  getOpenIdRoute,
  getOauthRoute,
  getDataFromOpenId,
  getDataFromOauth,
} = require("../auth/google.auth");

const route = require("express").Router();

genRoute({
  service: "openid",
  getRoute: getOpenIdRoute,
  getData: getDataFromOpenId,
});

genRoute({
  service: "oauth",
  getRoute: getOauthRoute,
  getData: getDataFromOauth,
});

function genRoute({ getRoute, getData, service }) {
  const callbackUri = `http://localhost:4000/auth/google/${service}/callback`;
  route.get(`/google/${service}`, (req, res) => {
    const url = getRoute({
      callbackUri,
      googleId: process.env.GOOGLE_ID,
    });
    return res.redirect(url);
  });

  route.get(`/google/${service}/callback`, async (req, res) => {
    if (req.query.code) {
      const userData = await getData({
        googleId: process.env.GOOGLE_ID,
        callbackUri: callbackUri,
        googleSecret: process.env.GOOGLE_SECRET,
        code: req.query.code,
      });
      if (!userData) return res.redirect("/fail");
      return res.json(userData);
    }
    return res.redirect("/fail");
  });
}

module.exports = route;
