"use client"
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const Detail = () => {
    const router = useRouter()
    useEffect(()=> {
        router.push("/detail/1")
    })
  return (
    <div>detail</div>
  )
}

export default Detail