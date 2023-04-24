import { Test, TestingModule } from '@nestjs/testing'
import { MongooseModule } from '@nestjs/mongoose'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { UserModule } from './user.module'

describe('UserModule', () => {
  let module: TestingModule

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/test'),
        UserModule,
      ],
    }).compile()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should be defined', () => {
    expect(module).toBeDefined()
  })

  it(`should import the UserModule and provide the UserService`, () => {
    const userService = module.get<UserService>(UserService)
    expect(userService).toBeDefined()
  })

  it(`should provide the UserController`, () => {
    const userController = module.get<UserController>(UserController)
    expect(userController).toBeDefined()
  })
})
