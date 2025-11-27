# Baileys WhatsApp API

A production-ready RESTful API implementation of [@whiskeysockets/Baileys](https://github.com/whiskeysockets/Baileys) with multi-device support, database persistence, webhook integration, and automatic history synchronization.

## ✨ Features

- 🔐 **Multi-Device Support** - Connect multiple WhatsApp accounts simultaneously
- 💾 **Database Persistence** - Store sessions, chats, contacts, and messages using Prisma ORM (MySQL)
- 📜 **History Sync** - Automatic synchronization of chat history and messages
- 📄 **Cursor Pagination** - Efficient pagination for chats and messages
- 🔔 **Webhook Integration** - Real-time event notifications for all WhatsApp events
- 🔑 **API Authentication** - Secure your endpoints with token-based authentication
- 📱 **QR Code & Pairing Code** - Flexible authentication methods
- 🚀 **Production Ready** - Built with Express 5, Prisma, and modern Node.js (ESM)
- 🧹 **Smart Filtering** - Automatically filters out protocol messages from chat history

## 📋 Requirements

- **Node.js** version **18.16.0** or higher
- **MySQL** database (or compatible database supported by Prisma)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/plusemon/baileys-api.git
cd baileys-api
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
HOST=127.0.0.1
PORT=8000

# WhatsApp Connection
MAX_RETRIES=-1                    # -1 for infinite retries
RECONNECT_INTERVAL=5000           # Milliseconds between reconnection attempts

# Authentication
AUTHENTICATION_GLOBAL_AUTH_TOKEN= # Leave empty to disable, or set a secure token

# Webhook Configuration
APP_WEBHOOK_URL=                  # Your webhook endpoint URL
APP_WEBHOOK_ALLOWED_EVENTS=MESSAGES_UPSERT,MESSAGES_DELETE,MESSAGES_UPDATE
APP_WEBHOOK_FILE_IN_BASE64=false  # Set to true to receive media files as base64

# Database Configuration
STORE_TYPE=database               # "database" or "file"
DATABASE_URL=mysql://root:password@localhost:3306/whatsapp_web_api
```

### 3. Setup Database

```bash
npx prisma migrate deploy
npx prisma generate
```

### 4. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:8000`.

## 📚 API Documentation

### Authentication

If `AUTHENTICATION_GLOBAL_AUTH_TOKEN` is set in your `.env`, include it in requests:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:8000/sessions/list
```

### Session Management

#### Create Session (QR Code)

```bash
POST /sessions/add
Content-Type: application/json

{
  "id": "my-session"
}
```

**Response:**
```json
{
  "success": true,
  "message": "QR code received, please scan the QR code.",
  "data": {
    "qrcode": "data:image/png;base64,..."
  }
}
```

#### Create Session (Pairing Code)

```bash
POST /sessions/add
Content-Type: application/json

{
  "id": "my-session",
  "typeAuth": "code",
  "phoneNumber": "1234567890"
}
```

#### Get Session Status

```bash
GET /sessions/status/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "authenticated"
  }
}
```

#### List All Sessions

```bash
GET /sessions/list
```

#### Delete Session

```bash
DELETE /sessions/delete/:id
```

### Chat Operations

#### Get Chats List (with Pagination)

```bash
GET /chats?id=my-session&limit=20&cursor=12
```

**Parameters:**
- `id` (required): Session ID
- `limit` (optional, default: 20): Number of chats per page
- `cursor` (optional): Cursor from previous response for next page

**Response:**
```json
{
  "success": true,
  "data": {
    "chats": [
      {
        "id": "1234567890@s.whatsapp.net",
        "name": "John Doe",
        "unreadCount": 5,
        "conversationTimestamp": 1732534567,
        "lastUpdated": 1732534567890
      }
    ],
    "nextCursor": "25",
    "hasMore": true
  }
}
```

#### Get Chat Messages (with Pagination)

```bash
GET /chats/:jid?id=my-session&limit=25&cursorId=ABC123&cursorFromMe=false
```

**Parameters:**
- `id` (required): Session ID
- `limit` (optional, default: 25): Number of messages per page
- `cursorId` (optional): Message ID from previous response
- `cursorFromMe` (optional): Whether cursor message was sent by you

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "key": {
          "remoteJid": "1234567890@s.whatsapp.net",
          "id": "ABC123",
          "fromMe": false
        },
        "message": {
          "conversation": "Hello!"
        },
        "messageTimestamp": 1732534567,
        "pushName": "John Doe"
      }
    ],
    "nextCursor": {
      "id": "XYZ789",
      "fromMe": true
    },
    "hasMore": true
  }
}
```

