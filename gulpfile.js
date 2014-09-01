var path = require('path');
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var less = require('gulp-less');
var react = require('gulp-react');

var paths = {
  less: [path.join(__dirname, 'less', 'includes')]
};

gulp.task('less', function() {
  gulp.src('./less/app.less')
    .pipe(less({
      paths: paths.less,
    }))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('server', function() {
  nodemon({
    script: 'app.js',
    ext: 'js',
    env: {'NODE_ENV': 'development'}
  }).on('restart', function() {
    console.log('restarting...');
  })
});

gulp.task('watch', function() {
  gulp.watch(['./less/*.less'], ['less']);
})

gulp.task('default', ['watch', 'less', 'server']);
