//需要自己配置的变量,自己的工程文件夹名字,第二项替换
fis.set('projectName', 'activity-ui');

//项目相关url参数配置
fis.set("preUrl", "zhuanzhuan/zzactivity")
fis.set('jsBaseUrl', 'js/'); //页面入口js模块基本路径配置
fis.set('domain', '//img.58cdn.com.cn/${preUrl}/${projectName}');
fis.set('cdnRemoteDir', '/pic2.58.com/${preUrl}/${projectName}/');
fis.set('htmlRemoteDir', '/dev/Mzhuanzhuan/${preUrl}/${projectName}/');

//sass文件编译为css文件
fis.match('*.scss', {
    parser: fis.plugin('node-sass'),
    rExt: '.css',
    postprocessor: fis.plugin("autoprefixer", {
        "browsers": ["Android >= 4.0.0", "ChromeAndroid > 1%", "iOS >= 4", "last 2 Chrome versions"],
        "cascade": true
    })
});

//less文件编译为css文件
fis.match('**.less', {
    parser: fis.plugin('less-2.x'),
    isCssLike: true,
    rExt: '.css',
    postprocessor: fis.plugin("autoprefixer", {
        "browsers": ["Android >= 4.0.0", "ChromeAndroid > 1%", "iOS >= 4", "last 2 Chrome versions"],
        "cascade": true
    })
});

//资源预处理
//通用资源处理
//设置md5与文件的连字符
fis.set('project.md5Connector ', '-');
fis.match('*', {
    release: '$1',
    useHash: true
});
fis.match('{*.html,manifest.json,*.json,*.mustache,*.gif,*.png,*.webp,*.jpg}', {
    useHash: false
});
//忽略一些文件，不被打包
fis.set('project.ignore', [
    'dist/**',
    'node_modules/**',
    '.git/**',
    '.svn/**',
    'fis-conf.js',
    'readme.md',
    'package.json'
]);
//特殊路径下的资源处理
fis.match('test/**', {
    useHash: false
});

//开启eslint检查
fis.match('*.js', {
    lint: fis.plugin('eslint', {
        ignoreFiles: ['lib/**.js', 'fis-conf.js', 'test/**.js'],

        // 配置待补全
        rules: {
            "no-unused-expressions": 1,
            "no-unused-vars": 2,
            "no-use-before-define": 2,
            "no-undef": 2
        },
        //envs:[],
        globals: [
            //这里配置页面的全局变量
            'define',
            'require',
            '$',
            'ZZUTIL',
            'terminalEvent',
            'Lginterface',
            'MdiaoqiZZ'
        ]
    })
});

// 开启es6
fis.set('project.fileType.text', 'es6, jsx');
fis.match('**.{es6,jsx}', {
    parser: fis.plugin('babel-5.x', {
        blacklist: ['regenerator'],
        stage: 2,
        sourceMaps: true
    }),
    rExt: '.js'
});

// AMD模块配置详解：
// baseUrl: 默认为. 即项目根目录,用来配置模块查找根目录
// paths: 用来设置别名,路径基于baseUrl设置
// packages: 用来配置包信息,方便项目中引用
// shim: 可以达到不改目标文件,指定其依赖和暴露内容的效果,注意只对不满足amd的js有效
fis.hook('amd', {
    baseUrl: fis.get('jsBaseUrl')
        /* paths: {
         },
         packages: [
         ],
         shim: {
         }*/
});

