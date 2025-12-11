import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { error } from "console";

export class UserController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  async signUp(req: Request, res: Response) {
    try {
      const response = await this.userService.signUp(req.body);
      res.status(201).json(response)
    } catch (error) {
      res.status(400).json({ 
        error: error.message,
        code: 'SIGNUP_ERROR'
      })
    }
  }

  async signIn(req: Request, res: Response) {
    try {
      const response = await this.userService.signIn(req.body);
      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ 
        error: error.message,
        code: 'SIGNIN_ERROR'
      })
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const user = await this.userService.getUserById(req.params.userId);
      if (!user)
        res.status(404).json({
          error: 'Not found',
          code: 'GET_USER_ERROR'
        })
      res.status(200).json(user)
    } catch (error) {
      res.status(400).json({ 
        error: error.message,
        code: 'GET_USER_ERROR'
      })
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      if (users.length === 0)
        res.status(404).json({
          error: 'Not found',
          code: 'GET_ALL_USERS_ERROR'
        })
      res.status(200).json(users);
    } catch (error) {
      res.status(400).json({ 
        error: error.message,
        code: 'GET_ALL_USERS_ERROR'
      })
    }
  }

  async blockUser(req: Request, res: Response) {
    try {
      const { userId } = req.params
      if (!userId)
        res.status(400).json({
          error: 'UserId is empty',
          code: 'BLOCK_USER_ERROR'
        })
      const response = await this.userService.blockUserById(req.params.userId)
      res.status(200).json(response)
    } catch (error) {
      res.status(400).json({ 
        error: error.message,
        code: 'BLOCK_USER_ERROR'
      })
    }
  }
}

export const userController = new UserController()
