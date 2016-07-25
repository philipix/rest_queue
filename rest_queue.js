"use strict";
let express = require("express");
let bodyParser = require("body-parser");

let app = express();
let router = express.Router();
let queueList = [];

app.use(bodyParser.json());

/**
 * Returns the queue index number in the main array list (queueList)
 * If the queue does not exist, returns -1
 * @name {string} Queue name
 */
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

router.put("/createQueue", function(req, res) {
  let thisQueueAr = [];
  let queue = { "name": req.body.name, "queue": thisQueueAr };
  
  if (findQueueIndex(req.body.name) < 0) {
    queueList.push(queue);
    res.json({ "status": "OK" });
  }
  else {
    res.status("500").json({ "status": "Error: Queue already exists" });
  }
});

router.get("/findQueue/:queue", function(req, res) {
  let i = findQueueIndex(req.params.name);
  
  if (i >= 0)
    res.json({ "status" : "OK", "queue": queueList[i].queue });
  else {
    res.status("404").json({ "status": "Error: Queue not found" });
  }
});

router.put("/sendMsg", function(req, res) {
  let queueIndex = findQueueIndex(req.body.queue);
  
  if (queueIndex >= 0) {
    let id = Math.floor(Date.now() / 1000);
  	let dt = new Date();
  	let jsonObj = { "id": id, "date": dt, "message": req.body.message };
    
    queueList[queueIndex].queue.push(jsonObj);
  	res.json({ "status": "OK", "id": id });
  }
  else {
    res.status("404").json({ "status": "Error: Queue not found" });
  }
});

router.get("/getMsg/:queue", function(req, res) {
  let queueIndex = findQueueIndex(req.params.queue);
  
  if (queueIndex >= 0) {
    res.json(queueList[queueIndex].queue.shift());
   }
   else {
     res.status("404").json({ "status": "Error: Queue not found" });
   }
});

router.delete("/deleteQueue/:queue", function(req, res) {
  let queueIndex = findQueueIndex(req.params.queue);
  
  if (queueIndex >= 0) {
    queueList.splice(queueIndex, 1);
    res.json({ "status": "OK"});
   }
   else {
     res.status("404").json({ "status": "Error: Queue not found" });
   }
});

router.get("/list", function(req, res) {
	res.json(queueList);
});

app.use("/queueApi", router);

app.listen(3000, function () {
  console.log("REST Queue server listening on port 3000");
});
