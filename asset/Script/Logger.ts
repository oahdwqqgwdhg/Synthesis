export class Logger{
    private static _isDebug: boolean = false;

    public static setDebug(isDebug:boolean){
        this._isDebug = isDebug;
    }

    public static log(...args:any[]){
        if(this._isDebug){
            console.log("[Game]",...args);
        }
    }

    public static warn(...args:any[]){
        if(this._isDebug){
            console.warn("[Game]",...args);
        }
    }

    public static error(...args:any[]){
        if(this._isDebug){
            console.error("[Game]",...args);
        }
    }
}


