// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    compass = require('gulp-compass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    browserSync = require("browser-sync").create();
    del = require('del');


// 静态服务器
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});


// Styles
gulp.task('styles', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .on('error', sass.logError)
        .pipe(autoprefixer('last 2 version'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssnano())
        .pipe(minifycss())
        .pipe(gulp.dest('dist/styles'))
        .pipe(browserSync.reload({stream: true}));

});

// Scripts
gulp.task('scripts', function () {
    return gulp.src('src/scripts/**/*.js')
        //.pipe(jshint('.jshintrc'))
        //.pipe(jshint.reporter('default'))
        //.pipe(concat('main.js'))
        //.pipe(gulp.dest('dist/scripts'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'))
});

gulp.task('lib', function () {
    //bootstrap
    gulp.src('src/lib/bootstrap/dist/css/bootstrap.min.css')
        .pipe(gulp.dest('dist/lib/css'));
    gulp.src('src/lib/bootstrap/dist/fonts/*.*')
        .pipe(gulp.dest('dist/lib/fonts'));
    gulp.src('src/lib/bootstrap/dist/js/bootstrap.min.js')
        .pipe(gulp.dest('dist/lib/js'));
    //jquery
    gulp.src('src/lib/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('dist/lib/js'));
    //font-awesome
    gulp.src('src/lib/font-awesome/css/font-awesome.min.css')
        .pipe(gulp.dest('dist/lib/css'));
    gulp.src('src/lib/font-awesome/fonts/*.*')
        .pipe(gulp.dest('dist/lib/fonts'));
});

// Clean
gulp.task('clean', function () {
    return del(['dist/styles', 'dist/scripts', 'dist/compass-css', 'dist/lib']);
});

// Default task
gulp.task('default', ['clean'], function () {
    gulp.start('lib', 'styles', 'scripts');
});

// Watch
gulp.task('watch',['default','serve'], function () {

    // Watch .scss files
    gulp.watch('src/scss/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('src/scripts/**/*.js', ['scripts']);

    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', browserSync.reload);
    gulp.watch(['*.html']).on('change', browserSync.reload);

});
