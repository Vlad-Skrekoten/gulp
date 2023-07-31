
const gulp = require('gulp');
const fileInclude = require('gulp-file-include');

//SASS
const sass = require('gulp-sass')(require('sass'));

const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const map = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const { error } = require('console');


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

gulp.task('html:dev', function () {
    return gulp.src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
        .pipe(changed('./build/', { hasChanged: changed.compareContents }))
        .pipe(plumber(plumberNotify))
        .pipe(fileInclude(fileIncludeSet))
        .pipe(gulp.dest('./build/'));
});

gulp.task('sass:dev', function () {
    return gulp.src('./src/scss/*.scss')
        .pipe(changed('./build/css/'))
        .pipe(plumber(plumberNotify))
        .pipe(map.init())
        .pipe(sass())
        .pipe(map.write())
        .pipe(gulp.dest('./build/css/'))
});

gulp.task('images:dev', function () {
    return gulp.src('./src/img/**/*')
        .pipe(changed('./build/img/'))
        .pipe(imagemin({ verbose: true }))
        .pipe(gulp.dest('./build/img/'));
});

gulp.task('fonts:dev', function () {
    return gulp.src('./src/fonts/**/*')
        .pipe(changed('./build/fonts/'))
        .pipe(gulp.dest('./build/fonts/'));
});

gulp.task('files:dev', function () {
    return gulp.src('./src/files/**/*')
        .pipe(changed('./build/files/'))
        .pipe(gulp.dest('./build/files/'));
});

const ServerOptions = {
    lifeReload: true,
    open: true,
}

gulp.task('server:dev', function () {
    return gulp.src('./build/')
        .pipe(server({ ServerOptions }));
});

gulp.task('clean:dev', function (done) {
    if (fs.existsSync('./build/')) {
        return gulp.src('./build/', { read: false })
            .pipe(clean({ force: true }));
    }
    done();
});

gulp.task('watch:dev', function () {
    gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:dev'));
    gulp.watch('./src/**/*.html', gulp.parallel('html:dev'));
    gulp.watch('./src/img/**/*', gulp.parallel('images:dev'));
    gulp.watch('./src/fonts/**/*', gulp.parallel('fonts:dev'));
    gulp.watch('./src/files/**/*', gulp.parallel('files:dev'));
});
