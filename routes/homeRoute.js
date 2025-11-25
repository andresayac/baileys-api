import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
    res.json({
        status: true,
        message: 'Welcome to the WhatsApp API'
    })
})

export default router
