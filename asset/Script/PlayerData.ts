class PlayerData{
    private accouunt: string = '';
    private name: string = '';

    getData(){
        return {name:this.name,accouunt:this.accouunt};
    }

    setData(accouunt:string,name:string){
        this.accouunt = accouunt;
        this.name = name;
    }
}

export const playerData = new PlayerData();