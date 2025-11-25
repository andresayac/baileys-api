import { validationResult } from 'express-validator'
import response from './../response.js'

const validate = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().reduce((acc, error) => {
            acc[error.path] = error.msg
            return acc
        }, {})
        return response(res, 400, false, 'Please fill out all required input.', formattedErrors)
    }

    next()
}

export default validate
