var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var sql = require('msnodesqlv8');
var conn_str = "Driver={SQL Server Native Client 11.0};Server={********};Database={******};uid=****;PWD=*******;";
var path = require('path')
// app.all('*', function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://127.0.0.1:8080");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
//   res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//   res.header("X-Powered-By", ' 3.2.1');
//   res.header("Content-Type", "application/json;charset=utf-8");
//   next();
// });

app.use(express.static(path.join(__dirname,'./static')))
app.use(bodyParser.json({ limit: '1mb' }));  //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
  extended: true
}));



app.post('/login', function (req, res) {
  var { id, password } = (req.body)
  var response = {}
  //req.body.id/password
  sql.open(conn_str, function (err, conn) {
    if (err) {
      console.log('连接数据库发生错误', err);
      response = {
        "code": "500",
        "message": "can't connect Mysqlserver"
      };
      res.end(JSON.stringify(response));
    } else {
      let query = "select id,password,nickname from table1"
      sql.queryRaw(conn_str, query, function (err, results) {
        if (err) {
          console.log('查询数据库发生错误', err);
          response = {
            "code": "500",
            "message": "can't query from Mysqlserver"
          };
          res.end(JSON.stringify(response));
        } else {
          //console.log(results.rows[0][0].replace(/\s+/g, ""),results.rows[0][1].replace(/\s+/g, ""))
          let ID = results.rows[0][0].replace(/\s+/g, ""),
            PWD = results.rows[0][1].replace(/\s+/g, ""),
            NAME = results.rows[0][2].replace(/\s+/g, "")
          if (ID === id && PWD === password) {
            console.log('登陆成功');
            response = {
              "code": "200",
              "message": "login Success,nickname is :" + NAME
            };
            res.end(JSON.stringify(response));
          } else {
            console.log('登陆错误');
            response = {
              "code": "401",
              "message": "login Err"
            };
            res.end(JSON.stringify(response));
          }
        }
      })
    }
  })
})

app.get('/message', function (req, res) {
  console.log(req.query.id)
  var query = `select co,yanwu,wendu,shidu,pm2,jia,hon,judgelocation from table1 where id='${req.query.id}'`
  var response = {}
  sql.queryRaw(conn_str, query, function (err, results) {
    if (err) {
      console.log(err);
      response = {
        "code": "500",
        "message": "can't query from Mysqlserver",
      }
      res.end(JSON.stringify(response));
    }
    else {
      console.log(results.rows)
      response = {
        "code": "200",
        "message": "Success",
        "data": results.rows[0]
      }
      res.end(JSON.stringify(response));
    }
  })

})

app.get('/app/njupt.apk',function(req, res){
  console.log('download apk')
  res.sendFile(path.join(__dirname, './app/njupt.apk'))
})

app.get('/app/njupt_localPC.exe',function(req, res){
  console.log('download njupt_localPC.exe')
  res.sendFile(path.join(__dirname, './app/njupt_localPC.exe'))
})

app.get('/app/njupt_remotePC.exe',function(req, res){
  console.log('download njupt_remotePC.exe')
  res.sendFile(path.join(__dirname, './app/njupt_remotePC.exe'))
})

var server = app.listen(8080, function () {
  var host = server.address().address
  var port = server.address().port
})

server.on('listening', ()=>{
  console.log('Listening on 8080');
})