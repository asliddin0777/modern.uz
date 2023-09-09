import React from 'react'
import styles from "@/styles/error.module.css"
interface Error {
  msg: string
}
const Error = ({ msg }: Error) => {
  return (
    <div className={msg ? styles.error: styles.dn}>
      <div className={styles.container}>
        <p>{msg}</p>
      </div>
    </div>
  )
}

export default Error