#### Send Text Message

```bash
POST /chats/send?id=my-session
Content-Type: application/json

{
  "receiver": "1234567890",
  "message": {
    "text": "Hello from API!"
  }
}
```

#### Send Media Message

```bash
POST /chats/send?id=my-session
Content-Type: application/json

{
  "receiver": "1234567890",
  "message": {
    "image": {
      "url": "https://example.com/image.jpg",
      "caption": "Check this out!"
    }
  }
}
```

Supported media types: `image`, `video`, `audio`, `document`, `sticker`

#### Send Bulk Messages

```bash
POST /chats/send-bulk?id=my-session
Content-Type: application/json

[
  {
    "receiver": "1234567890",
    "message": { "text": "Hello!" },
    "delay": 1000
  },
  {
    "receiver": "0987654321",
    "message": { "text": "Hi there!" },
    "delay": 2000
  }
]
```

#### Mark Messages as Read

```bash
POST /chats/read?id=my-session
Content-Type: application/json

{
  "keys": [
    {
      "remoteJid": "1234567890@s.whatsapp.net",
      "id": "MESSAGE_ID",
      "fromMe": false
    }
  ]
}
```

#### Mark Conversation as Read

Mark all messages in a conversation as read and reset the unread count:

```bash
POST /chats/mark-as-read?id=my-session
Content-Type: application/json

{
  "jid": "1234567890@s.whatsapp.net"
}
```

**Response:**
```json
{
  "success": true,
  "message": "The conversation has been successfully marked as read.",
  "data": {
    "markedCount": 15
  }
}
```

#### Send Presence Update


```bash
POST /chats/send-presence?id=my-session
Content-Type: application/json

{
  "receiver": "1234567890",
  "presence": "composing"
}
```

Presence types: `composing`, `recording`, `available`, `unavailable`

### Group Management

#### Get Group List

```bash
GET /groups?id=my-session
```

#### Create Group

```bash
POST /groups/create?id=my-session
Content-Type: application/json

{
  "subject": "My Group",
  "participants": ["1234567890", "0987654321"]
}
```

#### Update Group Participants

```bash
POST /groups/update-participants?id=my-session
Content-Type: application/json

{
  "groupId": "123456789-1234567890@g.us",
  "participants": ["1234567890"],
  "action": "add"
}
```

Actions: `add`, `remove`, `promote`, `demote`

#### Update Group Subject

```bash
POST /groups/update-subject?id=my-session
Content-Type: application/json

{
  "groupId": "123456789-1234567890@g.us",
  "subject": "New Group Name"
}
```

#### Get Invite Code

```bash
POST /groups/invite-code?id=my-session
Content-Type: application/json

{
  "groupId": "123456789-1234567890@g.us"
}
```

## 🔔 Webhook Events

Configure webhook URL in `.env`:

```env
APP_WEBHOOK_URL=https://your-webhook-endpoint.com/webhook
APP_WEBHOOK_ALLOWED_EVENTS=ALL
```

### Available Events

| Event | Description |
|-------|-------------|
| `QRCODE_UPDATED` | QR code generated/updated |
| `CONNECTION_UPDATE` | Connection status changed |
| `MESSAGES_UPSERT` | New message received |
| `MESSAGES_UPDATE` | Message updated (status, edit) |
| `MESSAGES_DELETE` | Message deleted |
| `MESSAGING_HISTORY_SET` | Chat history synced |
| `CHATS_SET` | Initial chats loaded |
| `CHATS_UPSERT` | New chat created |
| `CHATS_UPDATE` | Chat updated |
| `CONTACTS_SET` | Initial contacts loaded |
| `CONTACTS_UPSERT` | Contact added/updated |
| `GROUPS_UPSERT` | Group created |
| `GROUPS_UPDATE` | Group info updated |
| `GROUP_PARTICIPANTS_UPDATE` | Participant added/removed/promoted/demoted |
| `PRESENCE_UPDATE` | User online/typing status |

