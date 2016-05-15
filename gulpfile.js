var gulp = require('gulp');
var jade = require('gulp-jade');

gulp.task('jade', function() {
    gulp.src('./angular/*.jade')
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('./built/angular'));
});
