import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/constants/entities';
import { registeredUsers } from 'src/entities/user.entity';

@Injectable()
export class UserServiceV1 {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly repository: typeof registeredUsers,
  ) {}

  async getRawData(id: string, attributes?: string[]) {
    try {
      return await this.repository.findOne({
        attributes,
        raw: true,
        where: { id },
      });
    } catch (error) {
      return '500';
    }
  }

  async getRawDataWithWhere(where = {}, attributes?: string[]) {
    try {
      return await this.repository.findOne({
        attributes,
        raw: true,
        where: where,
      });
    } catch (error) {
      return '500';
    }
  }

  async updateRawData(data, id) {
    try {
      return await this.repository.update(data, {
        where: {
          id,
        },
      });
    } catch (error) {
      return '500';
    }
  }

  async getfindAllRawDataWithWhere(where = {}, attributes?: string[]) {
    try {
      return await this.repository.findAll({
        attributes,
        raw: true,
        where: where,
      });
    } catch (error) {
      return [];
    }
  }

  async getAllRawData(attributes: string[], options: any) {
    try {
      return await this.repository.findAll({
        attributes,
        ...options,
      });
    } catch (error) {
      return '500';
    }
  }
}
