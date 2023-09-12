import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import styles from "@/styles/succes.module.css"
interface Success {
  msg: string
  setErr: Dispatch<SetStateAction<boolean>>
  err: boolean
}
const Success = ({ msg, setErr, err }: Success) => {
  useEffect(()=> {
    const timeout = setTimeout(() => {
      setErr(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [err])
  return (
    <>
    <div className={err === true ? styles.succes: styles.dn}>
      <div className={styles.container}>
        <p>{msg}</p>
      </div>
    </div>
    </>
  )
}

export default Error