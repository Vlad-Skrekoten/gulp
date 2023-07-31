
const gulp = require('gulp');

//Html
const fileInclude = require('gulp-file-include');
const htmlclean = require('gulp-htmlclean');
const webphtml = require('gulp-webp-html');
//SASS
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const webpcss = require ('gulp-webp-css');

//images
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');

const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const map = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const changed = require('gulp-changed');
const { error } = require('console');
const groupMedia = require('gulp-group-css-media-queries');


const fileIncludeSet = {
    prefix: '@@',
    basepath: '@file',
};

const plumberNotify = (title) => {
    return {
        errorHandler: notify.onError({
            title: title,
            message: 'Error <%= error.message %>',
            sound: false,
        }),
    };
}

gulp.task('html:docs', function () {
    return gulp.src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
        .pipe(changed('./docs/'))
        .pipe(plumber(plumberNotify))
        .pipe(fileInclude(fileIncludeSet))
        .pipe(webphtml())
        .pipe(htmlclean())
        .pipe(gulp.dest('./docs/'));
});

gulp.task('sass:docs', function () {
    return gulp.src('./src/scss/*.scss')
        .pipe(changed('./docs/css/'))
        .pipe(plumber(plumberNotify))
        .pipe(groupMedia())
        .pipe(map.init())
        .pipe(autoprefixer())
        .pipe(webpcss())
        .pipe(sass())
        .pipe(csso())
        .pipe(map.write())
        .pipe(gulp.dest('./docs/css/'))
});

gulp.task('images:docs', function () {
    return gulp.src('./src/img/**/*')
        .pipe(changed('./docs/img/'))
        .pipe(webp())
        .pipe(gulp.dest('./docs.js/img/'))
        .pipe(gulp.src('./src/img/**/*'))
        .pipe(imagemin({ verbose: true }))
        .pipe(gulp.dest('./docs/img/'));
});

gulp.task('fonts:docs', function () {
    return gulp.src('./src/fonts/**/*')
        .pipe(changed('./docs/fonts/'))
        .pipe(gulp.dest('./docs/fonts/'));
});

gulp.task('files:docs', function () {
    return gulp.src('./src/files/**/*')
        .pipe(changed('./docs/files/'))
        .pipe(gulp.dest('./docs/files/'));
});

const ServerOptions = {
    lifeReload: true,
    open: true,
}

gulp.task('server:docs', function () {
    return gulp.src('./docs/')
        .pipe(server({ ServerOptions }));
});

gulp.task('clean:docs', function (done) {
    if (fs.existsSync('./docs/')) {
        return gulp.src('./docs/', { read: false })
            .pipe(clean({ force: true }));
    }
    done();
});
