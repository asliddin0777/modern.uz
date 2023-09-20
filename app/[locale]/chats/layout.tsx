import { ReactNode } from "react"
import axios from "axios"
export const metadata = {
    title: "Chat"
}

export default function ClientLayout({ children }: {
    children: ReactNode
}) {
    axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_API}/api`
    return children
}