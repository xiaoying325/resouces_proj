import { devkit } from "../../scripts/m/dev";

const { ccclass, property } = cc._decorator;

@ccclass
export default class home extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    // update (dt) {}


    init(data) {
        cc.warn("------------->打开home界面")
    }


    close() {
        devkit.view.close('home')
    }
}