### Webhook Payload

```json
{
  "instance": "my-session",
  "type": "MESSAGES_UPSERT",
  "data": {
    // Event-specific data
  }
}
```

## 🗄️ Database Schema

### Session Table
Stores WhatsApp authentication data (credentials, encryption keys, pre-keys, session keys).

**Note:** 800+ records per session is normal! Each record stores different encryption keys required by the Signal Protocol.

### Chat Table
Stores chat/conversation metadata.

### Message Table
Stores message history with automatic filtering of protocol messages.

### Contact Table
Stores contact information.

### Database Commands

```bash
# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# View database in Prisma Studio
npx prisma studio

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset
```

## 🛠️ Development

### Project Structure

```
baileys-api/
├── controllers/          # API route controllers
│   ├── sessionsController.js
│   ├── chatsController.js
│   ├── getMessages.js
│   └── groupsController.js
├── middlewares/          # Express middlewares
│   ├── authenticationValidator.js
│   ├── requestValidator.js
│   └── sessionValidator.js
├── routes/              # API route definitions
│   ├── sessionsRoute.js
│   ├── chatsRoute.js
│   └── groupsRoute.js
├── store/               # Data persistence layer
│   ├── database-store.js        # Database storage implementation
│   ├── database-auth-state.js   # Auth state management
│   └── memory-store.js          # In-memory storage
├── utils/               # Utility functions
│   ├── prisma.js
│   ├── logger.js
│   └── functions.js
├── prisma/              # Database schema and migrations
│   ├── schema.prisma
│   └── migrations/
├── app.js               # Express app setup
├── whatsapp.js          # Baileys integration & event handlers
└── routes.js            # Route registration
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

## 🎯 Key Features Explained

### History Synchronization

When you connect a new session, WhatsApp automatically syncs your chat history through `HISTORY_SYNC_NOTIFICATION` messages. The API:

1. Receives encrypted history sync notifications
2. Downloads and decrypts the history
3. Fires `messaging-history.set` event with chats, contacts, and messages
4. Stores everything in the database
5. Filters out protocol messages automatically

### Cursor Pagination

Both chats and messages use cursor-based pagination for efficiency:

**Chats:** Uses `pkId` (primary key) as cursor
**Messages:** Uses `{id, fromMe}` composite cursor

Benefits:
- ✅ Consistent results even with new data
- ✅ Better performance than offset pagination
- ✅ Works well with real-time updates

### Protocol Message Filtering

The API automatically filters out these system messages:
- `HISTORY_SYNC_NOTIFICATION`
- `APP_STATE_SYNC_KEY_SHARE`
- `INITIAL_SECURITY_NOTIFICATION_SETTING_SYNC`
- `APP_STATE_FATAL_EXCEPTION_NOTIFICATION`

Only real chat messages are stored and returned.

## 📝 Important Notes

- **Session Recovery**: Sessions are automatically recovered on server restart
- **Multi-Device**: Each session supports WhatsApp multi-device protocol
- **Rate Limiting**: Implement rate limiting in production to avoid WhatsApp bans
- **Message Validation**: Always validate message content before sending
- **Error Handling**: The API provides detailed error messages
- **Auto-Reconnect**: Automatic reconnection with configurable retry logic

## ⚠️ Disclaimer

This project is intended for **educational and legitimate business purposes only**. 

**DO NOT use for:**
- ❌ Spamming
- ❌ Unsolicited marketing
- ❌ Any activities prohibited by WhatsApp's Terms of Service

The authors are not responsible for misuse of this software. Use at your own risk.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [@whiskeysockets/Baileys](https://github.com/whiskeysockets/Baileys) - The amazing WhatsApp Web API library
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- All contributors and users of this project

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/plusemon/baileys-api/issues)
- **Discussions**: [GitHub Discussions](https://github.com/plusemon/baileys-api/discussions)

---

**Made with ❤️ for the WhatsApp API community**
