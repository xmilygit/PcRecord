var express = require('express');
var sql = require('mssql');
var router = express.Router();


var config = {
    user: 'sa',
    password: '19810921xmily',
    server: 'fjxx.vicp.net',
    database: 'pc_log',
    options: {
        tdsVersion: '7_1'
    }
}



function getip(ipstring) {
    var re = /(\d+)\.(\d+)\.(\d+)\.(\d+)/g //匹配IP地址的正则表达式
    var result = re.exec(ipstring)
    if (result)
        return result[0]
    else
        return null
}
var lessoninfo = {
    classname: '',
    node: '',
    time: '',
    teacher: '',
    lesson: '',
    pcinfo: ''
}

var returnPcRecordRouter = function (io) {

    var publiclesson = false;
    io.on('connection', function (socket) {
        console.log('连接成功');
        var ip = socket.request.connection.remoteAddress
        var cip = getip(ip);
        console.log("ip:" + cip);

        if (publiclesson) {
            var sql1 = "select * from V_studentpc where  ip='" + cip + "' and classname='小学" + lessoninfo.classname + "'"
            sqlhelp(socket, sql1, "读取机器信息", false);
        }

        socket.on('reload lesson', function () {
            var sql1 = "select * from V_studentpc where  ip='" + cip + "' and classname='小学" + lessoninfo.classname + "'"
            sqlhelp(socket, sql1, "读取机器信息", false);
        })

        //接收教师端传来课程基本设置请求
        socket.on('set base lesson info', function (clessoninfo) {
            lessoninfo.classname = clessoninfo.classname;
            lessoninfo.node = clessoninfo.node;
            lessoninfo.time = clessoninfo.time;
            lessoninfo.teacher = clessoninfo.teacher;
            lessoninfo.lesson = clessoninfo.lesson;
            publiclesson = true;
            io.emit('reload lesson', lessoninfo)
        });

    })
    router.get('/', function (req, res, next) {
        res.render('pcrecord/index');
    })

    router.get('/teacher', function (req, res, next) {
        res.render('pcrecord/teacher');
    })

    router.get('/appteacher', function (req, res, next) {
        lessoninfo.classname = req.query["classname"];
        lessoninfo.node = req.query["node"];
        lessoninfo.time = req.query["time"];
        lessoninfo.teacher = req.query["teacher"];
        lessoninfo.lesson = req.query["lesson"];
        publiclesson = true;
        io.emit('reload lesson', lessoninfo)
        res.json({ 'type': 'ok'})
    })

    return router;
}

//数据库查询辅助类
function sqlhelp(socket, sqlstr, readme, multiple) {
    let connection = new sql.Connection(config, function (err) {
        if (err) {
            console.log("获取" + readme + "时发生连接错误:" + err);
            setclient(socket, { 'type': 'error', 'message': '获取' + readme + '时发生连接失败错误：' + err });
        }
        let request = connection.request();
        request.multiple = multiple || false;
        request.query(sqlstr, function (err, recordset) {
            if (err) {
                console.log('获取' + readme + '时查询失败：' + err);
                setclient(socket, { 'type': 'error', 'message': '获取' + readme + '时查询失败：' + err });
            }
            console.log('成功获取到' + readme + '');
            setclient(socket, { 'type': 'ok', 'readme': readme, 'recordset': recordset });
        })
    })
}

function setclient(socket, result) {
    if (result.type != 'error')
        lessoninfo.pcinfo = result.recordset;
    socket.emit('set lesson', lessoninfo)
}
//module.exports = router;
module.exports = returnPcRecordRouter;