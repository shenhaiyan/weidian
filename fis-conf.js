var mcConfig = {
    settings : {
        spriter : {
            //设置css sprites的合并间距
            csssprites : {
                //图之间的边距
                margin: 10,
                //使用矩阵排列方式，默认为线性`linear`
                layout: 'matrix',
                //设置了scale，则规则不允许写background-size
                scale: 0.5
            }
        },
        parser : {
            jade : {
                pretty : true //不合并html文本,默认false
            }
        }
    },
    modules : {
        parser : {
            //使用fis-parser-less插件编译less文件
            less : "less",
            //使用fis-parser-coffee插件编译coffee文件
            coffee : "coffee-script",
            //使用fis-parser-jade插件编译jade文件
            jade : "jade"
        },
        //开启simple插件，用于将页面中独立的资源引用替换为打包资源
        postpackager : 'simple',
        //配置FIS中使用csssprites
        spriter : 'csssprites'
    },
    roadmap : {
        domain : "getIPAndVirulPath()+",
        ext : {
            //jade后缀的文件将输出为html文件
            //并且在parser之后的其他处理流程中被当做html文件处理
            jade : 'html',
            //less后缀的文件将输出为css后缀
            //并且在parser之后的其他处理流程中被当做css文件处理
            less : 'css',
            //coffee后缀的文件将输出为js文件
            //并且在parser之后的其他处理流程中被当做js文件处理
            coffee : 'js'
        },
        path : [
            //{
            //    //所有image目录下的.png，.gif文件
            //    reg : /^\/images\/(.*\.(?:png|gif))/i,
            //    //发布到/static/pic/xxx目录下
            //    release : '/pkg/$2'
            //},
            {
                //reg: /\/pages\/(.*\.jade)$/i,
                reg: /pages\/(.*\/)?(.+)\.jade/,
                release: "/$2"
            },
            {
                //reg: '**.less',
                reg : /lib\/(.*\/)?(.+)\.css/,
                //发布到/static/css/xxx目录下
                release : '/static/css/$2',
                useSprite: true
            },
            {
                //所有lib目录下的js文件
                reg : /lib\/(.*\/)?(.+)\.js/,
                //向产出的map.json文件里附加一些信息
                //extras : { say : '123' },
                release : '/static/js/$2',
            },
            {
                //所有lib目录下的js文件
                reg : /lib\/(.*\/)?(.+)\.map/,
                release : '/pkg/$2',
            },
            {
                reg : /pages\/(.*\/)?(.+)\.coffee/,
                release : '/static/js/$2',
                isMod : false
            },
            {
                //前面规则未匹配到的其他文件
                reg : "**.md",
                //编译的时候不要产出了
                release : false
            }
        ]
    },
    //通过pack设置干预自动合并结果，将公用资源合并成一个文件，更加利于页面间的共用
    pack : {
        'pkg/lib.css': [
            '/lib/**.less',
            '/lib/**.css',
        ],
        'pkg/app.css': [
            '/pages/base/**.less',
            '/pages/**.less'
        ],
        //'pkg/lib.js': [
        //    '/lib/zepto/zepto.js',
        //    '/lib/thumb/make_thumb.js',
        //    '/lib/**.js'
        //],
        'pkg/page.js': [
            '/pages/**.js',
            '/pages/**.coffee'
        ]
    }
}

fis.config.merge(mcConfig);

//fis.config.merge({
//    roadmap : {
//        //产出目录加上
//        domain : "http://localhost:8080/mt_mall"
//    }
//});