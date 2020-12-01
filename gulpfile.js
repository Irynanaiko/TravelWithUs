const {
    src,
    dest,
    series,
    watch,
    parallel
} = require('gulp');

const del = require('del');

const sass = require('gulp-sass');
sass.compiler = require('node-sass');

const sourcemaps = require('gulp-sourcemaps');
const connect = require('gulp-connect');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

const paths = {
    src: 'src/',
    dist: 'dist/'
};

function connectServer(cb) {
    connect.server({
        port: 4200,
        root: paths.dist,
        livereload: true,
    });

    cb();
}

function html() {
    return src(paths.src + 'index.html')
        .pipe(connect.reload())
        .pipe(dest(paths.dist));
}

function styles() {
    return src(paths.src + 'styles/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('.'))
        .pipe(connect.reload())
        .pipe(dest(paths.dist));
}


function assets() {
    return src(paths.src + 'assets/**/*.*')
        .pipe(connect.reload())
        .pipe(dest(paths.dist + 'assets'));
}

function clean() {
    return del(paths.dist + '**', {
        force: true
    });
}

function watching(cb) {
    watch(paths.src + 'index.html', html);
    watch(paths.src + '**/*.scss', styles);
    watch(paths.src + 'assets/**/*.*', assets);

    cb();
}

exports.build = series(clean, html, styles, assets);
exports.default = series(clean, html, styles, assets, parallel(connectServer, watching));