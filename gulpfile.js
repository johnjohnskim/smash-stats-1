var path = require('path');
var gulp = require('gulp');
var reactify = require('reactify');
var rename = require('gulp-rename');
var less = require('gulp-less');
var react = require('gulp-react');
var browserify = require('gulp-browserify');
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

gulp.task('reactify', function() {
  gulp.src('react/*.js', {read: false})
    .pipe(browserify({
      transform: ['reactify'],
      extensions: ['.js'],
    }))
    .pipe(gulp.dest('public/js'))
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
  gulp.watch(['./react/*.js'], ['reactify']);
  // gulp.watch(['./react/*.jsx'], ['react']);
  gulp.watch(['./less/**', './react/**', './views/**'])
    .on('change', livereload.changed);
})

gulp.task('default', ['watch', 'less', 'reactify', 'server']);
