

/**
 * 缓存的资源Item
 * @param name 资源加载的url名称
 * @param count 资源的引用计数
 * @param asset 加载的资源
 * @param deps 资源的依赖
 */
declare interface IRes {
    name: string
    count: number
    asset: cc.Asset
    filteredDeps?: string[]
    builtinDeps?: string[]
    cache?:boolean
}

export default class Loader {

    private static instance: Loader | null = null;
    private constructor() {
    }

    static ins(): Loader {
        if (!Loader.instance) {
            Loader.instance = new Loader();
        }
        return Loader.instance;
    }

    /**
     * 资源白名单
     * 这部分资源是受保护的，是要绕过释放逻辑的
     */
    whiteList: Map<string, IRes> = new Map<string, IRes>();

    remoteList: Map<string, IRes> = new Map<string, IRes>();


    /**
     * 资源缓存,可以将部分资源加载之后，缓存，当内存吃紧时，可以释放释放部分缓存的资源
     * assets\resources\plist\prop 目录下的道具ICON等资源，常驻内存，为甚么？因为使用到的地方多，频繁加载卸载并不是明智之举  
     * 部分频率高的UI/可做缓存
     */
    cacheList: Map<string, IRes> = new Map<string, IRes>();


    // LIFE-CYCLE CALLBACKS:


    // onLoad () {}



    async loadRes(url: string, assetType: typeof cc.Asset): Promise<cc.Asset> {

        return new Promise<cc.Asset>((resolve, reject) => {
            let asset: cc.Asset = null;
            if (this.cacheList.get(url)) {
                const res: IRes = this.cacheList.get(url);
                asset = res.asset;
                res.count++;
                resolve(res.asset)

            } else {
                cc.loader.loadRes(url, assetType, (error, asset) => {
                    if (!error) {


                        // cc.warn("共同的元素:", builtinRes);
                        // cc.warn("过滤后的 refs:", filteredRefs);
                        const item: IRes = {
                            asset: asset,
                            name: url,
                            count: 1,
                            // filteredDeps: filteredRefs,
                            // builtinDeps: builtinRes

                        }
                        this.cacheList.set(url, item);
                        resolve(asset)
                        //cc.warn("===>save new asset to cache.", this.cacheList);
                    } else {
                        reject(null)
                    }
                });
            }

        })

    }


    releaseRes(url: string) {
        //
        if (this.cacheList.get(url)) {
            let res: IRes = this.cacheList.get(url);
            res.count--;
            if (!res.count || res.count === 0) {
                let allRefRes = cc.loader.getDependsRecursively(res.asset)
                cc.warn('---->当前资源依赖的所有资源', allRefRes);

                let sceneRefRes = this.getSceneRef();
                cc.warn('---->当前场景依赖的资源', sceneRefRes);

                let whiteRefRes = this.getWhiteRef();
                cc.warn('---->当前白名单资源', whiteRefRes);

                let interRes = this.getInternalRef()
                cc.warn('---->当前引擎内置的资源', interRes);




                let builtinRes = Object.keys(interRes).filter(e => allRefRes.includes(e));
                cc.warn('------>当前资源所依赖的引擎内置资源', builtinRes)

                let sceneRes = sceneRefRes.filter(e => allRefRes.includes(e));
                cc.warn('--------->当前资源场景共同依赖的资源', sceneRes)

                let whiteRef = whiteRefRes.filter(e => allRefRes.includes(e));
                cc.warn('--------->当前资源与白名单资源共同依赖的资源', whiteRef)


                let ret1 = allRefRes.filter(e => !builtinRes.includes(e));
                let ret2 = ret1.filter(e => !sceneRes.includes(e));
                let ret3 = ret2.filter(e => !whiteRef.includes(e));
                

                cc.warn('---->做了依赖检查之后，真正可释放的资源清单', ret3)


                cc.loader.release(ret3) //直接释放的是真正引用的资源，内置资源不会释放
                this.cacheList.delete(url);
            }
        }
    }


    loadRemote() {
  
    }


    getSceneRef(): any[] {
        let scene = cc.director.getScene();
        //@ts-ignore
        return scene.dependAssets
    }


    getWhiteRef() {
        const maps = []
        this.whiteList.forEach((v, k) => {
            if (v) {
                let arr = cc.loader.getDependsRecursively(v.asset)
                maps.push(...arr);
            }
        })
        return maps;
    }


    getInternalRef() {
        const intertalRes = cc['AssetLibrary'].getBuiltinDeps()
        return intertalRes;
    }


}


if (CC_DEV) {
    window['Loader'] = Loader.ins();
}