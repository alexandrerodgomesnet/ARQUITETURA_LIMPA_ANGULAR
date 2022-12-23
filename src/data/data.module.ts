import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UserImplementationRepository } from './repositories/user/user-implementation.repository';
import { UserRepository } from '../domain/repositories/user.repository';
import { UserLoginUseCase } from '../domain/repositories/user-login.usecase';
import { UserRegisterUseCase } from '../domain/usecases/user-register.usecase';
import { GetUserProfileUseCase } from '../domain/usecases/get-user-profile.usecase';

const userLoginUseCaseFactory = (userRepo: UserRepository) => new UserLoginUseCase(userRepo);
export const userLoginUseCaseProvider = {
    provide: UserLoginUseCase,
    useFactory: userLoginUseCaseFactory,
    deps: [UserRepository],
};

const userRegisterUseCaseFactory = (userRepo: UserRepository) => new UserRegisterUseCase(userRepo);
export const userRegisterUseCaseProvider = {
    provide: UserRegisterUseCase,
    useFactory: userRegisterUseCaseFactory,
    deps: [UserRepository],
};

const getUserProfileUseCaseFactory = (userRepo: UserRepository) => new GetUserProfileUseCase(userRepo);
export const getUserProfileUseCaseProvider = {
    provide: GetUserProfileUseCase,
    useFactory: getUserProfileUseCaseFactory,
    deps: [UserRepository],
};

// @NgModule({
//     providers: [
//         userLoginUseCaseProvider,
//         userRegisterUseCaseProvider,
//         getUserProfileUseCaseProvider,
//         { provide: UserRepository, useClass: UserImplementationRepository },
//     ],
//     imports: [
//         CommonModule,
//         HttpClientModule,
//     ],
// })
//export class DataModule { }