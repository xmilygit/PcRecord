var express = require('express');
var router = express.Router();
var sql = require('mssql');
var moment = require('moment');


var config = {
  user: 'sa',
  password: '19810921xmily',
  server: 'fjxx.vicp.net',
  database: 'pc_log',
  options: {
    tdsVersion: '7_1'
  }
}


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: '桂林市凤集小学计算机使用登记系统' });
});

router.get('/pclog', function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  let currentpage = parseInt(req.query["currentpage"]) - 1;
  let pagesize = parseInt(req.query["pagesize"]);
  let beginnum = parseInt(pagesize * currentpage) + 1
  let endnum = beginnum + pagesize - 1;
  console.log(req.query['daterange'])
  let daterange1 = req.query['daterange'].substring(0, 10).replace(/-/g, '');
  let daterange2 = req.query['daterange'].substring(13, 23).replace(/-/g, '');
  let pcname = req.query['pcname'];
  let sqlstr = ""
  if (pcname == "")
    sqlstr = "with temp as(select *,row_number() over(order by lessondate,lessonnode) as sid from dbo.[log2] where lessondate between '" + daterange1 + "' and '" + daterange2 + "') select top " + pagesize + " * from temp where sid between " + beginnum + " and " + endnum
  else
    sqlstr = "with temp as(select *,row_number() over(order by lessondate,lessonnode) as sid from dbo.[log2] where lessondate between '" + daterange1 + "' and '" + daterange2 + "' and pcname='" + pcname + "') select top " + pagesize + " * from temp where sid between " + beginnum + " and " + endnum
  
  let sqlstr2="select count(*) as recosum from dbo.[log2] where lessondate between '" + daterange1 + "' and '" + daterange2 + "' and pcname='" + pcname + "'"
  console.log(sqlstr)
  sqlhelp(res, sqlstr+";"+sqlstr2, '获取上机记录', true)
})

//数据库查询辅助类
function sqlhelp(res, sqlstr, readme, multiple) {
  let connection = new sql.Connection(config, function (err) {
    if (err) {
      console.log("获取" + readme + "时发生连接错误:" + err);
      res.json({ 'type': 'error', 'message': '获取' + readme + '时发生连接失败错误：' + err });
    }
    //let sqlstr = 'select sum(bookcount) as bookscount from(select sm,zz,cbs,dj,sum(cs) as bookcount from ts group by sm,zz,cbs,dj)a';
    //var request = new sql.Request(connection1);
    let request = connection.request();
    request.multiple = multiple || false;
    request.query(sqlstr, function (err, recordset) {
      if (err) {
        console.log('获取' + readme + '时查询失败：' + err);
        res.json({ 'type': 'error', 'message': '获取' + readme + '时查询失败：' + err });
      }
      console.log('成功获取到' + readme + '');
      res.json({ 'type': 'ok', 'readme': readme, 'recordset': recordset })
    })
  })
}

module.exports = router;
