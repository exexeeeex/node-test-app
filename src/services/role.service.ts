import { Role } from "../entities/role.entity";
import AppDataSource from "../ormconfig";
import { ILike, Repository } from "typeorm";

export class RoleService {
  private roleRepository: Repository<Role>

  constructor() {
    this.roleRepository = AppDataSource.getRepository(Role)
  }

  async getRoleByName(roleName:string) {
    return await this.roleRepository.findOne({
      where: {name: ILike(roleName)}
    });
  }
}
