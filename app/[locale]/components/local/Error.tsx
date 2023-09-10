import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import styles from "@/styles/error.module.css"
interface Error {
  msg: string
  setErr: Dispatch<SetStateAction<boolean>>
  err: boolean
}
const Error = ({ msg, setErr, err }: Error) => {
  useEffect(()=> {
    const timeout = setTimeout(() => {
      setErr(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [err])
  return (
    <>
    <div className={err === true ? styles.error: styles.dn}>
      <div className={styles.container}>
        <p>{msg}</p>
      </div>
    </div>
    </>
  )
}

export default Error