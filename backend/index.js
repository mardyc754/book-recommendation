"use strict";
exports.__esModule = true;
var express_1 = require("express");
require("dotenv/config");
var app = (0, express_1["default"])();
var port = process.env.PORT || 8080;
// const requestListener = function (req, res) {
//   res.writeHead(200);
//   res.end('Hello, World!');
// };
// const server = http.createServer(requestListener);
app.listen(port, function () {
    console.log("server listening on port: ".concat(port));
});
