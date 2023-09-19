import { ReactNode } from "react"

export const metadata = {
    title: "Company"
}

export default function ClientLayout({children}: {
    children: ReactNode
}) {
    return children
}