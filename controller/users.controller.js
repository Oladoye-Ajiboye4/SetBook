import { compareHash, genToken, tokenHasher } from '../utils/hasher.js'
import db from '../connection/drizzle.connection.js'
import { User } from '../model/user.model.js'
import { eq } from 'drizzle-orm'

import jwt from 'jsonwebtoken'
import env from '../config/env.js'
import sendEmail from '../service/sendEmail.js'

export const getUsers = (req, res) => {
    const user = 'Faith'

    res.json({ ok: true, status: 200, message: `We have many ${user}` })
}


export const getUserById = (req, res) => {
    const user = 'Faith'

    res.json({ ok: true, status: 200, message: `We have many ${user}` })
}

export const addUser = (req, res) => {
    try {
        console.log(req.params.id)
        if (!req.body) {
            return res.status(400).json({ message: "Send reasonable data!", status: 401 })
        }
        const { username, email, password } = req.body

        const user = { username, email, password }

        users.push(...users, user)
        console.log("Account data created -", user)
        res.json({ status: 201, message: 'Account created successfully' })
    } catch {
        return res.json({ message: "Bad request or internal server error!", status: 500 })
    }
}

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body

        const hashedPassword = await tokenHasher(password)
        if (!hashedPassword) {
            return res.status(500).json({ message: "Error hashing password!", status: 500 })
        }

        const emailVerificationToken = genToken(32)
        const signedEmailVerificationToken = jwt.sign({ email, emailVerificationToken }, env.JWT_SECRET, { expiresIn: '15m' })

        const hashedEmailVerificationToken = await tokenHasher(emailVerificationToken)
        // const hashedEmailJWT = await tokenHasher(emailVerificationToken)
        const user = { username, email, password: hashedPassword, hashedEmailVerificationToken }

        await db.insert(User).values(user)


        console.log("Account data created -", user)
        console.log('Loading email verification process...')
        // const verificationLink = `${env.app_url}/verify-email?token=${emailVerificationToken}&email=${email}`
        const emailResult = await sendEmail(email, 'Verify your email', username, signedEmailVerificationToken)
        if (!emailResult.success) {
            return res.status(500).json({ message: "Error sending verification email!", status: 500 })
        }


        res.json({ status: 201, message: 'Account created successfully' })
    } catch (error) {
        console.error("Error in signup:", error)
        return res.status(500).json({ message: "Bad request or internal server error!", status: 500 })
    }
}

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await db.select().from(User).where(eq(User.email, email))

        if (!user.length) {
            return res.status(404).json({ message: "User not found!", status: 404 })
        }

        const normalizedUser = {
            id: user[0].user_id,
            username: user[0].username,
            email: user[0].email,
            role: user[0].role,
            isVerified: user[0].isVerified,
        }

        if (!user[0].isVerified) {
            return res.status(403).json({ message: "Email not verified! Please verify your email before signing in.", status: 403 })
        }
        console.log("Normalized user data:", normalizedUser)
        const isMatch = await compareHash(password, user[0].password)


        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials!", status: 401 })
        }

        jwt.sign(normalizedUser, env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                console.error("Error signing JWT:", err)
                return res.status(500).json({ message: "Error generating token!", status: 500 })
            }

            res.json({ status: 200, message: 'Signin successful', user: normalizedUser, token })
        })

    } catch (error) {
        console.error("Error in signin:", error)
        return res.status(500).json({ message: "Bad request or internal server error!", status: 500 })
    }
}



export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params

        const decoded = jwt.verify(token, env.JWT_SECRET)
        if (!decoded || !decoded.email || !decoded.emailVerificationToken) {
            return res.status(400).json({ message: "Invalid or expired verification token!", status: 400 })
        }

        const { email, emailVerificationToken } = decoded

        if (!email || !emailVerificationToken) {
            return res.status(400).json({ message: "Invalid verification token!", status: 400 })
        }
        

        const user = await db.select().from(User).where(eq(User.email, email))

        if (!user.length) {
            return res.status(404).json({ message: "User not found!", status: 404 })
        }

        const isMatch = await compareHash(emailVerificationToken, user[0].hashedEmailVerificationToken)

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid verification token!", status: 401 })
        }

        await db.update(User).set({ isVerified: true }).where(eq(User.email, email))

        res.json({ status: 200, message: 'Email verified successfully' })
    } catch (error) {
        console.error("Error in verifyEmail:", error)
        return res.status(500).json({ message: "Bad request or internal server error!", status: 500 })
    }
}