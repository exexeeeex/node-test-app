import { Role } from "../entities/role.entity";
import { DataSource } from "typeorm";

export class RoleSeeder {
  constructor (private dataSource: DataSource) {}

  async seed() {
    const roleRepository = this.dataSource.getRepository(Role);

    const existingRoles = await roleRepository.count();

    if (existingRoles > 0)
      return;

    const roles = [
      {
        name: 'user'
      },
      {
        name: 'admin'
      }
    ]
    
    await roleRepository.save(roles);

  }
}
