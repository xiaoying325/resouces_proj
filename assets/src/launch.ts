
import Loader from "../scripts/c/Loader";
import { devkit } from "../scripts/m/dev";

const { ccclass, property } = cc._decorator;


@ccclass
export default class launch extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad(): void {
        devkit.framework.init()
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.key_down_event, this);
    }

    start() {
        this.load_login_view();
        devkit.loader.getSceneRef();

        this.load_test();
    }

    key_down_event(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.d:
                this.dump_fitler();
                break;
        }
    }

    async load_test() {
        await devkit.loader.loadRes('fonts/fzyhjt', cc.TTFFont);
    }

    dump_fitler() {
        const cache = cc.loader['_cache'];
        let current_assets_infos = {};
        for (const key in cache) {
            const item = cache[key];
            if (item.type != 'js') {
                current_assets_infos[key] = item;
            }
        }

        cc.warn('--->', current_assets_infos, Object.keys(current_assets_infos).length);
    }


    load_login_view() {
        devkit.view.load("prefabs/home/home", { order: devkit.view._screen, script: "home", invoke: "init", params: {} });


        // this.scheduleOnce(() => {
        //     devkit.view.close('home')
        // }, 3)


        cc.sys.garbageCollect();
    }

}


if (CC_DEV) {
    window['Loader'] = Loader.ins();
}
