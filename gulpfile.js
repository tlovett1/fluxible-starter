'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var nodemon = require('gulp-nodemon');
var webpack = require('gulp-webpack');

gulp.task('lint', function () {
    return gulp.src(['*.js', '**/*.js','!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('nodemon', function(cb) {
    var started = false;

    return nodemon({
        tasks: ['webpack'],
        script: 'start.js',
        verbose: true,
        ignore: ['build/js/*'],
        ext: 'js,jsx'
    }).on('start', function() {
        if (!started) {
            cb();
            started = true;
        }
    });
});

gulp.task('webpack', function(cb) {
    return gulp.src('./client.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('build/js'));
});

gulp.task('default', ['webpack', 'nodemon']);
