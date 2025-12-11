import AppDataSource from '../ormconfig'
import * as dotenv from 'dotenv'
import { RoleSeeder } from './role.seed';

dotenv.config()

async function runSeeds() {
  try {
    await AppDataSource.initialize();

    const roleSeeder = new RoleSeeder(AppDataSource);

    await roleSeeder.seed();
    
    process.exit(0)
  } catch (error) {
    console.error(`SEED ERROR!`, error)
    process.exit(1)
  }
}

runSeeds()
