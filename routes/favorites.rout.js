var express = require('express');
var router = express.Router(); 
var request = require('request');  

/* GET "this week" page. */
router.get('/', function(req, res, next) {
    res.render('favorites', { 
      pageTitle: '',
      subTitle: `Our Favorite Albums of ${(new Date()).getFullYear()}`
  });
});

/* GET album info. */
router.get('/album/:albumId', function(req, res, next) {
  const jwtToken = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik05OVpGUEMyR1UifQ.eyJpYXQiOjE1MjAyODgwNDQsImV4cCI6MTUzNTg0MDA0NCwiaXNzIjoiUzJaUDI1NlBQSyJ9.aHYYWnOKFNxP-l5gXFq8SUurmtDuGvf_ZklQfFXgT-IlPrlXtXUIvHLDUz_psHQNyVwQeN8SxdEcgzMNR2x9Kg';
  var thisAlbum = req.params.albumId;
  request.get(  
    {  
      url: `https://api.music.apple.com/v1/catalog/us/albums/${thisAlbum}`,  
      auth: {  
        bearer: jwtToken  
      },  
      json: true  
    },  
    (err, response, body) => {  
      if (err) {  
        console.log(err);  
      } else { 
        res.json(body);
      }  
    }
  )
});

module.exports = router;
