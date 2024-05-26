import ThemeProviders from '@/components/Providers/NextUIProvider'
import { NextPage } from 'next'
import './globals.css'
import Provider from '@/components/Providers/SessionProvider'
import { Toaster } from 'react-hot-toast'
import { SocketProvider } from '@/components/Providers/SocketProvider'
interface Props {
    children: React.ReactNode
}

const Layout: NextPage<Props> = ({ children }) => {
    return (
        <html lang="en">
            <head>
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>WhatsApp API</title>
            </head>
            <body>
                <ThemeProviders>
                    <Provider>
                        <SocketProvider>
                            <Toaster
                                position='top-right'
                            />
                            {children}
                        </SocketProvider>
                    </Provider>
                </ThemeProviders>
            </body>
        </html>
    )
}

export default Layout
