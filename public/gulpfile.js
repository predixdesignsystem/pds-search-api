const gulp = require('gulp');
const del = require('del');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');
const importOnce = require('node-sass-import-once');
const stylemod = require('gulp-style-modules');
const path = require('path');

const sassOptions = {
  importer: importOnce,
  importOnce: {
    index: true,
    bower: true
  }
};

const autoprefixerOptions = {
  browsers: ['last 2 versions'],
  cascade: false,
  flexbox: false
};

gulp.task('sass:clean', function() {
  return del(['./css/**/*']);
});

gulp.task('sass:build', function() {
  return gulp.src(['./sass/*.scss'])
    .pipe(sass(sassOptions))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(cssmin())
    .pipe(stylemod({
      moduleId: function(file) {
        return path.basename(file.path, path.extname(file.path)) + '-styles';
      }
    }))
    .pipe(gulp.dest('./css'))
});

gulp.task('sass', ['sass:clean', 'sass:build']);

gulp.task('watch', function() {
  gulp.watch('sass/*', ['sass']);
});

gulp.task('default', ['sass']);
