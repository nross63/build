var gulp = require('gulp'),
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    prefix = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    coffee = require('gulp-coffee'),
    imagemin = require('gulp-imagemin'),
    html = require('gulp-minify-html'),
    coffeelint = require('gulp-coffeelint'),
    csslint = require('gulp-csslint'),
    paths = {
        js: 'js/**/*.js',
        coffee: 'coffee/**/*.coffee',
        images: 'img/**/*',
        sass: 'scss/**/*.scss',
        css: './css/*.css',
        html: ['html/**/*.html', '*.html']
    };

/*--------------------------------------------------------------------------------------------------- HTML
 */

// minify HTML
gulp.task('gulpHTML', function() {
    gulp.src(paths.html)
        .pipe(minifyHTML())
        .pipe(gulp.dest('dist/html/'));
    gulp.src('./index.html')
        .pipe(minifyHTML())
        .pipe(gulp.dest('dist/index.html'));
});

// Watch HTML
gulp.task('watchHTML', function() {
    gulp.watch(['html/**/*.html', 'index.html'], ['gulpHTML']);
});

/*--------------------------------------------------------------------------------------------------- COFFEESCRIPT
 */

// Lint CoffeeScript
gulp.task('clint', function() {
    gulp.src('./src/*.coffee')
        .pipe(coffeelint())
        .pipe(coffeelint.reporter())
});
// Compile CoffeeScript
gulp.task('gulpCS', function() {
    return gulp.src(path.coffee)
        .pipe(coffee())
        .pipe(uglify())
        .pipe(gulp.dest('./js/'));
});

// Watch CoffeeScript
gulp.task('watchCS', function() {
    gulp.watch('cofee/**/*.coffee', ['clint', 'gulpCS']);
});

/*--------------------------------------------------------------------------------------------------- JAVASCRIPT
 */

// Lint JS
gulp.task('lint', function() {
    return gulp.src(paths.js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concat & Minify JS
gulp.task('gulpJS', function() {
    return gulp.src('src/*.js')
        .pipe(uglify())
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist/js/'))
        .pipe(rename('all.min.js'))
        .pipe(gulp.dest('dist/js/'));
});

// Watch JS
gulp.task('watchJS', function() {
    gulp.watch('js/**/*.js', ['lint', 'gulpJS']);
});

/*--------------------------------------------------------------------------------------------------- SASS/CSS
 */

// Autoprefix SCSS/CSS targeting last 2 verstions, browsers > 5%, ie 9, ie 8
gulp.task('prefix', function() {
    gulp.src(paths.css)
        .pipe(prefix(["last 1 version", "ie 8"], {
            cascade: true
        }))
        .pipe(gulp.dest('./css/'));
});

// Compile SASS to CSS JS
gulp.task('sass', function() {
    gulp.src('scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'));
});

// Concat & Minify CSS
gulp.task('gulpCSS', function() {
    return gulp.src('./css/*.css')
        .pipe(concat('all.css'))
        .pipe(gulp.dest('dist/css/'))
        .pipe(rename('all.min.css'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/css/'));
});

// Watch CSS
gulp.task('watchSCSS', function() {
    gulp.watch('scss/**/*.scss', ['sass', 'gulpCSS']);
});

/*--------------------------------------------------------------------------------------------------- IMGS
 */

// Minify Images
gulp.task('images', function() {
    gulp.src(paths.images)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.images));
});


// Watch Images
gulp.task('watchIMGS', function() {
    gulp.watch(paths.images, ['images']);
});

/*--------------------------------------------------------------------------------------------------- Main Tasks
 */

// Default
gulp.task('default', ['watchHTML', 'watchSCSS', 'watchJS', 'watchIMGS']);

// Default with CoffeeScript
gulp.task('default', ['watchHTML', 'watchSCSS', 'watchCS', 'watchJS', 'watchIMGS']);

gulp.task('HTML', 'watchHTML');

gulp.task('SCSS', 'watchSCSS');

gulp.task('COFFEE', 'watchCS');

gulp.task('JS', 'watchJS');

gulp.task('IMGS', 'watchIMGS');
