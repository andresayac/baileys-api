import fs from 'fs'
import path from 'path'
import __dirname from '../dirname.js'

const logFile = path.join(__dirname, 'error.log')

export const logError = (context, error) => {
    const timestamp = new Date().toISOString()
    const logMessage = `[${timestamp}] [${context}]\n${error.stack || error}\n\n`

    // Write to file
    fs.appendFileSync(logFile, logMessage)

    // Also log to console
    console.error(`[${context}]`, error)
}

export default logError
