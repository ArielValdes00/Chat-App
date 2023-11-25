# Chat App 

This is a real-time chat application that leverages Socket.io for seamless communication. It features user authentication, private messaging, and the ability to create groups. Users can personalize their profiles with a profile picture, send emojis for expressive conversations, and have the option to delete chats or messages for better control over their communication.

## Installation and Usage

### Frontend
1. Clone the repository and navigate to the frontend directory:
    ```bash
    git clone https://github.com/ArielValdes00/Chat-App.git
    cd client
    ```
2. Install the dependencies and start the development server:
    ```bash
    npm install
    npm run dev
    ```

### Backend
1. Navigate to the backend directory:
    ```bash
    cd server
    ```
2. Install the dependencies and start the development server:
    ```bash
    npm install
    npm run dev
    ```

### Environment Variables
You need to create a `.env` file in both the frontend and backend directories and fill in the following variables:

## Frontend
```bash
NEXT_PUBLIC_CHAT_URL=your_value
NEXT_PUBLIC_USER_URL=your_value
NEXT_PUBLIC_MESSAGE_URL=your_value
NEXT_PUBLIC_URL=your_value
```
## Backend
```bash
MONGO_URL=your_value
JWT_SECRET=your_value
CLOUDINARY_NAME=your_value
CLOUDINARY_API_KEY=your_value
CLOUDINARY_API_SECRET=your_value
VERCEL_URL=your_value
EMAIL_USER=your_value
EMAIL_PASSWORD=your_value
APP_URL=your_value
```
### Project Link
[![portfolio](https://img.shields.io/badge/ChatApp-000?style=for-the-badge)](https://chat-app-ten-topaz.vercel.app/)


