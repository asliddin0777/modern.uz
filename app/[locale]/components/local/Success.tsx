import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import styles from "@/styles/succes.module.css"
interface Success {
  msg: string
  setErr: Dispatch<SetStateAction<boolean>>
  err: boolean
}
const Success = ({ msg, setErr, err }: Success) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      setErr(false);
    }, 1500)
    return () => clearTimeout(timeout);
  }, [err])
  return (
    <>
      <div style={msg === "We will contact you as soon as possible" ? {
        left: "87%"
      }: {}} className={err === true ? styles.success : styles.dn}>
        <div className={styles.container}>
          <p>{msg}</p>
        </div>
      </div>
    </>
  )
}

export default Success