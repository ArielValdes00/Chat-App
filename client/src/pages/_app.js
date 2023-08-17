import ChatProvider from '@/context/ChatProvider'
import '@/styles/globals.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
    return (
        <ChatProvider>
            <Head>
                <title>Chatify</title>
                <link rel="icon" href="/icons/chatify-logo.png" />
                <meta name="description" content="Welcome to our real-time messaging chat application. Connect with friends and colleagues through seamless and expressive conversations. Create chat groups, upload profile and group images, and stay updated with instant notifications. Powered by socket.io for a fast and authentic communication experience."/>                
                <meta property="og:title" content="Chatify - Ariel Valdés" />
                <meta property="og:description" content="Welcome to our real-time messaging chat application. Connect with friends and colleagues through seamless and expressive conversations. Create chat groups, upload profile and group images, and stay updated with instant notifications. Powered by socket.io for a fast and authentic communication experience." />
                <meta property="og:url" content="https://chat-app-ten-topaz.vercel.app/chat" />
                <meta property="og:image" content="https://res.cloudinary.com/dnczjmsbt/image/upload/v1692132656/bg-chat-app_tmzjhk.png" />
                <meta property="og:type" content="website" />
                <meta property="og:locale" content="en_US" />
                <meta property="og:site_name" content="Chatify - Ariel Valdés" />
                <meta name="keywords" content="full stack developer, web development, front-end, back-end, database management, projects, works, react, next.js, tailwind, javascript, socket" />
                <meta name="author" content="Ariel Valdés" />
            </Head>
            <Component {...pageProps} />
        </ChatProvider>
    )

}
