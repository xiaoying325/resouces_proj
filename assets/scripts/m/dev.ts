import Loader from "../c/Loader";
import View from "../c/View";





export namespace devkit {
    export let debug: boolean = false;
    export let recode_memory: boolean = true;
    export let scene_hall: string = 'scene_hall'
    export let scene_game: string = 'scene_game'
    export let OPENSUCC = -100;
    export let CLOSECODE = -200;
    export let ERRORCODE = -300;
    export let READYSUCC = 1;


    export const SERVER_LOGIN = 0; //登录服
    export const SERVER_GAME = 1;//游戏服
    export const SERVER_WEB = 2;//web服




    export let canvas: cc.Node;
    export let scene: cc.Node;
    export let screen: cc.Node;
    export let releases: cc.Node;


    export let isNative: boolean;
    export let isAndroid: boolean;
    export let isIos: boolean;

    export let handler: cc.SystemEvent;
    export let memory;



    export let view: View;
    export let loader: Loader;




    export let platform: any;
    export let report = cc;

    export namespace framework {
        export function init() {
            devkit.canvas = cc.find("Canvas");
            devkit.scene = cc.find("Canvas/view");

            devkit.isNative = cc.sys.isNative;
            devkit.isAndroid = cc.sys.os == cc.sys.OS_ANDROID;
            devkit.isIos = cc.sys.os == cc.sys.OS_IOS;


            devkit.view = View.ins();
            devkit.loader = Loader.ins();

        }
    }
}

if (CC_DEV) {
    (<any>window).devkit = devkit;
}