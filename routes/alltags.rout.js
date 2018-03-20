var express = require('express');
var router = express.Router(); 
const request = require("request"); 

router.get('/', function(req, res) {
    res.render('alltags', {
        pageTitle: ': All Tags',
        subTitle: 'All Tags',
    });
});

router.get('/database', function(req, res) {
    var db = req.db;
    var collection = db.get('musictags');
    collection.find({}, {}, function(e,docs){
        res.json(docs);
    })
});

module.exports = router;