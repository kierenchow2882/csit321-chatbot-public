import './globals.css'

export const metadata = {
  title: 'Automotive Chatbot Platform',
  description: 'Create, customize, and deploy intelligent chatbots for your automotive business',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
