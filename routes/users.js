var express = require('express');
var router = express.Router(); 
const request = require("request");  

/* GET album 1 info. */
router.get('/album1', function(req, res) {
  const jwtToken = "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik05OVpGUEMyR1UifQ.eyJpYXQiOjE1MjAyODgwNDQsImV4cCI6MTUzNTg0MDA0NCwiaXNzIjoiUzJaUDI1NlBQSyJ9.aHYYWnOKFNxP-l5gXFq8SUurmtDuGvf_ZklQfFXgT-IlPrlXtXUIvHLDUz_psHQNyVwQeN8SxdEcgzMNR2x9Kg"
  
  request.get(  
    {  
      url: "https://api.music.apple.com/v1/catalog/us/albums/1338961464",  
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
    }
  )
});

/* GET album 2 info. */
router.get('/album2', function(req, res) {
  const jwtToken = "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik05OVpGUEMyR1UifQ.eyJpYXQiOjE1MjAyODgwNDQsImV4cCI6MTUzNTg0MDA0NCwiaXNzIjoiUzJaUDI1NlBQSyJ9.aHYYWnOKFNxP-l5gXFq8SUurmtDuGvf_ZklQfFXgT-IlPrlXtXUIvHLDUz_psHQNyVwQeN8SxdEcgzMNR2x9Kg"
  
  request.get(  
    {  
      url: "https://api.music.apple.com/v1/catalog/us/albums/1074379425",  
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
    }
  )
});

/* GET album 3 info. */
router.get('/album3', function(req, res) {
  const jwtToken = "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik05OVpGUEMyR1UifQ.eyJpYXQiOjE1MjAyODgwNDQsImV4cCI6MTUzNTg0MDA0NCwiaXNzIjoiUzJaUDI1NlBQSyJ9.aHYYWnOKFNxP-l5gXFq8SUurmtDuGvf_ZklQfFXgT-IlPrlXtXUIvHLDUz_psHQNyVwQeN8SxdEcgzMNR2x9Kg"
  
  request.get(  
    {  
      url: "https://api.music.apple.com/v1/catalog/us/albums/1334753255",  
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
    }
  )
});

/* GET album 4 info. */
router.get('/album4', function(req, res) {
  const jwtToken = "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik05OVpGUEMyR1UifQ.eyJpYXQiOjE1MjAyODgwNDQsImV4cCI6MTUzNTg0MDA0NCwiaXNzIjoiUzJaUDI1NlBQSyJ9.aHYYWnOKFNxP-l5gXFq8SUurmtDuGvf_ZklQfFXgT-IlPrlXtXUIvHLDUz_psHQNyVwQeN8SxdEcgzMNR2x9Kg"
  
  request.get(  
    {  
      url: "https://api.music.apple.com/v1/catalog/us/albums/1296409535",  
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
    }
  )
});

/* GET album 5 info. */
router.get('/album5', function(req, res) {
  const jwtToken = "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik05OVpGUEMyR1UifQ.eyJpYXQiOjE1MjAyODgwNDQsImV4cCI6MTUzNTg0MDA0NCwiaXNzIjoiUzJaUDI1NlBQSyJ9.aHYYWnOKFNxP-l5gXFq8SUurmtDuGvf_ZklQfFXgT-IlPrlXtXUIvHLDUz_psHQNyVwQeN8SxdEcgzMNR2x9Kg"
  
  request.get(  
    {  
      url: "https://api.music.apple.com/v1/catalog/us/albums/1241196179",  
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
    }
  )
});
module.exports = router;
