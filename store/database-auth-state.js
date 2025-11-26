import { initAuthCreds, BufferJSON, proto } from 'baileys'
import prisma from '../utils/prisma.js'

export const useDatabaseAuthState = async (sessionId) => {
    const writeData = async (data, id) => {
        try {
            await prisma.session.upsert({
                where: {
                    sessionId_id: {
                        sessionId,
                        id
                    }
                },
                create: {
                    sessionId,
                    id,
                    data: JSON.stringify(data, BufferJSON.replacer)
                },
                update: {
                    data: JSON.stringify(data, BufferJSON.replacer)
                }
            })
        } catch (error) {
            logger.error('Error writing session data:', error)
        }
    }

    const readData = async (id) => {
        try {
            const session = await prisma.session.findUnique({
                where: {
                    sessionId_id: {
                        sessionId,
                        id
                    }
                }
            })
            if (session) {
                return JSON.parse(session.data, BufferJSON.reviver)
            }
        } catch (error) {
            logger.error('Error reading session data:', error)
            return null
        }
    }

    const removeData = async (id) => {
        try {
            await prisma.session.delete({
                where: {
                    sessionId_id: {
                        sessionId,
                        id
                    }
                }
            })
        } catch (error) {
            // ignore if not found
        }
    }

    let creds = await readData('creds')
    if (!creds) {
        creds = initAuthCreds()
        await writeData(creds, 'creds')
    }

    return {
        state: {
            creds,
            keys: {
                get: async (type, ids) => {
                    const data = {}
                    await Promise.all(
                        ids.map(async (id) => {
                            let value = await readData(`${type}-${id}`)
                            if (type === 'app-state-sync-key' && value) {
                                value = proto.Message.AppStateSyncKeyData.fromObject(value)
                            }
                            data[id] = value
                        })
                    )
                    return data
                },
                set: async (data) => {
                    const tasks = []
                    for (const category in data) {
                        for (const id in data[category]) {
                            const value = data[category][id]
                            const key = `${category}-${id}`
                            if (value) {
                                tasks.push(writeData(value, key))
                            } else {
                                tasks.push(removeData(key))
                            }
                        }
                    }
                    await Promise.all(tasks)
                }
            }
        },
        saveCreds: () => {
            return writeData(creds, 'creds')
        }
    }
}
