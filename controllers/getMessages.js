import { getSession, formatGroup, formatPhone } from '../whatsapp.js'
import response from './../response.js'

const getMessages = async (req, res) => {
    const session = getSession(res.locals.sessionId)

    const { jid } = req.params
    const { limit = 25, cursorId = null, cursorFromMe = null, isGroup = false } = req.query

    const isGroupBool = isGroup === 'true'
    const jidFormat = isGroupBool ? formatGroup(jid) : formatPhone(jid)

    const cursor = {}

    if (cursorId) {
        cursor.before = {
            id: cursorId,
            fromMe: Boolean(cursorFromMe && cursorFromMe === 'true'),
        }
    }

    try {
        const useCursor = 'before' in cursor ? cursor : null
        const messages = await session.store.loadMessages(jidFormat, parseInt(limit), useCursor)

        // Determine if there are more messages
        const hasMore = messages.length === parseInt(limit)
        const nextCursor = hasMore && messages.length > 0
            ? {
                id: messages[messages.length - 1].key.id,
                fromMe: messages[messages.length - 1].key.fromMe
            }
            : null

        response(res, 200, true, '', {
            messages,
            nextCursor,
            hasMore
        })
    } catch {
        response(res, 500, false, 'Failed to load messages.')
    }
}

export default getMessages
