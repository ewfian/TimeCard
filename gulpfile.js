// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    babel = require('gulp-babel'),
    minifycss = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create(),
    del = require('del');


// 静态服务器
gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
});


// Styles
gulp.task('styles', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .on('error', sass.logError)
        .pipe(autoprefixer('last 2 version'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cssnano())
        .pipe(minifycss())
        .pipe(gulp.dest('dist/styles'))
        .pipe(browserSync.reload({
            stream: true
        }));

});

// Scripts
gulp.task('scripts', function () {
    return gulp.src('src/scripts/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/scripts'));
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
gulp.task('watch', ['default', 'serve'], function () {

    // Watch .scss files
    gulp.watch('src/scss/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('src/scripts/**/*.js', ['scripts']);

    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', browserSync.reload);
    gulp.watch(['*.html']).on('change', browserSync.reload);

});
