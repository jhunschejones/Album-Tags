var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { 
      pageTitle: "",
      subTitle: "What is Josh listening to this week?"
  });
});

module.exports = router;
