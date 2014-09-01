var path = require('path');
var gulp = require('gulp');
var less = require('gulp-less');
var react = require('gulp-react');
var nodemon = require('gulp-nodemon');
var livereload = require('gulp-livereload');


gulp.task('less', function() {
  gulp.src('./less/app.less')
    .pipe(less())
    .pipe(gulp.dest('./public/css'))
});

gulp.task('react', function() {
  gulp.src('react/*.jsx')
    .pipe(react())
    .pipe(gulp.dest('./public/js'))
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
  livereload.listen();
  gulp.watch(['./less/*.less'], ['less']);
  gulp.watch(['./react/*.jsx'], ['react']);
  gulp.watch(['./less/**', './react/**', './views/**'])
    .on('change', livereload.changed);
})

gulp.task('default', ['watch', 'less', 'react', 'server']);
