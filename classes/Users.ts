import EntityGetOnly from './base/EntityGetOnly.js'
import Amo from './Amo.js'
import { User } from '../types/user.js'
import { UserQueryParams } from '../types/query_params.js'

export default class Users extends EntityGetOnly<'users', User, UserQueryParams> {
  constructor(protected amo: Amo) {
    super(amo, 'users')
  }

  async getById(id: number): Promise<User | null> {
    const users = await this.get()
    if (!users) return users
    return users.find((user) => user.id === id) || null
  }

  async getByName(name: string): Promise<User | null> {
    const users = await this.get()
    if (!users) return users
    return users.find((user) => user.name === name) || null
  }
}
