var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    watch = require('gulp-watch'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    prefix = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    coffee = require('gulp-coffee'),
    imagemin = require('gulp-imagemin'),
    minify = require('gulp-minify-html'),
    coffeelint = require('gulp-coffeelint'),
    csslint = require('gulp-csslint'),
    rimraf = require('rimraf'),
    sourcemaps = require('gulp-sourcemaps'),
    paths = {
        src: {
            js: './js/**/*.js',
            coffee: './coffee/**/*.coffee',
            images: './img/**/*',
            sass: './sass/*.scss',
            css: {
                start: './stylesheets/*.css',
                end: './build/css/*.css',
            },
            html: './*.html'
        },
        dst: {
            css: {
                start: './stylesheets/',
                end: './build/css/',
            },
            js: './build/js/',
            images: './build/img/',
            root: './build/'
        }

    };
gulp.task('clean', function(cb) {
    rimraf(paths.dst.root, cb);
});
/*--------------------------------------------------------------------------------- HTML
 */

// minify HTML
gulp.task('gulpHTML', function() {
    return gulp.src(paths.src.html)
        .pipe(minify())
        .pipe(gulp.dest(paths.dst.root));
});

// Watch HTML
gulp.task('watchHTML', function() {
    return watch(paths.src.html, ['gulpHTML']);
});

/*------------------------------------------------------------------------ COFFEESCRIPT
 */

// Lint CoffeeScript
gulp.task('lint-coffee', function() {
    return gulp.src(paths.src.coffee)
        .pipe(coffeelint())
        .pipe(coffeelint.reporter());
});
// Compile CoffeeScript
gulp.task('gulpCS', function() {
    return gulp.src(paths.src.coffee)
        .pipe(coffee())
        .pipe(concat('all.js'))
        .pipe(gulp.dest(paths.dst.js))
        .pipe(uglify())
        .pipe(rename('all.min.js'))
        .pipe(gulp.dest(paths.dst.js));
});

// Watch CoffeeScript
gulp.task('watchCS', function() {
    return watch(paths.src.coffee, ['lint-coffee', 'gulpCS']);
});

/*-------------------------------------------------------------------------- JAVASCRIPT
 */

// Lint JS
gulp.task('jshint', function() {
    return gulp.src(paths.src.js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concat & Minify JS
gulp.task('gulpJS', function() {
    return gulp.src(paths.src.js)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename('all.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dst.js));
});

// Watch JS
gulp.task('watchJS', function() {
    return watch(paths.src.js, ['gulpJS']);
});

/*--------------------------------------------------------------------------- SASS/CSS
 */

gulp.task('sass', function() { //Currently using compass to watch & compile SASS
    return gulp.src(paths.src.sass)
        .pipe(sass({
            sourcemap: true
        }))
        .pipe(gulp.dest(paths.dst.css));
});

// Autoprefix CSS targeting last 1 version
gulp.task('prefix', function() {
    return gulp.src(paths.src.css.start)
        .pipe(prefix(['last 1 version'], {
            cascade: true
        }))
        .pipe(gulp.dest(paths.dst.css.start));
});

gulp.task('csslint', ['prefix'], function() {
    return gulp.src(paths.src.css.start)
        .pipe(csslint())
        .pipe(csslint.reporter());
});

// Concat & Minify CSS
gulp.task('gulpCSS', ['prefix'], function() {
    return gulp.src(paths.src.css.start)
        .pipe(minifyCSS())
        .pipe(concat('all.min.css'))
        .pipe(gulp.dest(paths.dst.css.end))
        .pipe(rename('all.min.css'))
        .pipe(gulp.dest(paths.dst.css.end));
});

// Watch CSS
gulp.task('watchCSS', function() {
    return watch(paths.src.css.start, ['prefix', 'csslint', 'gulpCSS']);
});

/*-------------------------------------------------------------------------------- IMGS
 */

// Minify Images
gulp.task('images', function() {
    return gulp.src(paths.src.images)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.dst.images));
});


// Watch Images
gulp.task('watchIMGS', function() {
    watch(paths.src.images, ['images']);
});

/*-------------------------------------------------------------------------- TASK GROUPS
 */


// Default watch JS, CSS, HTML, and IMG files. Run tasks on changes.
gulp.task('default', ['watchJS', 'watchCSS', 'watchHTML', 'watchIMGS']);

gulp.task('ALL', ['html', 'css', 'coffeeScript', 'images']);

gulp.task('HTML', ['watchHTML']);

gulp.task('SCSS', ['watchSCSS']);

gulp.task('COFFEE', ['watchCS']);

gulp.task('JS', ['watchJS']);

gulp.task('IMGS', ['watchIMGS']);

gulp.task('CLEAN', ['clean']);
