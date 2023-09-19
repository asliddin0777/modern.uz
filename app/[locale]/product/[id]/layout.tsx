import { ReactNode } from "react"

export const metadata = {
    title: "Product"
}

export default function ClientLayout({children}: {
    children: ReactNode
}) {
    return children
}