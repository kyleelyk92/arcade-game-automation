const gulp = require("gulp");
const browserSync = require("browser-sync");
const cleanCSS = require("gulp-clean-css");
const autoprefix = require("gulp-autoprefixer");
const imagemin = require("gulp-imagemin");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");

gulp.task("update-css", () => {
  return gulp
    .src("./src/css/**/*.css")
    .pipe(autoprefix())
    .pipe(cleanCSS())
    .pipe(gulp.dest("./dest/css"));
});

gulp.task("update-js", () => {
  return gulp
    .src(["./src/js/resources.js", "./src/js/engine.js", "./src/js/app.js"])
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
        plugins: ["@babel/plugin-proposal-class-properties"]
      })
    )
    .pipe(uglify())
    .pipe(concat("main.js"))
    .pipe(gulp.dest("./dest/js"));
});

gulp.task("update-images", () => {
  return gulp
    .src("./src/images/**/*")
    .pipe(imagemin())
    .pipe(gulp.dest("./dest/images"));
});

gulp.task("update-html", () => {
  return gulp.src("./index.html").pipe(gulp.dest("./dest"));
});

gulp.task("update-sounds", () => {
  return gulp.src("./src/sounds/**/*").pipe(gulp.dest("./dest/sounds"));
});

gulp.task(
  "all",
  gulp.series(
    "update-html",
    "update-js",
    "update-css",
    "update-images",
    "update-sounds",
    () => {
      gulp.watch("./src/css/**/*.css", gulp.series("update-css"));
      gulp.watch("./src/js/**/*.js", gulp.series("update-js"));
      gulp.watch("./*.html").on("change", gulp.series("update-html"));
    }
  )
);
