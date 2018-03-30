var express = require('express');
var router = express.Router(); 
var request = require('request'); 

router.get('/', function(req, res, next) {
    res.render('alltags', {
        pageTitle: ': All Tags',
        subTitle: 'Search From All Tags',
    });
});

router.get('/database', function(req, res, next) {
    var db = req.db;
    var collection = db.get('musictags');
    collection.find({}, {}, function(e,docs){
        res.json(docs);
    })
});

module.exports = router;
