"use strict";
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var router = express.Router();

var queueList = [];
app.use(bodyParser.json());

function findQueueIndex(name) {
  console.log(queueList.length);
  for (let i = 0; i < queueList.length; i++) {
    if (queueList[i].name === name)
      return i;
  }
  return -1;
}

//middleware function
router.use(function(req, res, next) {
    console.log(new Date().toString());
    next();
});

router.put('/createQueue', function(req, res) {
  let thisQueueAr = [];
  let queue = { "name": req.body.name, "queue": thisQueueAr };
  if (findQueueIndex(req.body.name) < 0) {
    queueList.push(queue);
    res.json({ "status": "OK" });
  }
  else {
    res.json({ "status": "Error: Queue already exists" });
  }
});

router.get('/findQueue/:queue', function(req, res) {
  let i = findQueueIndex(req.params.name);
  if (i >= 0)
    res.json({ "status" : "OK", "queue": queueList[i].queue });
  else {
    res.json({ "status": "Error: Queue not found" });
  }
});

router.put('/sendMsg', function(req, res) {
  let queueIndex = findQueueIndex(req.body.queue);
  if (queueIndex >= 0) {
    let id = Math.floor(Date.now() / 1000);
  	let dt = new Date();
  	let jsonObj = { "id": id, "date": dt, "message": req.body.message };
    queueList[queueIndex].queue.push(jsonObj);
  	res.json({ "status": "OK", "id": id });
  }
  else {
    res.json({ "status": "Error: Queue not found" });
  }
});

router.get('/getMsg/:queue', function(req, res) {
  let queueIndex = findQueueIndex(req.params.queue);
  if (queueIndex >= 0) {
    res.json(queueList[queueIndex].queue.shift());
   }
   else {
     res.json({ "status": "Error: Queue not found" });
   }
});

router.delete('/deleteQueue/:queue', function(req, res) {
  let queueIndex = findQueueIndex(req.params.queue);
  if (queueIndex >= 0) {
    queueList.splice(queueIndex, 1);
    res.json({ 'status': 'OK'});
   }
   else {
     res.json({ "status": "Error: Queue not found" });
   }
});

router.get('/list', function(req, res) {
	res.json(queueList);
});

app.use('/queueApi', router);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
