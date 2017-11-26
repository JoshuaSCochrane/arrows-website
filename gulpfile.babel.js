import gulp from 'gulp'
import runSequence from 'run-sequence'
import babel from 'gulp-babel'
import cleancss from 'gulp-clean-css'
import download from 'gulp-download'
import htmlmin from 'gulp-htmlmin'
import shell from 'gulp-shell'
import uglify from 'gulp-uglify'

const paths = {
  relative: [
    '../arrows/dist/arrows.js',
    '../arrows/dist/arrows.es5.js',
    '../arrows/dist/arrows.min.js'
  ],
  vendor: [
    'https://github.com/efritz/arrows/releases/download/0.4/arrows.js',
    'https://github.com/efritz/arrows/releases/download/0.4/arrows.es5.js',
    'https://github.com/efritz/arrows/releases/download/0.4/arrows.min.js'
  ]
};

gulp.task('vendor', () => {
  return download(paths.vendor)
    .pipe(gulp.dest('./public/js'));
});

gulp.task('relative', () => {
  return gulp.src(paths.relative, { base: '../arrows/dist/' })
    .pipe(gulp.dest('./public/js'));
});

gulp.task('minify-html', () => {
  return gulp.src('src/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      removeComments: true,
      useShortDoctype: true,
    }))
    .pipe(gulp.dest('./public'));
});

gulp.task('minify-js', () => {
  return gulp.src('src/**/*.js')
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(uglify({
      output: {
        comments: true,
      },
    }))
    .pipe(gulp.dest('./public'));
});

gulp.task('minify-css', () => {
  return gulp.src('src/**/*.css')
    .pipe(cleancss({level: 2, debug: true}))
    .pipe(gulp.dest('./public'));
});

gulp.task('build', callback => {
  runSequence(
    ['relative', 'minify-html', 'minify-js', 'minify-css'],
    callback,
  );
});
