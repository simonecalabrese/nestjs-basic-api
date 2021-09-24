import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt'
import { bcryptSaltRounds } from '../auth/constants';

@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: User): Promise<any> {
    const app = this
    let passwdHashed = ''
    await bcrypt.hash(user.password, bcryptSaltRounds).then(async function(hash) {
      passwdHashed = hash
    });
    return await new app.userModel({
      name: user.name,
      username: user.username,
      email: user.email,
      password: passwdHashed
    }).save()
  }

  async hashCompare(reqPass, dbPass) {
    let result = false
    await bcrypt.compare(reqPass, dbPass).then(function(res) {
        result = res
    });
    return result
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(query:any): Promise<User> {
    return this.userModel.findOne(query).exec();
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
