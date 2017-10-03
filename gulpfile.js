const gulp = require('gulp');
const jscs = require('gulp-jscs');

gulp.task('lint', () => {
  return gulp.src('dist/**/*.js'
    .pipe(jscs({ fix: true }))
	.pipe(jscs.reporter())
	.pipe(jscs.reporter('fail'))
	.pipe(gulp.dest('src')));
});
