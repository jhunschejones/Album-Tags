var express = require('express');
var router = express.Router(); 
var request = require('request'); 

/* GET search page. */
router.get('/', function(req, res, next) {
    res.render('search', {
        pageTitle: ': Album Search',
        subTitle: 'Search By Album or Artist'
    });
});


/* GET artist info. */
router.get('/:search', function(req, res, next) {
    var jwtToken = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik05OVpGUEMyR1UifQ.eyJpYXQiOjE1MjAyODgwNDQsImV4cCI6MTUzNTg0MDA0NCwiaXNzIjoiUzJaUDI1NlBQSyJ9.aHYYWnOKFNxP-l5gXFq8SUurmtDuGvf_ZklQfFXgT-IlPrlXtXUIvHLDUz_psHQNyVwQeN8SxdEcgzMNR2x9Kg';
    var thisSearch = req.params.search;
    request.get(  
    {  
        url: `https://api.music.apple.com/v1/catalog/us/search?term=${thisSearch}&limit=25&&types=artists,albums`,  
        auth: {  
            bearer: jwtToken  
        },  
        json: true  
    },  
    (err, response, body) => {  
        if (err) {  
            console.error(err);  
        } else { 
            res.json(body);
        }  
    })
});


/* GET tags-search page. */
router.get('/tags/:selectedtags', function(req, res, next) {
    res.render('tagsearch', {
        pageTitle: ': Tag Search',
        subTitle: 'Tag Search Results',
        selectedTags: req.params.selectedtags
    });
});

router.get('/tags/database/:selectedtags', function(req, res, next) {
    var db = req.db;
    var collection = db.get('musictags');
    var selectedTags = req.params.selectedtags;

    // clean up tags pulled out of url
    selectedTags = selectedTags.split(",")
    selectedTags.forEach(element => {
        // go through the array and remove the item 
        let index = selectedTags.indexOf(element)
        selectedTags.splice(index, 1);
        // trim any spaces off the ends of the item
        element = element.trim();
        // put the item back in the array
        selectedTags.push(element);
    });

    collection.find({ "tags" : { $all: selectedTags } }, function(e,docs){
        res.json(docs);
    })
});

module.exports = router;
