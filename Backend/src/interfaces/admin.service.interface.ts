export interface IAdminServices {
    login(email:string,password:string):{adminAccessToken:string,adminRefreshToken:string}
}