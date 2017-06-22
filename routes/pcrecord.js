var express = require('express');
var router = express.Router();


var returnPcRecordRouter = function (io) {
    io.on('connection', function (socket) {
        console.log('连接成功');
        var req=socket.request;
        var conn=req.connection;
  console.log(socket.request.connection.remoteAddress)
    })
    router.get('/', function (req, res, next) {
        res.render('pcrecord/index');
    })
    return router;
}

//module.exports = router;
module.exports = returnPcRecordRouter;