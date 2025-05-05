

import type { Metadata } from 'next'

import './globals.css'
import { ThemeProvider } from '../components/themeProvider'
import { ToastContainer } from 'react-toastify'

export const metadata: Metadata = {
  title: 'SmartSummarize AI',
  description: 'SmartSummarize AI - Summarize your text with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ToastContainer
            position="top-right"
            theme="dark"
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}