### Exemplo de projeto
### Arquitetura Limpa projetos Angular-frontEnd

src/
├─ domain/
├─ data/
├─ presentation/

src/
├─ base/
│  ├─ utils/
│  │  ├─ mapper.ts


Crie uma nova pasta dentro de src chamada base e então crie uma nova pasta 
utils seguida por um novo arquivo chamado mapper.ts dentro de src/base/utils.

No arquivo mapper.ts crie uma classe que irá criar o mapeamento To e From

src/base/utils/mapper.ts

export abstract class Mapper<I, O> {
    abstract mapFrom(param: I): O;
    abstract mapTo(param: O): I;
}

Crie uma pasta chamada domain dentro do src e então crie uma pasta chamada base 
em src/domain e então crie um arquivo chamado use-case.ts 
Todos os nossos casos de uso terão uma dependência deste arquivo base usecase.ts.

import { Observable } from 'rxjs';
export interface UseCase<S, T> {
    execute(params: S): Observable<T>;
}

src/domain/base/use-case.ts

Agora crie uma pasta de modelos dentro da pasta src/domain e adicione o modelo para o usuário 
que servirá como a lógica de negócios primária para a existência do usuário. 
A pasta de modelos conterá todos os modelos da lógica de negócios. 
Crie um arquivo user.model.ts dentro da pasta domain/models recém-criada. 

src/domain/models/user.model.ts

No arquivo de modelo do usuário, adicione todos os atributos do usuário da perspectiva geral. 
Isso não depende de nenhuma API e dados que você possa estar gerenciando para as solicitações http, 
mas apenas do que o negócio exige do objeto do usuário.

export interface UserModel {
    id: string;
    fullName: string;
    username: string;
    email?: string;
    phoneNum: string;
    createdAt?: Date;
    profilePicture: string;
    activationStatus: boolean;
}

src/domain/models/user.model.ts

Em seguida, vamos criar outra pasta para lidar com os repositórios, 
então vamos nomeá-la como repositórios e criar um arquivo chamado user.repository.ts. 
Neste repositório, criaremos uma classe abstrata que definirá todas as ações realizadas 
com o modelo de usuário. Implementaremos login, registro e ativação do usuário para a conta.

import { Observable } from 'rxjs';
import { UserModel } from '../models/user.model';
export abstract class UserRepository {
    abstract login(params: {username: string, password: string}): Observable<UserModel>;
    abstract register(params: {phoneNum: string, password: string}): Observable<UserModel>;
    abstract getUserProfile(): Observable<UserModel>;
}

src/domain/repositories/user.repository.ts

Por último, mas não menos importante, finalmente adicionaremos os casos de uso para nosso aplicativo. 
Cada um dos casos de uso terá um arquivo separado para que seja fácil de gerenciar e manter todas as 
ações independentes para que, posteriormente, se houver alguma alteração necessária, 
outros casos de uso não sejam perturbados.

Crie uma pasta chamada casos de uso dentro da pasta do domínio 
e crie arquivos para cada caso de uso da seguinte forma:

import { Observable } from 'rxjs';
import { UseCase } from '../base/use-case';
import { UserModel } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';

export class UserLoginUseCase implements UseCase<{ username: string; password: string }, UserModel> {
    constructor(private userRepository: UserRepository) { }
    execute(params: { username: string, password: string },): Observable<UserModel> {
        return this.userRepository.login(params);
    }
}

src/domain/usecases/user-login.usecase.ts


Observe que o nome do arquivo inclui o sufixo do caso de uso para que fique claro que o respectivo arquivo é um caso de uso.

import { Observable } from 'rxjs';
import { UseCase } from '../base/use-case';
import { UserModel } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';

export class UserRegisterUseCase implements UseCase<{ phoneNum: string; password: string }, UserModel> {
    constructor(private userRepository: UserRepository) { }
    execute(params: { phoneNum: string; password: string },): Observable<UserModel> {
        return this.userRepository.register(params);
    }
}

src/domain/usecases/user-register.usecase.ts

import { Observable } from 'rxjs';
import { UseCase } from '../base/use-case';
import { UserModel } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';

export class GetUserProfileUseCase implements UseCase<void, UserModel> {
    constructor(private userRepository: UserRepository) { }
    execute(): Observable<UserModel> {
        return this.userRepository.getUserProfile();
    }
}

src/domain/usecases/get-user-profile.usecase.ts

Com isso, estamos praticamente prontos na pasta de domínio.
É assim que a estrutura deve ficar até agora:

src/
├─ base/
│  ├─ mapper.ts
├─ domain/
│  ├─ base/
│  |  ├─ use-case.ts
│  ├─ models/
│  │  ├─ user.model.ts
│  ├─ repositories/
│  │  ├─ user.repository.ts
│  ├─ usecases/
│  │  ├─ user-login.usecase.ts
│  │  ├─ user-register.usecase.ts
│  │  ├─ get-user-profile.usecase.ts


