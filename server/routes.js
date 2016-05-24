/**
 * Created by davidtmeadsjr on 5/15/16.
 */
var express = require('express');
var router = express.Router();


router.get('/',
    function(req, res, next) {
        res.render('index', {
        });
    });

router.get('/index2.html',
    function(req, res, next) {
        res.render('index2', {
        });
    });
router.get('/position.html',
    function(req, res, next) {
        res.render('position', {
        });
    });


module.exports = router;