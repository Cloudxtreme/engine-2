const gulp = require('gulp');
const ejs =  require('gulp-ejs');
const rename =  require('gulp-rename');
const _ = require("lodash");


gulp.task('doc', () => {
  const apidocs = require('./docs/_data/apidocs.json');
  apidocs.children.forEach((namespace) => {
    if (namespace.children) {
      namespace.children.forEach((mod) => {
        const interfaces = [];
        const classes = [];
        const constants = [];
        if (mod.children) {
          mod.children.forEach((child) => {
            if (child.kindString === "Interface") {
              interfaces.push(child)
            }
          })
        }
        gulp.src('./doc_templates/module.md')
          .pipe(ejs({...mod, filename: _.snakeCase(mod.name), interfaces}))
          .pipe(rename(`api_${_.snakeCase(mod.name)}.md`))
          .pipe(gulp.dest(`./docs/pages/api`))
      })
    }
  })
});