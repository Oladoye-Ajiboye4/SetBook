import Router from 'express'
import { getUsers, getUserById, addUser, signup, signin, verifyEmail } from '../controller/users.controller.js'
import { signinSchema, signupSchema, validateBody } from '../utils/zodValidation.js'

const routes = Router()

routes.get('/get-users', getUsers)



routes.get('/get-user/:userid', getUserById)

routes.post('/create-user/:id', addUser)

routes.post('/sign-up', validateBody(signupSchema), signup)

routes.post('/sign-in', validateBody(signinSchema), signin)
routes.get('/verify-email/:token', verifyEmail)


export default routes