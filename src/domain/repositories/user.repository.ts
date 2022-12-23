import { Observable } from 'rxjs';
import { UserModel } from '../models/user-model';
import { LoginUser, RegisterUser } from '../models/types';

export abstract class UserRepository {
    abstract login(params: LoginUser): Observable<UserModel>;
    abstract register(params: RegisterUser): Observable<UserModel>;
    abstract getUserProfile(): Observable<UserModel>;
}