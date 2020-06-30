const route = require("express").Router();

route.get("/", (req, res) => {
  res.send(
    `Hi, <br/> 
    &nbsp; to try openId go to <a href='/auth/google/openid'>localhost:4000/auth/google/openid</a> <br/> 
        or <br/>
    &nbsp; to try oauth go to <a href='/auth/google/oauth'>localhost:4000/auth/google/oauth<a/> <br/>
       <br/>
    Hope you enjoy it!!
    `
  );
});

route.get("/fail", (req, res) => {
  res.send("something check your code or your google credential");
});

module.exports = route;
