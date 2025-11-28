import { Router } from 'express'
import { body, query } from 'express-validator'
import requestValidator from './../middlewares/requestValidator.js'
import sessionValidator from './../middlewares/sessionValidator.js'
import * as controller from './../controllers/chatsController.js'
import getMessages from './../controllers/getMessages.js'

const router = Router()

router.get('/', query('id').notEmpty(), requestValidator, sessionValidator, controller.getList)

router.get('/:jid', query('id').notEmpty(), requestValidator, sessionValidator, getMessages)

router.post(
    '/delete',
    query('id').notEmpty(),
    body('receiver').notEmpty(),
    body('message').notEmpty(),
    requestValidator,
    sessionValidator,
    controller.deleteChat
)

router.post(
    '/send',
    query('id').notEmpty(),
    body('receiver').notEmpty(),
    body('message').notEmpty(),
    requestValidator,
    sessionValidator,
    controller.send
)

router.post('/send-bulk', query('id').notEmpty(), requestValidator, sessionValidator, controller.sendBulk)

router.post(
    '/forward',
    query('id').notEmpty(),
    body('forward').notEmpty(),
    body('receiver').notEmpty(),
    body('isGroup').notEmpty(),
    requestValidator,
    sessionValidator,
    controller.forward
)

router.post(
    '/read',
    query('id').notEmpty(),
    body('keys').notEmpty(),
    requestValidator,
    sessionValidator,
    controller.read
)

router.post(
    '/mark-as-read',
    query('id').notEmpty(),
    body('jid').notEmpty(),
    requestValidator,
    sessionValidator,
    controller.markConversationAsRead
)

router.post(
    '/send-presence',
    query('id').notEmpty(),
    body('receiver').notEmpty(),
    body('presence').notEmpty(),
    requestValidator,
    sessionValidator,
    controller.sendPresence
)

router.post(
    '/download-media',
    query('id').notEmpty(),
    body('remoteJid').notEmpty(),
    body('messageId').notEmpty(),
    requestValidator,
    sessionValidator,
    controller.downloadMedia
)

router.post(
    '/download-media-buffer',
    query('id').notEmpty(),
    body('remoteJid').notEmpty(),
    body('messageId').notEmpty(),
    requestValidator,
    sessionValidator,
    controller.downloadMediaBuffer
)

export default router
