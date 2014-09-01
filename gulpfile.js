var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('server', function() {
  nodemon({
    script: 'app.js',
    ext: 'js',
    env: {'NODE_ENV': 'development'}
  }).on('restart', function() {
    console.log('restarting...');
  })
});

gulp.task('default', ['server']);
