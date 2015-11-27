/**
 * Created by Admin on 11/27/2015.
 */
var express = require('express');
var path    = require('path');
var router = express.Router();

router.get('/', function(req, res, next) {
    // res.send('respond with a resource');
    res.sendFile(path.resolve(__dirname , '../views/download.html'));
    //res.send("Download File");
});
module.exports = router;