fis.match('::package', {
    postpackager: fis.plugin('loader', {
        resourceType: "auto", //amd模式加载js
        useInlineMap: true, //资源映射表内嵌
        allInOne: {
            js: function (file) {
                return "/static/js/" + file.filename + ".js";
            },
            css: function (file) {
                return "/static/css/" + file.filename + ".css";
            },
            includeAsyncs: true, //
            useTrack: true, //打印资源信息，便于调试
            sourceMap: true
        }
    })
});
//测试环境打包
//并且将打包后的文件发布到测试环境
fis.media('qa')
    .match('{test/*,config/*,manifest.json}', {
        release: false
    })
    .match('*.{css,scss,less}', {
        optimizer: fis.plugin('clean-css'),
        domain: '${domain}'
    })
    .match('*{.png,.jpg,.gif,.webp}', {
        useHash: false,
        domain: '${domain}'
    })
    .match('*.png', {
        optimizer: fis.plugin('png-compressor')
    })
    .match('*.html', {
        //html压缩
        optimizer: fis.plugin('html-minifier')
    })
    .match('*.js', {
        // fis-optimizer-uglify-js 插件进行压缩，已内置
        optimizer: fis.plugin('uglify-js', {
            mangle: {
                except: 'exports, module, require, define' //不需要混淆的关键字
            },
            compress: {
                drop_console: true //自动删除console
            }
        }),
        domain: '${domain}'
    })
    .match('::package', {
        postpackager: fis.plugin('loader', {
            resourceType: "auto", //amd模式加载js
            useInlineMap: true, //资源映射表内嵌
            allInOne: {
                js: function (file) {
                    return "/js/" + file.filename + ".js";
                },
                css: function (file) {
                    return "/css/" + file.filename + ".css";
                },
                includeAsyncs: true, //
                useTrack: true, //打印资源信息，上线关闭
                sourceMap: true
            }
        })
    })
    .match('*.html', {
        deploy: [
            fis.plugin('skip-packed', {
                // 配置项
            }),
            //发布到output目录
            fis.plugin('ftp', {
                cache: false, // 是否开启上传列表缓存，开启后支持跳过未修改文件，默认：true
                remoteDir: fis.get('htmlRemoteDir'), // 远程文件目录，注意！！！设置错误将导致文件被覆盖
                connect: {
                    host: '192.168.176.16',
                    port: '21',
                    user: 'feftp',
                    password: 'M4taHks9oZQXkv'
                }
            })
        ]
    })
    .match('*{.css,.js,.png,.jpg,.gif,.webp,.scss}', {
        deploy: [
            fis.plugin('skip-packed', {
                // 配置项
            }),
            //发布到output目录
            fis.plugin('ftp', {
                cache: false, // 是否开启上传列表缓存，开启后支持跳过未修改文件，默认：true
                remoteDir: fis.get('cdnRemoteDir'), // 远程文件目录，注意！！！设置错误将导致文件被覆盖
                connect: {
                    host: '192.168.185.104',
                    port: '21',
                    user: 'qatest',
                    password: 'ftp@fe'
                }
            })
        ]
    });
//上线打包配置
//打包后的文件发布在本工程内的publish文件夹中
fis.media('prod')
    .match('{test/*,config/*,manifest.json}', {
        release: false
    })
    .match('*.{css,scss,less}', {
        useSprite: true,
        optimizer: fis.plugin('clean-css'),
        domain: '${domain}'
    })
    .match('*{.png,.jpg,.gif,.webp}', {
        useHash: false,
        domain: '${domain}'
    })
    .match('*.png', {
        optimizer: fis.plugin('png-compressor')
    })
    .match('*.html', {
        //html压缩
        optimizer: fis.plugin('html-minifier')
    })
    .match('*.js', {
        // fis-optimizer-uglify-js 插件进行压缩，已内置
        optimizer: fis.plugin('uglify-js', {
            mangle: {
                except: 'exports, module, require, define' //不需要混淆的关键字
            },
            compress: {
                drop_console: true //自动删除console
            }
        }),
        domain: '${domain}'
    })
    .match('::package', {
        postpackager: fis.plugin('loader', {
            resourceType: "auto", //amd模式加载js
            useInlineMap: true, //资源映射表内嵌
            allInOne: {
                js: function (file) {
                    return '/js/' + file.filename + ".js";
                },
                css: function (file) {
                    return '/css/' + file.filename + ".css";
                },
                includeAsyncs: true, //
                useTrack: false, //打印资源信息，上线关闭
                sourceMap: false
            },
            processor: {
                '.html': 'html',

                // 支持 tpl
                '.tpl': 'html'
            }
        })
    })
    .match('*', {
        deploy: [
                fis.plugin('skip-packed', {
                // 配置项
            }),
                //发布到output目录
                fis.plugin('local-deliver', {
                to: 'dist'
            })
            ]
    });
