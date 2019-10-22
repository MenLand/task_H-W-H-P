const gulp = require('gulp');
const uglify = require('gulp-uglify');
const babel = require("gulp-babel");
const sass = require('gulp-sass')
const zip = require('gulp-zip');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const clean = require('gulp-clean');

function buildHtmlDist(cb) {
    gulp.src('src/index.html') //Выберем файлы по нужному пути
        .pipe(gulp.dest('dist')) //Выплюнем их в папку build
    cb();
};

function buildJsDist(cb) {
    gulp.src('src/js/**/*')
        .pipe(babel())
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/js'))
    cb()
}

function buildCssDist(cb) {
    gulp.src('src/sass/**/*.scss')
        .pipe(autoprefixer())
        .pipe(concat('main.css'))
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(rename({
            suffix: ".min",
        }))
        .pipe(gulp.dest('dist/css'))
    cb()
}


function buildZip(cb) {
    gulp.src('dist/*')
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('./'))
    cb()
};

function buildImageDist(cb) {
    gulp.src('src/img/**/*') //Выберем наши картинки
        .pipe(imagemin({
            optimizationLevel: 5,
        }))
        .pipe(gulp.dest('dist/img'));
    cb()
};

function buildFontsDist(cb) {
    gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
    cb();
};

// -------------------------  SRC  ----------------------------------

function buildCssSrc(cb) {
    gulp.src('src/sass/**/*.scss')
        .pipe(sass({ outputStyle: 'nested' }).on('error', sass.logError))
        .pipe(concat('main.css'))
        .pipe(rename({
            suffix: ".min",
        }))
        .pipe(gulp.dest('src/css'))
    cb()
}

function buildJsSrc(cb) {
    gulp.src('src/js/**/*')
        .pipe(concat('main.js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('src/js'))
    cb()
}

function cleanAll(cb) {
    gulp.src('dist/*')
        .pipe(clean());
    cb()
}


function watchAllFiles() {
    gulp.watch('src/sass/**/*', buildCssSrc);
    gulp.watch(['src/js/**/*', '!src/js/main.min.js'], buildJsSrc);
}


exports.buildHtmlDist = buildHtmlDist;
exports.buildJsDist = buildJsDist;
exports.buildCssDist = buildCssDist;
exports.buildZip = buildZip;
exports.buildImageDist = buildImageDist;
exports.buildFontsDist = buildFontsDist;

exports.buildCssSrc = buildCssSrc;
exports.buildJsSrc = buildJsSrc;
exports.cleanAll = cleanAll;


exports.default = gulp.series(cleanAll, watchAllFiles);
exports.build = gulp.series(
    cleanAll,
    buildHtmlDist,
    buildJsDist,
    buildCssDist,
    buildImageDist,
    buildFontsDist,
    buildZip
);