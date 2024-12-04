export default interface IAuthService {
    signUp(data: any, role: string): Promise<{ user: any; token: string }>;
}
