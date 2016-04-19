/**
 * Created by hezhengjie on 2016/3/9.
 */
var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
var yaml = require('js-yaml');
var fs = require('fs');
//读取配置文件
var config;
try {
    config = yaml.safeLoad(fs.readFileSync('_config.yml', 'utf8'));
} catch (e) {
    console.log(e);
}
var url='';
if(config.deploy.repository.match(/^https/)){
    url = config.deploy.repository.replace('https://', 'https://'+config.deploy.username+':'+config.deploy.password+'@')
}
var option={
    remoteUrl:url
};
gulp.task('default', function() {
    return gulp.src('./public/**/*')
        .pipe(ghPages(option));
});