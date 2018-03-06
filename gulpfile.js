const gulp = require('gulp')
const runSequence = require('run-sequence')
const browserSync = require('browser-sync')
const sass = require('gulp-sass')
const concatJs = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const notify = require('gulp-notify')
const less = require('gulp-less')

const paths = {
	src: 'src',
	sass: 'src/assets/stylesheets',
	styles: 'src/assets/stylesheets',
	images: 'src/assets/images',
	scripts: 'src/assets/scripts',
	packageScript: (name) => {
		return `node_modules/${name}/dist/${name}.min.js`
	},
	assetScript: (name) => {
		return `src/assets/scripts/${name}.js`
	}
}

const libraries = {
	scripts: []
}

const concatScript = [
	paths.assetScript('concat'),
	paths.assetScript('app')
]

gulp.task('start', () => {
	runSequence('sass', 'watch')
})

gulp.task('build', () => {
	runSequence('scripts')
})

gulp.task('watch', () => {
	browserSync.init({
		server: './src',
		port: 2222
	})

	gulp.watch([paths.sass + '/*.scss'], ['sass'])
	gulp.watch([`${paths.styles}/*.css`, paths.images, `${paths.src}/*.html`])
		.on('change', browserSync.reload)
})

gulp.task('sass', () => {
	return gulp.src(`${paths.sass}/app.scss`)
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(gulp.dest(`${paths.styles}/`))
		.pipe(notify({ message: 'Sass compile task complete' }));
})

gulp.task('scripts', () => {
    return gulp.src(concatScript, { base: concatScript })
        .pipe(concatJs('bundle.js'))
        .pipe(gulp.dest(paths.scripts))
        .pipe(notify({ message: 'Scripts task complete' }));
})

gulp.task('concatScript', () => {
    return gulp.src(libraries.scripts, { base: paths.scripts})
        .pipe(concatJs('libraries.js'))
        .pipe(gulp.dest(paths.scripts))
        .pipe(notify({ message: 'Concat task complete' }));
})

gulp.task('less', () => {
	return gulp.src('src/assets/less/index.less')
		.pipe(less())
		.pipe(gulp.dest('src/assets/less'))
})






