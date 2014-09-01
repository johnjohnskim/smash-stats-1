var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('server', function() {
  nodemon({
    script: 'server.js',
    ext: 'js'
  }).on('restart', function() {
    console.log('restarting...');
  })
});

gulp.task('default', ['server']);
