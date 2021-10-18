var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  console.log(req.body);
  console.log(...req.body.className);
  console.log(req.body.className);
  res.render('index', { title: 'Express' });
})

module.exports = router;
