import { Observable } from 'rxjs';
import { UseCase } from '../base/use-case';
import { UserModel } from '../models/user-model';
import { UserRepository } from '../repositories/user.repository';
import { LoginUser } from '../models/types/login-user';

export class UserLoginUseCase implements UseCase<LoginUser, UserModel> {
    constructor(private userRepository: UserRepository) { }
    execute(params: LoginUser): Observable<UserModel> {
        return this.userRepository.login(params);
    }
}