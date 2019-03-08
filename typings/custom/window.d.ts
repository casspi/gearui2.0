
interface GearJson<T> {
    put(name:string,obj: T): void;
    get(name:string):T;
    toJson():{[idx:string]: T};

    fromStyle(val:string):GearJson<string>;

    fromString(val:string):GearJson<string>;

    toString():string;
    forEach(callback:((key:string,value:T) => void)):void;

    clear():void;

    new<T>(objs?: any): GearJson<T>;
}

declare var GearJson: GearJson<any>;

interface GearArray<T> {
    indexOf(ele: T): number;
    addAll(arr:Array<T>): void;
    toArray(): T[];
    get(index:number): T;
    add(obj:T): void;
    insert(obj:T,index:number): void;
    length():number;
    toString(split?:string):string;
    clone(deep?: boolean):GearArray<T>;
    contains(ele:T):boolean;
    remove(ele:T) : T;
    removeByIndex(ele?: number): T;
    up(ele:T|number): void;
    down(ele:T|number): void;
    new(arr?: Array<T>): GearArray<T>;
}

declare var GearArray: {
    new<T>(arr?: Array<T>): GearArray<T>;
    fromString(val: string,split:string): GearArray<string>|null;
};
interface RenderOptions {
    el: string|Element;
    mounted?(...tags: any[]): void;
}
interface Message {
    progress(type?: string): void;
    alert(title:string,message:string,...args: any[]): void;
    info(title:string,message:string,...args: any[]): void;
    warning(title:string,message:string,...args: any[]): void;
    success(title:string,message:string,...args: any[]): void;
    error(title:string,message:string,...args: any[]): void;
    modal: {
        alert(title:string,message:string,...args: any[]): void;
        info(title:string,message:string,...args: any[]): void;
        warning(title:string,message:string,...args: any[]): void;
        success(title:string,message:string,...args: any[]): void;
        error(title:string,message:string,...args: any[]): void;
    };
    simple: {
        alert(content:string,duration?:number,onClose?:Function): void;
        info(content:string,duration?:number,onClose?:Function): void;
        warning(content:string,duration?:number,onClose?:Function): void;
        error(content:string,duration?:number,onClose?:Function): void;
        success(content:string,duration?:number,onClose?:Function): void;
        loading(content:string,duration?:number,onClose?:Function): void;
    };
    confirm(title:string,message:string,...args: any[]): void;
}
declare var G: {
    SockJs:any;
    G$:JQueryStatic;
    parsed: boolean;
    waitFuns: Array<Function>;
    registerCustomComponents():void;
    registerComponents(clazz:Function): void;
    $: (selector?:string|object|Function|null, react?: boolean)=>any;
    components: {};
    userComponents: {};
    doWaitFuns:()=>{};
    render:(renderOptions?:RenderOptions)=>{};
    events: GearArray<string>;
    cannotSetStateEvents: GearArray<string>;
    voidParent: Element;
    tag: any;
    messager: Message;
    utils: any;
    dialog: any;
}
interface Window extends EventTarget, WindowTimers, WindowSessionStorage, WindowLocalStorage, WindowConsole, GlobalEventHandlers, IDBEnvironment, WindowBase64, GlobalFetch {
    Blob: typeof Blob;
    URL: typeof URL;
    URLSearchParams: typeof URLSearchParams;
    readonly applicationCache: ApplicationCache;
    readonly caches: CacheStorage;
    readonly clientInformation: Navigator;
    readonly closed: boolean;
    readonly crypto: Crypto;
    customElements: CustomElementRegistry;
    defaultStatus: string;
    readonly devicePixelRatio: number;
    readonly doNotTrack: string;
    readonly document: Document;
    event: Event | undefined;
    readonly external: External;
    readonly frameElement: Element;
    readonly frames: Window;
    readonly history: History;
    readonly innerHeight: number;
    readonly innerWidth: number;
    readonly isSecureContext: boolean;
    readonly length: number;
    location: Location;
    readonly locationbar: BarProp;
    readonly menubar: BarProp;
    readonly msContentScript: ExtensionScriptApis;
    readonly msCredentials: MSCredentials;
    name: string;
    readonly navigator: Navigator;
    offscreenBuffering: string | boolean;
    onabort: ((this: Window, ev: UIEvent) => any) | null;
    onafterprint: ((this: Window, ev: Event) => any) | null;
    onbeforeprint: ((this: Window, ev: Event) => any) | null;
    onbeforeunload: ((this: Window, ev: BeforeUnloadEvent) => any) | null;
    onblur: ((this: Window, ev: FocusEvent) => any) | null;
    oncanplay: ((this: Window, ev: Event) => any) | null;
    oncanplaythrough: ((this: Window, ev: Event) => any) | null;
    onchange: ((this: Window, ev: Event) => any) | null;
    onclick: ((this: Window, ev: MouseEvent) => any) | null;
    oncompassneedscalibration: ((this: Window, ev: Event) => any) | null;
    oncontextmenu: ((this: Window, ev: PointerEvent) => any) | null;
    ondblclick: ((this: Window, ev: MouseEvent) => any) | null;
    ondevicelight: ((this: Window, ev: DeviceLightEvent) => any) | null;
    ondevicemotion: ((this: Window, ev: DeviceMotionEvent) => any) | null;
    ondeviceorientation: ((this: Window, ev: DeviceOrientationEvent) => any) | null;
    ondrag: ((this: Window, ev: DragEvent) => any) | null;
    ondragend: ((this: Window, ev: DragEvent) => any) | null;
    ondragenter: ((this: Window, ev: DragEvent) => any) | null;
    ondragleave: ((this: Window, ev: DragEvent) => any) | null;
    ondragover: ((this: Window, ev: DragEvent) => any) | null;
    ondragstart: ((this: Window, ev: DragEvent) => any) | null;
    ondrop: ((this: Window, ev: DragEvent) => any) | null;
    ondurationchange: ((this: Window, ev: Event) => any) | null;
    onemptied: ((this: Window, ev: Event) => any) | null;
    onended: ((this: Window, ev: Event) => any) | null;
    onerror: ErrorEventHandler;
    onfocus: ((this: Window, ev: FocusEvent) => any) | null;
    onhashchange: ((this: Window, ev: HashChangeEvent) => any) | null;
    oninput: ((this: Window, ev: Event) => any) | null;
    oninvalid: ((this: Window, ev: Event) => any) | null;
    onkeydown: ((this: Window, ev: KeyboardEvent) => any) | null;
    onkeypress: ((this: Window, ev: KeyboardEvent) => any) | null;
    onkeyup: ((this: Window, ev: KeyboardEvent) => any) | null;
    onload: ((this: Window, ev: Event) => any) | null;
    onloadeddata: ((this: Window, ev: Event) => any) | null;
    onloadedmetadata: ((this: Window, ev: Event) => any) | null;
    onloadstart: ((this: Window, ev: Event) => any) | null;
    onmessage: ((this: Window, ev: MessageEvent) => any) | null;
    onmousedown: ((this: Window, ev: MouseEvent) => any) | null;
    onmouseenter: ((this: Window, ev: MouseEvent) => any) | null;
    onmouseleave: ((this: Window, ev: MouseEvent) => any) | null;
    onmousemove: ((this: Window, ev: MouseEvent) => any) | null;
    onmouseout: ((this: Window, ev: MouseEvent) => any) | null;
    onmouseover: ((this: Window, ev: MouseEvent) => any) | null;
    onmouseup: ((this: Window, ev: MouseEvent) => any) | null;
    onmousewheel: ((this: Window, ev: WheelEvent) => any) | null;
    onmsgesturechange: ((this: Window, ev: Event) => any) | null;
    onmsgesturedoubletap: ((this: Window, ev: Event) => any) | null;
    onmsgestureend: ((this: Window, ev: Event) => any) | null;
    onmsgesturehold: ((this: Window, ev: Event) => any) | null;
    onmsgesturestart: ((this: Window, ev: Event) => any) | null;
    onmsgesturetap: ((this: Window, ev: Event) => any) | null;
    onmsinertiastart: ((this: Window, ev: Event) => any) | null;
    onmspointercancel: ((this: Window, ev: Event) => any) | null;
    onmspointerdown: ((this: Window, ev: Event) => any) | null;
    onmspointerenter: ((this: Window, ev: Event) => any) | null;
    onmspointerleave: ((this: Window, ev: Event) => any) | null;
    onmspointermove: ((this: Window, ev: Event) => any) | null;
    onmspointerout: ((this: Window, ev: Event) => any) | null;
    onmspointerover: ((this: Window, ev: Event) => any) | null;
    onmspointerup: ((this: Window, ev: Event) => any) | null;
    onoffline: ((this: Window, ev: Event) => any) | null;
    ononline: ((this: Window, ev: Event) => any) | null;
    onorientationchange: ((this: Window, ev: Event) => any) | null;
    onpagehide: ((this: Window, ev: PageTransitionEvent) => any) | null;
    onpageshow: ((this: Window, ev: PageTransitionEvent) => any) | null;
    onpause: ((this: Window, ev: Event) => any) | null;
    onplay: ((this: Window, ev: Event) => any) | null;
    onplaying: ((this: Window, ev: Event) => any) | null;
    onpopstate: ((this: Window, ev: PopStateEvent) => any) | null;
    onprogress: ((this: Window, ev: ProgressEvent) => any) | null;
    onratechange: ((this: Window, ev: Event) => any) | null;
    onreadystatechange: ((this: Window, ev: ProgressEvent) => any) | null;
    onreset: ((this: Window, ev: Event) => any) | null;
    onresize: ((this: Window, ev: UIEvent) => any) | null;
    onscroll: ((this: Window, ev: UIEvent) => any) | null;
    onseeked: ((this: Window, ev: Event) => any) | null;
    onseeking: ((this: Window, ev: Event) => any) | null;
    onselect: ((this: Window, ev: UIEvent) => any) | null;
    onstalled: ((this: Window, ev: Event) => any) | null;
    onstorage: ((this: Window, ev: StorageEvent) => any) | null;
    onsubmit: ((this: Window, ev: Event) => any) | null;
    onsuspend: ((this: Window, ev: Event) => any) | null;
    ontimeupdate: ((this: Window, ev: Event) => any) | null;
    ontouchcancel: (ev: TouchEvent) => any;
    ontouchend: (ev: TouchEvent) => any;
    ontouchmove: (ev: TouchEvent) => any;
    ontouchstart: (ev: TouchEvent) => any;
    onunload: ((this: Window, ev: Event) => any) | null;
    onvolumechange: ((this: Window, ev: Event) => any) | null;
    onvrdisplayactivate: ((this: Window, ev: Event) => any) | null;
    onvrdisplayblur: ((this: Window, ev: Event) => any) | null;
    onvrdisplayconnect: ((this: Window, ev: Event) => any) | null;
    onvrdisplaydeactivate: ((this: Window, ev: Event) => any) | null;
    onvrdisplaydisconnect: ((this: Window, ev: Event) => any) | null;
    onvrdisplayfocus: ((this: Window, ev: Event) => any) | null;
    onvrdisplaypointerrestricted: ((this: Window, ev: Event) => any) | null;
    onvrdisplaypointerunrestricted: ((this: Window, ev: Event) => any) | null;
    onvrdisplaypresentchange: ((this: Window, ev: Event) => any) | null;
    onwaiting: ((this: Window, ev: Event) => any) | null;
    opener: any;
    readonly orientation: string | number;
    readonly outerHeight: number;
    readonly outerWidth: number;
    readonly pageXOffset: number;
    readonly pageYOffset: number;
    readonly parent: Window;
    readonly performance: Performance;
    readonly personalbar: BarProp;
    readonly screen: Screen;
    readonly screenLeft: number;
    readonly screenTop: number;
    readonly screenX: number;
    readonly screenY: number;
    readonly scrollX: number;
    readonly scrollY: number;
    readonly scrollbars: BarProp;
    readonly self: Window;
    readonly speechSynthesis: SpeechSynthesis;
    status: string;
    readonly statusbar: BarProp;
    readonly styleMedia: StyleMedia;
    readonly toolbar: BarProp;
    readonly top: Window;
    readonly window: Window;
    alert(message?: any): void;
    blur(): void;
    cancelAnimationFrame(handle: number): void;
    captureEvents(): void;
    close(): void;
    confirm(message?: string): boolean;
    createImageBitmap(image: HTMLImageElement | SVGImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap | ImageData | Blob, options?: ImageBitmapOptions): Promise<ImageBitmap>;
    createImageBitmap(image: HTMLImageElement | SVGImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap | ImageData | Blob, sx: number, sy: number, sw: number, sh: number, options?: ImageBitmapOptions): Promise<ImageBitmap>;
    departFocus(navigationReason: NavigationReason, origin: FocusNavigationOrigin): void;
    focus(): void;
    getComputedStyle(elt: Element, pseudoElt?: string | null): CSSStyleDeclaration;
    getMatchedCSSRules(elt: Element, pseudoElt?: string | null): CSSRuleList;
    getSelection(): Selection;
    matchMedia(mediaQuery: string): MediaQueryList;
    moveBy(x?: number, y?: number): void;
    moveTo(x?: number, y?: number): void;
    msWriteProfilerMark(profilerMarkName: string): void;
    open(url?: string, target?: string, features?: string, replace?: boolean): Window | null;
    postMessage(message: any, targetOrigin: string, transfer?: any[]): void;
    print(): void;
    prompt(message?: string, _default?: string): string | null;
    releaseEvents(): void;
    requestAnimationFrame(callback: FrameRequestCallback): number;
    resizeBy(x?: number, y?: number): void;
    resizeTo(x?: number, y?: number): void;
    scroll(options?: ScrollToOptions): void;
    scroll(x?: number, y?: number): void;
    scrollBy(options?: ScrollToOptions): void;
    scrollBy(x?: number, y?: number): void;
    scrollTo(options?: ScrollToOptions): void;
    scrollTo(x?: number, y?: number): void;
    stop(): void;
    webkitCancelAnimationFrame(handle: number): void;
    webkitConvertPointFromNodeToPage(node: Node, pt: WebKitPoint): WebKitPoint;
    webkitConvertPointFromPageToNode(node: Node, pt: WebKitPoint): WebKitPoint;
    webkitRequestAnimationFrame(callback: FrameRequestCallback): number;
    addEventListener<K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    G: typeof G;
    GearType: GearType;
    GearArray: GearArray<any>;
    GearJson: GearJson<any>;
    WXEnvironment: any;
    Constants: Constants;
    _dialog: any;
}
declare var window: Window;