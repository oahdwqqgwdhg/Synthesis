import { Color } from 'cc';

export enum CircleType { //直径
    OneCircle = 40,
    TwoCircle = 50,
    ThreeCircle = 60,
    FourCircle = 70,
    FiveCircle = 80,
    SixCircle = 90,
    SevenCircle = 100,
    EightCircle = 110,
    NineCircle = 120,
    TenCircle = 130,
    // ElevenCircle = 140,
    // TweenCircle = 150,
    // ThreetenCircle = 160,
}

type CircleName = Exclude<keyof typeof CircleType,number>;

export const CIRCLE_CLEAR: CircleName[] = [
    'OneCircle', 'TwoCircle', 'ThreeCircle', 'FourCircle', 'FiveCircle',
    'SixCircle', 'SevenCircle', 'EightCircle', 'NineCircle', 'TenCircle',
];

export const CircleColor: Color[] = [
    new Color(0x7F, 0xDB, 0xFF), // OneCircle
    new Color(0x39, 0xCC, 0xCC), // TwoCircle
    new Color(0x2E, 0xCC, 0x40), // ThreeCircle
    new Color(0xB5, 0xE6, 0x1D), // FourCircle
    new Color(0xFF, 0xDC, 0x00), // FiveCircle
    new Color(0xFF, 0xA5, 0x00), // SixCircle
    new Color(0xFF, 0x85, 0x1B), // SevenCircle
    new Color(0xFF, 0x6B, 0x35), // EightCircle
    new Color(0xFF, 0x41, 0x36), // NineCircle
    new Color(0xE9, 0x1E, 0x63), // TenCircle
];

class Config{
    public getResultCircle(data:number){
        const resultindex:number = CIRCLE_CLEAR.findIndex(name => name === CircleType[data] as CircleName);

        if(resultindex === CIRCLE_CLEAR.length -1 || resultindex === -1){
            return null;
        }        

        const index = resultindex + 1;
        const nextvalue:CircleName = CIRCLE_CLEAR[index];

        const diameter = CircleType[nextvalue];
        const color = CircleColor[index];

        return {diameter,color};
    }
}

export const CircleConfig = new Config();


