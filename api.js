//-------------enums---------------

exports.RankType = class RankType{
    
    static DAY = 1;
    
    static MONTH = 3;
    
    static RECHARGE = 9;
    
}

//------------classes--------------

exports.RankItem = class RankItem  {
    constructor(){
    
    
        //prop type: string
        this.name = null;
    
        //prop type: number
        this.rank = null;
        this.reqFields = [];
        this.resFields = [];
    }


}

exports.RankInfo = class RankInfo extends Base {
    constructor(){
        super();
        this._rankType = null;
        this._limit = null;
        this._selfRank = null;
        this._ranks = null;
        this.reqFields = ["rankType","limit"];
        this.resFields = ["selfRank","ranks"];
    }
    //client input, require, type: RankType
    set rankType(v) {this._rankType = v}
    

    //client input, optional, type: number
    set limit(v) {this._limit = v}
    

    //server output, type: number
    get selfRank() {return this._selfRank}
    

    //server output, type: RankItem[]
    get ranks() {return this._ranks}
    



}

exports.RechargeRankInfo = class RechargeRankInfo extends RankInfo {
    constructor(){
        super();
        this._myRecharge = null;
        this.reqFields = [];
        this.resFields = ["myRecharge"];
    }
    //server output, type: number
    get myRecharge() {return this._myRecharge}
    



}

exports.Base = class Base  {
    constructor(){
    
    
        //prop type: string
        this.host = null;
    
        //prop type: string
        this.action = null;
    
        //prop type: string[]
        this.reqFields = null;
    
        //prop type: string[]
        this.resFields = null;
        
        
    }


   fetch()  { 
        return new Promise((resolve, reject) =>  { 
            wx.request( { 
                url: this.host,
                data: this.reqData,
                success: function (res)  { 
                  this.parse(res.data)
                  resolve(this)
                 } ,
                fail: err =>  { 
                    error(err)
                    reject(err);
                 } 
               } )
         } )
     } 



   get reqData()  { 
        let tmp = {  } ;
        tmp.action=this.action;
        this.reqFields.forEach(k =>  { 
            tmp[k]=this[k]
         } );
        return tmp;
     } 

   parse(data)  { 
        Object.assign(this, data);
     } 

   error(err)  { 

     } 

}
