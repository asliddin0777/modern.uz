import { ReactNode } from "react"
import axios from "axios"
import { Metadata } from "next"


export const metadata: Metadata = {
    title: "Product",
  }
  

export default function ClientLayout({ children }: {
    children: ReactNode
}) {
    axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_API}/api`

    return children
}