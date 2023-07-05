import ChatProvider from '@/context/ChatProvider'
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
    return (
        <ChatProvider>
            <Component {...pageProps} />
        </ChatProvider>
    )

}
