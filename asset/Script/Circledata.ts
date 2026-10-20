import { Color } from 'cc';

export interface ICircleConfig{
    id:number;
    name:string;
    diameter:number;
    color: Color;
    score:number;
}


export const CIRCLE_BASE:ICircleConfig[] = [
    {id:1,name:'OneCircle',diameter:40,color:new Color(0x7F, 0xDB, 0xFF),score:10},
    {id:2,name:'TwoCircle',diameter:50,color:new Color(0x39, 0xCC, 0xCC),score:20},
    {id:3,name:'ThreeCircle',diameter:60,color:new Color(0x2E, 0xCC, 0x40),score:30},
    {id:4,name:'FourCircle',diameter:70,color:new Color(0xB5, 0xE6, 0x1D),score:40},
    {id:5,name:'FiveCircle',diameter:80,color:new Color(0xFF, 0xDC, 0x00),score:50},
    {id:6,name:'SixCircle',diameter:90,color:new Color(0xFF, 0xA5, 0x00),score:60},
    {id:7,name:'SevenCircle',diameter:100,color:new Color(0xFF, 0x85, 0x1B),score:70},
    {id:8,name:'EightCircle',diameter:110,color:new Color(0xFF, 0x6B, 0x35),score:80},
    {id:9,name:'NineCircle',diameter:120,color:new Color(0xFF, 0x41, 0x36),score:90},
    {id:10,name:'TenCircle',diameter:130,color:new Color(0xE9, 0x1E, 0x63),score:100},
];

    const _map1:Map<number,ICircleConfig> = new Map();
    const _map2:Map<number,ICircleConfig> = new Map();

    export const RANDOM_SPAWN_MAX_ID = 5;

    CIRCLE_BASE.forEach(msg => _map1.set(msg.id,msg));
    CIRCLE_BASE.forEach(msg => _map2.set(msg.diameter,msg));

    export function getById(id:number): ICircleConfig | undefined{
        return _map1.get(id);
    }

    export function getByDiameter(diameter:number):ICircleConfig | undefined{
        return _map2.get(diameter);
    }

    export function getNextCircle(diameter:number){
        const current = _map2.get(diameter);
        if (!current) return undefined;
        return _map1.get(current.id + 1);
    }

