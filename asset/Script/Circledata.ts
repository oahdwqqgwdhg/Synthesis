import { Color,resources,JsonAsset } from 'cc';
import { Logger } from './Logger';

export interface ICircleConfig{
    id:number;
    name:string;
    diameter:number;
    color: Color;
    score:number;
}

let _circledata:ICircleConfig[] = [];
const _map1:Map<number,ICircleConfig> = new Map();
const _map2:Map<number,ICircleConfig> = new Map();

export const RANDOM_SPAWN_MAX_ID = 5;

export function initCircleData():Promise<void>{
    return new Promise((resolve,reject)=>{
        resources.load('config/CircleData',JsonAsset,(err:any | null,asset:JsonAsset) => {
            if(err){
                reject();
                return;
            }

            const json = asset.json as { circles:any[] };
            Logger.log(`成功加载${json.circles.length}条配置`);
            _circledata = json.circles.map(item => {
                return {
                id: item.id,
                name: item.name,
                diameter: item.diameter,
                color: new Color().fromHEX(item.color),
                score: item.score,
            }});

            _map1.clear();
            _map2.clear();

            _circledata.forEach(item => _map1.set(item.id,item));
            _circledata.forEach(item => _map2.set(item.diameter,item));
            
            resolve();
        });
    });
} 

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

