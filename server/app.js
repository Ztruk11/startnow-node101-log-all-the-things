const express = require('express');
const fs = require('fs');
const http = require('http');
const app = express();
const csvFilePath='server/log.csv'
const csv=require('csvtojson')


app.use((req, res, next) => {
// write your logging code here

    var data = req.headers['user-agent'].replace(/,/g,' ') + ',' + new Date().toISOString() + ',' + req.method + ',' +  req.path + ',' +  'HTTP/' + req.httpVersionMajor + '.' + req.httpVersionMinor + ',' +  res.statusCode;

    var stringReturn = data + '\n';
      fs.appendFile('server/log.csv', stringReturn, (err) => {
            if (err) throw err;
            console.log(data);
            next();
      });
}); 

app.get('/', (req, res) => {
// write your code to respond "ok" here
  res.send('ok');
});

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here
  var logsArray = [];
    csv({
        noheader: true,
        headers: ['Agent','Time','Method','Resource','Version','Status']
    })

    .fromFile(csvFilePath)
    .on('json',(jsonObj)=>{
      logsArray.push(jsonObj);
    })

    .on('done',()=>{
        console.log('end');
        res.send(logsArray);
    })
});

module.exports = app;



