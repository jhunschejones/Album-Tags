var express = require('express');
var router = express.Router(); 
const request = require("request"); 

/* GET album update page. */
router.get('/:albumId', function(req, res) {
    res.render('update', {
        pageTitle: ': Update',
        subTitle: 'Update Album Tags',
        albumId: req.params.albumId
    });
});

router.get('/database/:albumId', function(req, res) {
    var db = req.db;
    var collection = db.get('musictags');
    var thisAlbum = req.params.albumId;
    collection.find({ "albumId" : thisAlbum }, function(e,docs){
        res.json(docs);
    })
});

// theres no logic in here really, but it takes a json aray as input and 
// uses it to replace the tags array
router.put('/database/:albumId', function(req, res) {
    var db = req.db;
    var collection = db.get('musictags');
    var thisAlbum = req.params.albumId;
    console.log(Object.values(req.body)[0]);
    collection.update({ "albumId" : thisAlbum }, {$set: { "tags" : Object.values(req.body)[0]}});
    res.sendStatus(200)   
});


module.exports = router;
