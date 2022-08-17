const {validateAccessToken} = require("../services/tokenService");

const authTokenMiddleware = (req, res, next) => {
   const authHeader = req.headers.authorization;
   if (!authHeader) {
     return res.status(401).send("User is not authorized");
   }

   const accessToken = authHeader.split(" ")[1];
   if (!accessToken) {
     return res.status(401).send("User is not authorized");
   }

   const userPayload = validateAccessToken(accessToken);
   if (!userPayload) {
     return res.status(401).send("User is not authorized");
   }

   req.user = userPayload;
   next();
}

module.exports = {
  authTokenMiddleware,
}
