var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync");
var imagemin = require("gulp-imagemin");
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var concat = require("gulp-concat");
var autoprefixer = require('gulp-autoprefixer');
var connect = require('gulp-connect-php');

// sassとかcssとか周りのプラグインの処理
gulp.task('sasscompiler', function(){
  return gulp.src("src/sass/*.scss")
    .pipe(plumber({
      errorHandler: function(err) {
        console.log(err.messageFormatted);
        this.emit('end');
      }
    }))
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 version', 'iOS >= 7.1', 'Android >= 4.0','ie 11']
    }))
    .pipe(gulp.dest('src/dist'))
    .pipe(browserSync.stream());
});
// jsの圧縮とmain.jsに統合する処理
gulp.task('js', function(){
  return gulp.src("src/js/*.js")
    .pipe(plumber())
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('src/dist'));
});
// 画像を圧縮する処理
gulp.task('img-min', function(){
  return gulp.src("src/images/*")
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest("src/dist/images"));
});
// PHPでブラウザのオートリロード機能を使うための処理
gulp.task('connect-sync', function() {
  connect.server({
    port:3001,
    base:'src',
    bin: 'C:/xampp/php/php.exe',
    ini: 'C:/xampp/php/php.ini'
  }, function (){
    browserSync({
      proxy: 'localhost:3001'
    });
  });
});
gulp.task('reload', function(){
  browserSync.reload();
});

// defaultタスク
gulp.task("default",['connect-sync'],function(){
  gulp.watch("src/sass/*.scss",['sasscompiler']);
  gulp.watch("src/js/*.js", ['js']);
  gulp.watch("src/images/*", ['img-min']);
  gulp.watch(["src/*.html", "src/js/*.js", "src/*.php"],['reload']);
});
