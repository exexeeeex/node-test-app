import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { accessMiddleware } from "../middlewares/access.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const router = Router()

router.post('/sign-up', userController.signUp.bind(userController))
router.post('/sign-in', userController.signIn.bind(userController))
router.get('/get-by-id/:userId', accessMiddleware, userController.getUserById.bind(userController))
router.get('/get-all', roleMiddleware, userController.getAllUsers.bind(userController));
router.patch('/block-user/:userId', accessMiddleware, userController.blockUser.bind(userController))

export default router;
