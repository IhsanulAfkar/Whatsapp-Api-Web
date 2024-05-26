'use client'

import { NextUIProvider } from '@nextui-org/react'
const ThemeProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <NextUIProvider>
            {children}
        </NextUIProvider>
    )
}
export default ThemeProviders