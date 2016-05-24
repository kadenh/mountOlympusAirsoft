var gulp = require('gulp');
var ejs = require('gulp-ejs');
var runSequence = require('run-sequence');
var del = require('del');
var browserSync = require('browser-sync').create();
var spawn = require('child_process').spawn;
var ngdocs = require('gulp-ngdocs');
var fs = require('fs');

// Reference to running spawned processes
var node_process, inspector_process;

gulp.task('build-server', function() {
    return gulp.src(['server/**/*'])
        .pipe(gulp.dest('built'));
});

gulp.task('build-css', function() {
    return gulp.src(['css/**/*'])
        .pipe(gulp.dest('built/public/css'));
});

gulp.task('build-js', function() {
    return gulp.src(['js/**/*'])
        .pipe(gulp.dest('built/public/js'));
});

gulp.task('build-images', function() {
    return gulp.src(['images/**/*'])
        .pipe(gulp.dest('built/public/images'));
});

gulp.task('build-bower-components', function() {
    return gulp.src(['bower_components/**/*'])
        .pipe(gulp.dest('built/public/bower_components'));
});

gulp.task('build-elements', ['ejs']);
// Uncomment the below line when you add another page,
// rename to match the page name,
// uncomment the associated gulp task below, and rename the same
// gulp.task('build-elements', ['build-elements-index','build-elements-another-page']);


gulp.task('ejs', function() {
    gulp.src('./views/*.ejs')
        .pipe(ejs({
            pretty: true
        }))
        .pipe(gulp.dest('./built/public/'))
        ;
});


gulp.task('clean', function() {
    return del(['built/**/*']);
});

gulp.task('build', function(cb) {
    runSequence(
        'clean',
        ['build-server','build-css', 'build-js','build-images','build-elements','build-bower-components'],
        cb
    );
});

gulp.task('browser-sync', function(cb) {
    browserSync.init({
        proxy: "localhost:5000",
        socket: {
            protocol: "http",
            domain: "dev.mountolympusairsoft.com"
        },
        open: false,
    });
    cb();
});

// Function for calling browserSync.reload, and the gulp callback
var browserSyncReload = function(cb){
    browserSync.reload();
    // Very Important that we call the callback 'cb' at the end of this,
    // because the browserSync.reload function doesn't tell gulp it is done
    cb();
};
// Gulp task to wrap the browserSyncReload function above
gulp.task('browserSyncReload', browserSyncReload);

gulp.task('update-js', ['build-js'], browserSyncReload);
gulp.task('update-css', ['build-css'], browserSyncReload);
gulp.task('update-images', ['build-images'], browserSyncReload);
gulp.task('update-bower-components', ['build-bower-components'], browserSyncReload);
gulp.task('update-elements', ['build-elements'], browserSyncReload);

// When we update the server files, don't reload the browser
// Reloading won't wait until node is all the way up and running
gulp.task('update-server', function(cb) {
    runSequence(
        'build-server',
        'node',
        cb
    );
});
gulp.task('watch', function(cb) {
    gulp.watch(['server/**/*'], ['update-server']);
    gulp.watch(['css/**/*'], ['update-css']);
    gulp.watch(['images/**/*'], ['update-images']);
    gulp.watch(['angular/**/*'], ['update-elements']);
    gulp.watch(['js/**/*'], ['update-js']);
    cb();
});

gulp.task('node', function(cb) {
    if (node_process) node_process.kill();
    node_process = spawn(((isWin)?'heroku.bat':'heroku'), ['local','-f','Procfile.debug'], {stdio: 'inherit'});
    node_process.on('close', function (code) {
        if (code === 8) {
            gulp.log('Error detected, waiting for changes...');
        }
    });
    // The callback will fire before node is ready
    // Node doesn't have a way to tell us when the app is completely running
    cb();
});

gulp.task('dev',['build'], function(cb) {
    runSequence(
        'node',
        'browser-sync',
        'watch',
        cb
    );
});

gulp.task('node-inspector', function(cb) {
    if (inspector_process) inspector_process.kill();
    inspector_process = spawn('node-inspector', [], {stdio: 'inherit'});
    inspector_process.on('close', function (code) {
        if (code === 8) {
            gulp.log('Error detected, waiting for changes...');
        }
    });
    // The callback will fire before node_inspector is ready
    // processes doesn't have a way to tell us when they are ready for requests
    cb();
});
gulp.task('debug',['dev'], function(cb) {
    runSequence(
        'node-inspector',
        cb
    );
});
gulp.task('default',['build'], function(cb) {
    cb();
});

// clean up if an error goes unhandled.
process.on('exit', function() {
    if (node_process) node_process.kill();
    if (inspector_process) inspector_process.kill();
});

// is running windows?  Needs special attention
var isWin = /^win/.test(process.platform);

