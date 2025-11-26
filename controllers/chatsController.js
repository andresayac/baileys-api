import {
    getSession,
    getChatList,
    isExists,
    sendMessage,
    formatPhone,
    formatGroup,
    readMessage,
    getMessageMedia,
    getStoreMessage,
} from './../whatsapp.js'
import response from './../response.js'
import { compareAndFilter, fileExists, isUrlValid } from './../utils/functions.js'

const getList = async (req, res) => {
    const { limit = 20, cursor = null } = req.query
    const sessionId = res.locals.sessionId

    try {
        const result = await getChatList(sessionId, false, parseInt(limit), cursor)
        return response(res, 200, true, '', result)
    } catch (error) {
        return response(res, 500, false, 'Failed to load chats.')
    }
}

const send = async (req, res) => {
    const session = getSession(res.locals.sessionId)
    const { message } = req.body
    const isGroup = req.body.isGroup ?? false
    const receiver = isGroup ? formatGroup(req.body.receiver) : formatPhone(req.body.receiver)

    const typesMessage = ['image', 'video', 'audio', 'document', 'sticker']

    const filterTypeMessaje = compareAndFilter(Object.keys(message), typesMessage)
    try {
        const exists = await isExists(session, receiver, isGroup)

        if (!exists) {
            return response(res, 400, false, 'The receiver number is not exists.')
        }

        if (filterTypeMessaje.length > 0) {
            const url = message[filterTypeMessaje]?.url

            if (url.length === undefined || url.length === 0) {
                return response(res, 400, false, 'The URL is invalid or empty.')
            }

            if (!isUrlValid(url)) {
                if (!fileExists(url)) {
                    return response(res, 400, false, 'The file or url does not exist.')
                }
            }
        }

        const result = await sendMessage(session, receiver, message, {}, 0)

        response(res, 200, true, 'The message has been successfully sent.', {
            message: result,
        })
    } catch (error) {
        response(res, 500, false, 'Failed to send the message.', error)
    }
}

const sendBulk = async (req, res) => {
    const session = getSession(res.locals.sessionId)
    const errors = []

    for (const [key, data] of req.body.entries()) {
        let { receiver, message, delay } = data

        if (!receiver || !message) {
            errors.push({ key, message: 'The receiver number is not exists.' })
            continue
        }

        if (!delay || isNaN(delay)) {
            delay = 1000
        }

        receiver = formatPhone(receiver)

        try {
            const exists = await isExists(session, receiver)

            if (!exists) {
                errors.push({ key, message: 'number not exists on whatsapp' })
                continue
            }

            await sendMessage(session, receiver, message, {}, delay)
        } catch (err) {
            errors.push({ key, message: err.message })
        }
    }

    if (errors.length === 0) {
        return response(res, 200, true, 'All messages has been successfully sent.')
    }

    const isAllFailed = errors.length === req.body.length

    response(
        res,
        isAllFailed ? 500 : 200,
        !isAllFailed,
        isAllFailed ? 'Failed to send all messages.' : 'Some messages has been successfully sent.',
        { errors },
    )
}

const deleteChat = async (req, res) => {
    const session = getSession(res.locals.sessionId)
    const { receiver, isGroup, message } = req.body

    try {
        const jidFormat = isGroup ? formatGroup(receiver) : formatPhone(receiver)

        await sendMessage(session, jidFormat, { delete: message })
        response(res, 200, true, 'Message has been successfully deleted.')
    } catch {
        response(res, 500, false, 'Failed to delete message .')
    }
}

const forward = async (req, res) => {
    const session = getSession(res.locals.sessionId)
    const { forward, receiver, isGroup } = req.body

    const { id, remoteJid } = forward
    const jidFormat = isGroup ? formatGroup(receiver) : formatPhone(receiver)

    try {
        const messages = await session.store.loadMessages(remoteJid, 25, null)


        const key = [...messages.values()].filter((element) => {
            return element.key.id === id
        })

        const queryForward = {
            forward: key[0],
        }

        await sendMessage(session, jidFormat, queryForward, {}, 0)

        response(res, 200, true, 'The message has been successfully forwarded.')
    } catch {
        response(res, 500, false, 'Failed to forward the message.')
    }
}

const read = async (req, res) => {
    const session = getSession(res.locals.sessionId)
    const { keys } = req.body

    try {
        await readMessage(session, keys)

        if (!keys[0].id) {
            throw new Error('Data not found')
        }

        response(res, 200, true, 'The message has been successfully marked as read.')
    } catch {
        response(res, 500, false, 'Failed to mark the message as read.')
    }
}

const sendPresence = async (req, res) => {
    const session = getSession(res.locals.sessionId)
    const { receiver, isGroup, presence } = req.body

    try {
        const jidFormat = isGroup ? formatGroup(receiver) : formatPhone(receiver)

        await session.sendPresenceUpdate(presence, jidFormat)

        response(res, 200, true, 'Presence has been successfully sent.')
    } catch {
        response(res, 500, false, 'Failed to send presence.')
    }
}

const downloadMedia = async (req, res) => {
    const session = getSession(res.locals.sessionId)
    const { remoteJid, messageId } = req.body

    try {
        const message = await getStoreMessage(session, messageId, remoteJid)
        const dataMessage = await getMessageMedia(session, message)

        response(res, 200, true, 'Message downloaded successfully', dataMessage)
    } catch {
        response(
            res,
            500,
            false,
            'Error downloading multimedia message: it may not exist or may not contain multimedia content.',
        )
    }
}

export { getList, send, sendBulk, deleteChat, read, forward, sendPresence, downloadMedia }
