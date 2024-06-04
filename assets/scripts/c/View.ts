//     _frameview: 0,
// 	_background: 100,
// 	_view: 200,
// 	_dview: 300,
// 	_viewdialog: 400,
// 	_taskbar: 500,
// 	_ui: 600,
// 	_windows: 700,
// 	_dialog: 800,
// 	_notification: 900,
// 	_screen: 1000,
// 	_system: 1100,
// 	_display_log: 1200,
// 	_border: 1300,

import { devkit } from "../m/dev";

export default class View {

    _screen: number = 1000;

    private static instance: View | null = null;
    private constructor() {
    }

    static ins(): View {
        if (!View.instance) {
            View.instance = new View();
        }
        return View.instance;
    }

    views: any[] = [];
    loadings: any[] = [];
    _view: number = 200; //缺省层级
    _loading_keys: any[] = [];



    isLoading(url) {
        if (this.loadings[url]) {
            return true;
        }
        return false;
    }

    load(url: string, args: any, invoke?: string, data?, uniqueness?, group_name?, another_name?, complete?) {
        if (url) {
            args = args || {};
            if (args.order === undefined) {
                args.order = this._view;
            }

            let viewPrefab = cc.loader.getRes(url);
            if (!viewPrefab) {
                if (this.loadings[url]) {
                    return false;
                }
                const loading_info = {
                    url: url,
                    args: args,
                    invoke: invoke,
                    data: data,
                    uniqueness: uniqueness,
                    group_name: group_name,
                    another_name: another_name,
                    complete: complete
                };
                cc.log('load view:', loading_info);
                this._loading_keys.push(url);
                this.loadings[url] = loading_info;
                if (this._loading_keys.length == 1) {
                    this._load(loading_info);
                } else {
                    cc.log('add load info:', loading_info);
                }
            } else {
                this.draw(viewPrefab, args, invoke, data, uniqueness, group_name, another_name, complete, url);
            }
        }
        return true;
    }


    async _load(loading_info) {

        const ret = await devkit.loader.loadRes(loading_info.url, cc.Prefab)
        if (!ret) {
            this._load(loading_info);
            return;
        }

        this._loading_keys.splice(0, 1);
        delete this.loadings[loading_info.url];
        try {
            let downloadCount = this._loading_keys.length;
            if (downloadCount <= 0) {

            } else {
                let url = this._loading_keys[0];
                cc.log('loading view file path:', url);
                this._load(this.loadings[url]);
            }
        } catch (err) {

        }
        this.draw(ret, loading_info.args, loading_info.invoke, loading_info.data, loading_info.uniqueness, loading_info.group_name, loading_info.another_name, loading_info.complete, loading_info.url)
    }


    draw(prefab, args, invoke, data, uniqueness, group_name, another_name, complete, url) {

        let layer = args.layer;
        if (!layer) {
            layer = devkit.scene;//如果没有设置层级，手动设置为screen
        }

        if (!layer || !layer.isValid) {
            return;
        }

        if (uniqueness === undefined) {
            uniqueness = 1;
        }

        if (!group_name) {
            group_name = 'default';
        }

        let view = null;

        let c = null;
        if (uniqueness === 1) {
            c = this.views[prefab.name];
        } else {
            if (another_name) {
                c = this.views[another_name];
            }
        }
        if (c && c.isValid) { //缓存里面有
            view = c.node;
            c.node.active = true;
        } else {
            view = cc.instantiate(prefab);
        }

        if (!view) {
            return;
        }

        if (args.script) { //获取组件
            let script = view.getComponent(args.script);
            if (!script) {
                script = view.addComponent(args.script);
            }
            if (script) {
                c = script;
                if (args.invoke) {
                    let callback = args.invoke;
                    if ('function' == typeof callback) {
                        callback.call(script, args.params);
                    } else {
                        //使用事件处理器的 emit 方法触发事件，调用脚本中指定的函数，并传入参数 args.params，比如调用某个UI脚本中的init函数
                        let eventHandler = new cc.Component.EventHandler();
                        eventHandler.target = script;
                        eventHandler.component = args.script;
                        eventHandler.handler = callback;
                        eventHandler.emit([args.params]);
                    }
                }
            }
        }

        if (!view.parent) {
            if (args.order) {
                layer.addChild(view, args.order);
            } else {
                layer.addChild(view);
            }

            let class_name = prefab.name;
            if (!c) {
                c = view.getComponent(class_name);
                if (!c) {
                    class_name = view.name;
                    c = view.getComponent(class_name);
                }
            }

            if (args.finish) {
                c.__finish = args.finish; //如果有弹窗回调
            }

            if (c) {

                if (uniqueness === 1) {
                    this.views[class_name] = c;
                    c.__cclass_name = class_name;
                    c.__loader_url = url; //资源加载的url
                } else {
                    if (another_name) {
                        this.views[another_name] = c;
                        c.__canother_name = another_name;
                    }
                }


                c._onLoad = c.onLoad;
                c.onLoad = function () {
                    if (c._onLoad) {
                        c._onLoad();
                    }
                };

                c._onEnable = c.onEnable;
                c.onEnable = function () {
                    if (c._onEnable) {
                        c._onEnable();
                    }
                };

                c._onDisable = c.onDisable;
                c.onDisable = function () {
                    if (c._onDisable) {
                        c._onDisable();
                    }
                };

                c._onDestroy = c.onDestroy;
                c.onDestroy = function () {
                    if (c._onDestroy) {
                        c._onDestroy();
                    }
                };

                c.node._destroy = c.node.destroy;
                c.node.destroy = function () {
                    if (c.node._destroy) {
                        c.node._destroy();
                    }
                    if (c.__finish) { //执行弹窗回调
                        c.__finish(false);
                    }
                };
            }
        }

        this.call(invoke, c || view, data);

        if (c) {
            c._start = c.start;
            c.start = function () {
                if (c._start) {
                    c.start = c._start;
                    c._start = null;
                    c.start();
                }
            };
        }
    }


    close(class_name) {
        if (class_name) {
            let c = this.views[class_name];
            if (c && c.isValid) {
                c.node.destroy();
                delete this.views[class_name];
                devkit.loader.releaseRes(c.__loader_url)
            }
        }
    }

    call(invoke, view, data) {
        if (invoke) {
            try {
                if ('function' == typeof invoke) {
                    invoke.call(invoke, view, data);
                }
            } catch (e) {
                cc.log("err:", e);
            } finally {

            }
        }
    }


}