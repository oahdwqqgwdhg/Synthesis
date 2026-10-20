import { Color } from 'cc';
import { ICircleConfig } from './CircleInterfaceConfig';

export const CIRCLE_BASE:ICircleConfig[] =[
    {id:1,name:'OneCircle',diameter:40,color:new Color(0x7F, 0xDB, 0xFF)},
    {id:2,name:'TwoCircle',diameter:50,color:new Color(0x39, 0xCC, 0xCC)},
    {id:3,name:'ThreeCircle',diameter:60,color:new Color(0x2E, 0xCC, 0x40)},
    {id:4,name:'FourCircle',diameter:70,color:new Color(0xB5, 0xE6, 0x1D)},
    {id:5,name:'FiveCircle',diameter:80,color:new Color(0xFF, 0xDC, 0x00)},
    {id:6,name:'SixCircle',diameter:90,color:new Color(0xFF, 0xA5, 0x00)},
    {id:7,name:'SevenCircle',diameter:100,color:new Color(0xFF, 0x85, 0x1B)},
    {id:8,name:'EightCircle',diameter:110,color:new Color(0xFF, 0x6B, 0x35)},
    {id:9,name:'NineCircle',diameter:120,color:new Color(0xFF, 0x41, 0x36)},
    {id:10,name:'TenCircle',diameter:130,color:new Color(0xE9, 0x1E, 0x63)},
];

export class CircleConfigManager{
    private static _instance:CircleConfigManager;
    public static get instance():CircleConfigManager{
        if(!this._instance) return this._instance= new CircleConfigManager();
        return this._instance;
    }

    private _map:Map<number,ICircleConfig> = new Map();

    public init():void {
        CIRCLE_BASE.forEach(msg => this._map.set(msg.id,msg));
    }

    public get(id:number): ICircleConfig | undefined{
        return this._map.get(id);
    }

    public getAll(): ICircleConfig[] | undefined{
        return CIRCLE_BASE;
    }
}
