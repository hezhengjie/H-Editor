/**
 * Created by hezhengjie on 2016/3/29.
 */
var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var moment = require('moment');
var markdown = require( "markdown" ).markdown;
var watch = require('watch');

var contentPath="content",
    jsonPath="json";
var pagesPath = "public/pages";//存储生成的html文件的路径
var indexPath = "public";//存储生成的index文件的路径
function start(route) {
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        route(pathname,request,response);
    }
    http.createServer(onRequest).listen(8888);

//    监听content变化，生成json文件
    watch.watchTree(contentPath, function (_filename, curr, prev) {
        if (typeof _filename == "object" && prev === null && curr === null) {
        }
//    删除文件
        else if (curr.nlink === 0) {
            var filename = path.basename(_filename, '.md');
            fs.unlinkSync(path.join(jsonPath, filename + ".json"));
            fs.unlinkSync(path.join(pagesPath, filename + ".html"));
        }
//    新建和修改文件
        else {
            var filename = path.basename(_filename, '.md');
            var category = path.basename(path.dirname(_filename));
            var content = fs.readFileSync(_filename, "UTF-8");
            var publicDate = new Date();
            //md文件转换成html
            content = markdown.toHTML(content);
            var data = {
                "title": filename,
                "category":category,
                "date": publicDate.toLocaleDateString(),
                "content": content
            };

            fs.writeFile(path.join(jsonPath, filename + ".json"), JSON.stringify(data), function (err) {
                if (err) throw err;
            });
        }
    });

    console.log("Server has started.");
}

exports.start = start;
