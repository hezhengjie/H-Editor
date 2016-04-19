/**
 * Created by hezhengjie on 2016/3/29.
 */
var handler = require('./requestHandler');
function route(pathname,request,response) {
    var handle = {};
    handle["/getCategory"] = handler.getCategory;
    handle["/getConfig"] = handler.getConfig;
    handle["/setConfig"] = handler.setConfig;
    handle["/getPage"] = handler.getPage;
    handle["/getThemeList"] = handler.getThemeList;
    handle["/getPageContent"]=handler.getPageContent;
    handle["/save"]=handler.save;
    handle["/delete"]=handler.delete;
    handle["/push"]=handler.push;
    if (typeof handle[pathname] === 'function') {
        return handle[pathname](request,response);
    } else {
        console.log("No request handler found for " + pathname);
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not found");
        response.end();

    }
}

exports.route = route;