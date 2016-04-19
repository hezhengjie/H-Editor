/**
 * Created by hezhengjie on 2016/3/29.
 */
var yaml = require('js-yaml');
var fs = require('fs');
var path = require('path');
var url = require('url');
var moment = require('moment');
var querystring = require('querystring');
var watch = require('watch');
var ejs = require('ejs');
var cp = require('child_process');


var contentPath = "content",
    jsonPath = "json",
    themePath = "theme";
var pagesPath = "public/pages";//存储生成的html文件的路径
var indexPath = "public";//存储生成的index文件的路径
var categoryPath = "public/category";//存储生成的分类文件的路径
//读取配置文件
var config;
try {
    config = yaml.safeLoad(fs.readFileSync('_config.yml', 'utf8'));
} catch (e) {
    console.log(e);
}
//新建分类文件夹
var category = config.category;
category.forEach(function (item) {
    if (fs.existsSync(path.join(contentPath, item))) {
        console.log('目录已创建');
    }
    else {
        fs.mkdir(path.join(contentPath, item), function (err) {
            if (err)
                throw err;
            console.log('创建目录成功');
        });
    }
});
function getCategory(request, response) {
    var category = config.category;
    response.writeHead(200, {"Content-Type": "application/json"});
    response.write(JSON.stringify(category));
    response.end();
}
function getThemeList(request, response){
    var theme_list = fs.readdirSync(path.join(themePath));
    response.writeHead(200, {"Content-Type": "application/json"});
    response.write(JSON.stringify(theme_list));
    response.end();
}
function getConfig(request, response) {
    var data_config = {
        title: config.title,
        author: config.author,
        description: config.description,
        category: config.category,
        repository: config.deploy.repository,
        username:config.deploy.username,
        password:config.deploy.password,
        theme:config.theme
    };
    response.writeHead(200, {"Content-Type": "application/json"});
    response.write(JSON.stringify(data_config));
    response.end();
}
function setConfig(request, response) {
    var data_config = '';
    request.setEncoding('utf-8');
    request.addListener('data', function (postDataChunk) {
        data_config += postDataChunk;
    });
    request.addListener('end', function () {
//        var new_config= config;
        var result = JSON.parse(data_config);
        config.title = result.title;
        config.author = result.author;
        config.description = result.description;
        config.category = result.category;
        config.theme = result.theme;
        config.deploy.repository = result.repository;
        config.deploy.username = result.username;
        config.deploy.password = result.password;
        fs.writeFile("_config.yml", yaml.safeDump(config), function (err) {
            if (err) throw err;
        });
        response.writeHead(200, {"Content-Type": "application/json"});
        response.write('success');
        response.end();
    });
}
function getPage(request, response) {
    var param = url.parse(request.url).query;
    param = querystring.parse(param);
    var pages = fs.readdirSync(path.join(contentPath, param.select_category));
    var data = {
        total: pages.length,
        list: []
    };
    pages.forEach(function (item) {
        var filename = path.basename(item, '.md');
        data.list.push(filename);
    });
    response.writeHead(200, {"Content-Type": "application/json"});
    response.write(JSON.stringify(data));
    response.end();
}
function getPageContent(request, response) {
    var param = url.parse(request.url).query;
    param = querystring.parse(param);
    var data = {};
    if (param.title) {
        var content = fs.readFileSync(path.join(contentPath, param.category, param.title + '.md'), "UTF-8");
        data = {
            title: param.title,
            category: param.category,
            content: content
        };

    }
    else {
        data = {
            title: '',
            category: '',
            content: ''
        };

    }
    response.writeHead(200, {"Content-Type": "application/json"});
    response.write(JSON.stringify(data));
    response.end();
}

