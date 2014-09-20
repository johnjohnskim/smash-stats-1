var path = require('path');
var gulp = require('gulp');
var reactify = require('reactify');
var rename = require('gulp-rename');
var less = require('gulp-less');
var react = require('gulp-react');
var browserify = require('gulp-browserify');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var livereload = app.get('env') === 'development' ? require('gulp-livereload') : null;
var nodemon = app.get('env') === 'development' ? require('gulp-nodemon') : null;


gulp.task('less', function() {
  gulp.src('./less/app.less')
    .pipe(less())
    .pipe(minifyCss())
    .pipe(gulp.dest('./build/css'))
});

// gulp.task('react', function() {
//   gulp.src('react/*.jsx')
//     .pipe(react())
//     .pipe(gulp.dest('./build/js'))
// });

gulp.task('reactify', function() {
  gulp.src('react/*.jsx', {read: false})
    .pipe(browserify({
      transform: ['reactify'],
      extensions: ['.jsx'],
    }))
    .pipe(uglify())
    .pipe(rename(function(path) {
      path.basename += '-bundle';
      path.extname = '.js';
    }))
    .pipe(gulp.dest('./build/js'))
});

gulp.task('server', function() {
  nodemon({
    script: 'app.js',
    ext: 'js',
    ignore: ['build/**'],
    env: {'NODE_ENV': 'development'}
  }).on('restart', function() {
    console.log('restarting...');
  })
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(['./less/*.less'], ['less']);
  gulp.watch(['./react/*.jsx'], ['reactify']);
  // gulp.watch(['./react/*.jsx'], ['react']);
  gulp.watch(['./build/**'])
    .on('change', livereload.changed)
});

gulp.task('dev', ['watch', 'less', 'reactify', 'server']);
gulp.task('default', ['less', 'reactify']);
