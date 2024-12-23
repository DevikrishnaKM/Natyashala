export
interface User{
    userId:string;
    name:string;
    email:string;
    phone:string;
    password:string;
    role:"user"|"tutor"
    confirmPassword:string;
    isVerified:boolean
}