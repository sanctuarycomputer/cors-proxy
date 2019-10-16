const request = require("request");
const URL = require("url");

module.exports = async function (req, res) {
  let proxyable = (req.url || "");
  if (proxyable.charAt(0) === "/") proxyable = proxyable.substr(1);

  if (!URL.parse(proxyable).host) {
    if (req.headers.referer) {
      let refererPath = URL.parse(req.headers.referer).path;
      if (refererPath.charAt(0) === "/") refererPath = refererPath.substr(1);
      const parsedRefererPath = URL.parse(refererPath);
      if (parsedRefererPath.host) {
        proxyable = `${parsedRefererPath.protocol}//${parsedRefererPath.host}/${proxyable}`;
      }
    }
  }

  return request(proxyable)
  .on("response", remote => {
    remote.headers['Access-Control-Allow-Origin'] = '*';
  }).pipe(res);
}
