export interface User {
    _id?:string;
    login:string;
    password:string;
    listesId:Array<string>;
}