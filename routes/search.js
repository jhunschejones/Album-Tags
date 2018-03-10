var express = require('express');
var router = express.Router(); 
const request = require("request"); 

/* GET search page. */
router.get('/', function(req, res) {
    res.render('search', {
        pageId: 'search'
    });
});


/* GET artist info. */
router.get('/:search', function(req, res) {
    const jwtToken = "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik05OVpGUEMyR1UifQ.eyJpYXQiOjE1MjAyODgwNDQsImV4cCI6MTUzNTg0MDA0NCwiaXNzIjoiUzJaUDI1NlBQSyJ9.aHYYWnOKFNxP-l5gXFq8SUurmtDuGvf_ZklQfFXgT-IlPrlXtXUIvHLDUz_psHQNyVwQeN8SxdEcgzMNR2x9Kg"
    var thisSearch = req.params.search;
    request.get(  
    {  
        url: `https://api.music.apple.com/v1/catalog/us/search?term=${thisSearch}&types=artists,albums`,  
        auth: {  
            bearer: jwtToken  
        },  
        json: true  
    },  
    (err, httpResponse, body) => {  
        if (err) {  
            console.error(err);  
        } else { 
            res.json(body);
        }  
    })
});

module.exports = router;
