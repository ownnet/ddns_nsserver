var dnsd = require('dnsd');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./main.db');

var server = dnsd.createServer(handler)
server.zone('flagplus.net', 'ns1.flagplus.net', 'i@flagplus.net', 'now', '2h', '30m', '2w', '10m')
      .listen(53, '0.0.0.0')
console.log('Server running at 0.0.0.0:53')

function handler(req, res) {
  //console.log('%s:%s/%s %j', req.connection.remoteAddress, req.connection.remotePort, req.connection.type, req)
  res.question.forEach(function(item,index){
      db.all("SELECT * FROM record WHERE host='" + item.name + "'",function(err,row){
      var rst = new Array();
      row.forEach(function(v,k){
        if(v.status == 1){
          rst.push({
          name:item.name,
          value:v.value,
          ttl:v.ttl,
          type:v.type
          });
        }    
      });
      rst.forEach(function(item,key){
      if(item.type == 'A') {
        res.answer.push({name:item.name, type:'A', data:item.value, 'ttl':item.ttl})
      }else{
        res.answer.push({name:item.name, type:item.type, data:item.value, 'ttl':item.ttl})
      }
      
    });
    //console.log(res);
    var time = new Date();
    var time_str = time.getFullYear() + '-' + time.getMonth()+1 + '-' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' +time.getSeconds();
    console.log('%s %s:%s/%s question=%j answer=%j', time_str, req.connection.remoteAddress, req.connection.remotePort, req.connection.type, res.question, res.answer)
    res.end();
    });    
  });
}


