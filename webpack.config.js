/**
 * Created by hezhengjie on 2016/3/24.
 */

var path = require('path');
module.exports={
    //程序入口文件
    entry:path.resolve(__dirname, 'app/main.js'),

    output:{
//        打包资源存放
        path:path.resolve(__dirname, 'build'),
//url的加载路径，在html中使用url加载图片等时用这个路径来代替绝对路径
        publicPath:'build/',

//        生成的打包文件的名字
        filename:'bundle.js'

    },
//    watch: true,
    module:{
        //用loaders定义了一系列的加载器，以及一些正则。当需要加载的文件匹配test的正则时，就会调用后面的loader对文件进行处理
        loaders:[
            {
                test:/\.(js)$/,//正则匹配js文件
                loader:'jsx-loader?harmony'//js文件调用jsx加载器
            },
            {
                test:/\.(css)$/,//匹配css文件
                loader:'style-loader!css-loader'//!连接多个加载器
            },
            {
                test:/\.(png|jpg)$/,//匹配图片
                loader:'url-loader?size=8192'
            }

        ]
    },
    node:{
        console:true
    }

};