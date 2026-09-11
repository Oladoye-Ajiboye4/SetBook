import express from 'express'
import env from './config/env.js'
import usersRoutes from './routes/users.routes.js'
import cors from 'cors'

import logger from './middleware/logger.js'


const app = express()


app.use(cors({origin: env.app_url}))
app.use(express.json())

app.use(logger)

app.use(usersRoutes)


const PORT = env.port


const users = []




app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})