function save(request, response) {
    var data = '';
    request.setEncoding('utf-8');
    request.addListener('data', function (postDataChunk) {
        data += postDataChunk;
    });
    request.addListener('end', function () {
//        var new_config= config;
        var result = JSON.parse(data);
        var old_title = result.old_title,
            old_category = result.old_category,
            new_title = result.new_title,
            new_category = result.new_category,
            content = result.content;
        if (old_title && old_category) {
//        删除原文件
            fs.unlinkSync(path.join(contentPath, old_category, old_title + ".md"), function (err) {
                if (err) throw err;
            });
//        创建新文件
            fs.writeFile(path.join(contentPath, new_category, new_title + ".md"), content, function (err) {
                if (err) throw err;
            });
            response.writeHead(200, {"Content-Type": "text/plain"});
            response.write('保存成功');
            response.end();
        }
        else if (new_title && new_category) {
            //        创建新文件
            fs.writeFile(path.join(contentPath, new_category, new_title + ".md"), content, function (err) {
                if (err) throw err;
            });
            response.writeHead(200, {"Content-Type": "text/plain"});
            response.write('保存成功');
            response.end();

        }
        else {
            response.writeHead(200, {"Content-Type": "text/plain"});
            response.write('保存失败，请填写文章名称和类别');
            response.end();
        }
    });
}
function deletePage(request, response) {
    var data = '';
    request.setEncoding('utf-8');
    request.addListener('data', function (postDataChunk) {
        data += postDataChunk;
    });
    request.addListener('end', function () {
        var result = JSON.parse(data);
        var old_title = result.old_title,
            old_category = result.old_category;
//        删除原文件
        if (old_title && old_category) {
            fs.unlinkSync(path.join(contentPath, old_category, old_title + ".md"));
            response.writeHead(200, {"Content-Type": "text/plain"});
            response.write('删除成功');
            response.end();
        }
        else {
            response.writeHead(200, {"Content-Type": "text/plain"});
            response.write('不存在此文件');
            response.end();
        }
    });
}
function push(request, response) {
    var files = fs.readdirSync(jsonPath);
    var post_items = [];
    var theme = config.theme;
    //        输出资源文件
    exists(path.join('theme', theme),indexPath, copy);

    if (fs.existsSync(path.join(pagesPath))) {

        console.log('目录已创建');
    }
    else {
        fs.mkdir(path.join(pagesPath), function (err) {
            if (err)
                throw err;
            console.log('创建目录成功');
        });
    }
    if (fs.existsSync(path.join(categoryPath))) {
        console.log('目录已创建');
    }
    else {
        fs.mkdir(path.join(categoryPath), function (err) {
            if (err)
                throw err;
            console.log('创建目录成功');
        });
    }
    files.forEach(function (_item) {
        var page = fs.readFileSync(path.join(jsonPath, _item.toString()), "UTF-8");
        page = JSON.parse(page);


        //输出html文件
        var filename = path.basename(_item.toString(), '.json');
        var template = fs.readFileSync(path.join('theme', theme, 'template/page.ejs'), 'utf-8');
        var pageData = ejs.render(template, {
            config: config,
            page: page,
            filename: path.join('theme', theme, 'template/page')
        });
        fs.writeFile(path.join(pagesPath, filename + ".html"), pageData, function (err) {
            if (err) throw err;
        });
        console.log('生成完成');

        var month = moment(page.date).format("MMM");
        var day = moment(page.date).format("DD");
        var item = {
            title: page.title,
            category: page.category,
            url: "pages/" + page.title + '.html',
            date: moment(page.date).format("x"),
            day: day,
            month: month,
            content: page.content.substr(0, 500)
        };
        post_items.push(item);

    });
    post_items.sort(function (a, b) {
        return b.date - a.date
    });

    var template = fs.readFileSync(path.join('theme', theme, 'template/index.ejs'), 'utf-8');
    var index = ejs.render(template, {
        config: config,
        post_items: post_items,
        filename: path.join('theme', theme, 'template/index')
    });
    fs.writeFile(path.join(indexPath, "index.html"), index, function (err) {
        if (err) throw err;
    });

//    类别界面生成
    var category_posts = [];
    category.forEach(function (item) {
        category_posts.push({
            category: item,
            post_items: []
        });
    });
    post_items.forEach(function (item) {
        category_posts.forEach(function (_item) {
            if (_item.category == item.category) {
                _item.post_items.push(item);
            }
        });
    });
    var category_tpl = fs.readFileSync(path.join('theme', theme, 'template/category.ejs'), 'utf-8');
    category_posts.forEach(function (item) {
        item.post_items.sort(function (a, b) {
            return b.date - a.date
        });

        var index = ejs.render(category_tpl, {
            config: config,
            category: item.category,
            post_items: item.post_items,
            filename: path.join('theme', theme, 'template/category.ejs')
        });
        fs.writeFile(path.join(categoryPath, item.category + ".html"), index, function (err) {
            if (err) throw err;
        });
    });

//直接调用命令
    cp.exec('gulp',
        function (error, stdout, stderr) {
            if (error !== null) {
                console.log('exec error: ' + error);
            }
            response.writeHead(200, {"Content-Type": "text/plain"});
            response.write(stdout);
            response.end();
        });


}

var copy = function (src, dst) {
    // 读取目录中的所有文件/目录
    fs.readdir(src, function (err, paths) {
        if (err) {
            throw err;
        }
        paths.forEach(function (path) {
            var _src = src + '/' + path,
                _dst = dst + '/' + path,
                readable, writable;
            fs.stat(_src, function (err, st) {
                if (err) {
                    throw err;
                }
                // 判断是否为文件
                if (st.isFile()) {
                    // 创建读取流
                    readable = fs.createReadStream(_src);
                    // 创建写入流
                    writable = fs.createWriteStream(_dst);
                    readable.pipe(writable);
                }
                // 如果是目录则递归调用自身
                else if (st.isDirectory()) {
                    exists(_src, _dst, copy);
                }
            });
        });
    });
};
// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
var exists = function (src, dst, callback) {
    fs.exists(dst, function (exists) {
        // 已存在
        if (exists) {
            //        删除原文件
            if(dst!="public") {
                rmdir(dst);
            }
            fs.mkdir(dst, function () {
                callback(src, dst)
            });
        }
        // 不存在
        else {
            fs.mkdir(dst, function () {
                callback(src, dst)
            });
        }
    });
};
var rmdir = function (dirPath) {
    var files = fs.readdirSync(dirPath);
    if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
            var filePath = path.join(dirPath, files[i]);
            if (fs.statSync(filePath).isFile()) {
                fs.unlinkSync(filePath);
            } else {
                rmdir(filePath);
            }
        }
    fs.rmdirSync(dirPath);
};


exports.getCategory = getCategory;
exports.getConfig = getConfig;
exports.setConfig = setConfig;
exports.getPage = getPage;
exports.getPageContent = getPageContent;
exports.save = save;
exports.delete = deletePage;
exports.push = push;
exports.getThemeList=getThemeList;