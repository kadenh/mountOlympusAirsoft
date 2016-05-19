/**
 * Created by davidtmeadsjr on 5/15/16.
 */
var express = require('express');
var request = require('superagent');
var router = express.Router();
var async = require('async');


router.get('/',
    function(req, res, next) {
        res.render('index', {
        });
    });


module.exports = router;