Agora em direção à pasta de dados.
Vamos criar a pasta de repositórios dentro da pasta de dados. 
Nesta pasta, criaremos outra pasta para o usuário que nos 
conectará com a API para os casos de uso que precisamos realizar.

Primeiro, vamos criar uma entidade para o usuário. A Entidade do Usuário 
será conforme a resposta que você recebe do Banco de Dados via API. 
Pode ser o mesmo que o seu modelo, mas em alguns casos, pode ser diferente do modelo.

Criando o arquivo de entidade em src/data/repositories/user/entities

export interface UserEntity {
    id: string;
    name: string;
    userName: string;
    phoneNumber: string;
    userPicture: string;
    activationStatus: boolean;
}

src/data/repositories/user/entities/user-entity.ts

Agora vamos criar um mapeador para a implementação. 
O mapeamento mapeará as propriedades de UserModel para UserEntity e vice-versa.

##### import { Mapper } from 'src/base/mapper';
##### import { UserModel } from 'src/domain/models/user.model';
##### import { UserEntity } from '../entities/user-entity';

export class UserImplementationRepositoryMapper extends Mapper<UserEntity, UserModel> {
    
    mapFrom(param: UserEntity): UserModel {
        return {
            id: param.id,
            fullName: param.name,
            username: param.userName,
            phoneNum: param.phoneNumber,
            profilePicture: param.userPicture,
            activationStatus: param.activationStatus
        };
    }
	
    mapTo(param: UserModel): UserEntity {
        return {
            id: param.id,
            name: param.fullName,
            userName: param.username,
            phoneNumber: param.phoneNum,
            userPicture: param.profilePicture,
            activationStatus: param.activationStatus
        }
    }
}

src/data/repositories/user/mappers/user-repository.mapper.ts

Com tudo isso configurado, vamos para o repositório de implementação 
onde executamos os casos de uso reais. Este repositório de implementação 
do usuário executará todos os casos de uso declarados para o usuário.

Criando o user-implementation.repository.ts

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserEntity } from './entities/user-entity';
import { UserImplementationRepositoryMapper } from './mappers/user-repository.mapper';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { UserModel } from 'src/domain/models/user.model';

@Injectable({
    providedIn: 'root',
})
export class UserImplementationRepository extends UserRepository {
    userMapper = new UserImplementationRepositoryMapper();
    constructor(private http: HttpClient) {
        super();
    }
    login(params: {username: string, password: string}): Observable<UserModel> {
        return this.http
            .post<UserEntity>('https://example.com/login', {params})
            .pipe(map(this.userMapper.mapFrom));
    }
    register(params: {phoneNum: string, password: string}): Observable<UserModel> {
       return this.http
            .post<UserEntity>('https://example.com/register', {params})
            .pipe(map(this.userMapper.mapFrom));
    }
    getUserProfile(): Observable<UserModel>{
        return this.http.get<UserEntity>('https://example.com/user').pipe(
            map(this.userMapper.mapFrom));
    }
}

src/data/repositories/user/user-implementation.repository.ts

Com isso, toda a configuração da implementação agora é hora de 
fornecer todos os casos de uso ao provedor do módulo de dados.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { UserLoginUseCase } from 'src/domain/usecases/user-login.usecase';
import { UserRegisterUseCase } from 'src/domain/usecases/user-register.usecase';
import { GetUserProfileUseCase } from 'src/domain/usecases/get-user-profile.usecase';
import { UserImplementationRepository } from './repositories/user/user-implementation.repository';

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

@NgModule({
    providers: [
        userLoginUseCaseProvider,
        userRegisterUseCaseProvider,
        getUserProfileUseCaseProvider,
        { provide: UserRepository, useClass: UserImplementationRepository },
    ],
    imports: [
        CommonModule,
        HttpClientModule,
    ],
})
export class DataModule { }

src/data/data.module.ts

Com tudo isso feito agora só falta executar o caso de uso que irá executar o repositório de implementação.
Para isso, na pasta de apresentação, crie seus componentes separados e, no construtor, 
importe os casos de uso de acordo com o componente e use a função execute e, em seguida, 
assine ou chame-a, no entanto, você chamaria uma função de API normal.
A estrutura de pastas final seria muito parecida com esta:

src/
├─ base/
│  ├─ mapper.ts
├─ domain/
│  ├─ base/
│  |  ├─ use-case.ts
│  ├─ models/
│  │  ├─ user.model.ts
│  ├─ repositories/
│  │  ├─ user.repository.ts
│  ├─ usecases/
│  │  ├─ user-login.usecase.ts
│  │  ├─ user-register.usecase.ts
│  │  ├─ get-user-profile.usecase.ts
├─ data/
│  ├─ repositories/
│  │  ├─ user/
│  │  │  ├─ entities/
│  │  │  │  ├─ user-entity.ts
│  │  │  ├─ mappers/
│  │  │  │  ├─ user-repository.mapper.ts
│  │  │  ├─ user-implementation.repository.ts
│  ├─ data.module.ts
├─ presentation/
│  ├─ your_structure_for_components

