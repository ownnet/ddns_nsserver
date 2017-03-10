var dnsd = require('dnsd');
var sqlite3 = require('sqlite3').verbose();
var config = require('./config')

var db = new sqlite3.Database(config.db_path);

var server = dnsd.createServer(handler)
server.zone(config.zone, config.server, config.admin, config.serial, config.refresh, config.retry, config.expire, config.ttl)
      .listen(config.listen_port, config.listen_ip)
console.log('Server running at 0.0.0.0:53')

function getRecord(req,res,item,index,host){
  db.all("SELECT * FROM record WHERE host='" + host + "'",function(err,row){
    if(row.length != 0){
      var rst = new Array();
      row.forEach(function(v,k){
        if(v.status == 1){
          rst.push({
          name:host,
          value:v.value,
          ttl:v.ttl,
          type:v.type
          });
        }    
      });
      rst.forEach(function(item,key){
        res.answer.push({name:host, type:item.type, data:item.value, 'ttl':item.ttl})  
      }); 
      res.end();
      //console.log(res);
      var time = new Date();
      var time_str = time.getFullYear() + '-' + time.getMonth()+1 + '-' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' +time.getSeconds();
      console.log('%s %s:%s/%s question=%j answer=%j', time_str, req.connection.remoteAddress, req.connection.remotePort, req.connection.type, res.question, res.answer)
    }else{
      
      name_arr = host.split(".");
      if(name_arr.length > 1){
        host = name_arr.slice(1).join(".");
        console.log(name_arr + ' Not Found! Try '+ host);
        getRecord(req,res,item,index,host);
      }else{
        console.log('Not Found');
      }
    }  

  }); 
}

function handler(req, res) {
  res.question.forEach(function(item,index){
      getRecord(req,res,item,index,item.name)       
  });
}