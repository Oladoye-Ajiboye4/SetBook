import { z } from 'zod'

const username = z
    .string({ message: 'Username is required' })
    .trim()
    .min(2, 'Username must be at least 2 characters long')
    .max(255, 'Username must not exceed 255 characters')

const email = z
    .string({ message: 'Email is required' })
    .trim()
    .email('Please provide a valid email address')
    .max(255, 'Email must not exceed 255 characters')
    .transform((value) => value.toLowerCase())

const password = z
    .string({ message: 'Password is required' })
    .min(8, 'Password must be at least 8 characters long')
    .max(255, 'Password must not exceed 255 characters')

export const signupSchema = z.object({
    username,
    email,
    password
})

export const signinSchema = z.object({
    email,
    password
})

export const validateBody = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
        const errors = result.error.issues.map((issue) => ({
            field: issue.path.join('.') || 'body',
            message: issue.message
        }))

        return res.status(400).json({
            ok: false,
            status: 400,
            message: 'Validation failed',
            errors
        })
    }

    req.body = result.data
    next()
}
