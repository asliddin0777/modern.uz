import React from 'react'

import styles from "@/styles/loader.module.css"

const Loader = () => {
    return (
        <div className={styles.loader}>
            <main className={styles.main}>
                <div className={styles.dankAssLoader}>
                    <div className={styles.row}>
                        <div className={`${styles.arrow} ${styles.up} ${styles.outer} ${styles.outer18}`}></div>
                        <div className={`${styles.arrow} ${styles.down} ${styles.outer} ${styles.outer17}`}></div>
                        <div className={`${styles.arrow}  ${styles.up}  ${styles.outer} ${styles.outer16}`}></div>
                        <div className={`${styles.arrow} ${styles.down} ${styles.outer} ${styles.outer15}`}></div>
                        <div className={`${styles.arrow} ${styles.up} ${styles.outer} ${styles.outer14}`}></div>
                    </div>
                    <div className={styles.row}>
                        <div className={`${styles.arrow} ${styles.up} ${styles.outer} ${styles.outer11}`}></div>
                        <div className={`${styles.arrow} ${styles.down} ${styles.outer} ${styles.outer2}`}></div>
                        <div className={`${styles.arrow} ${styles.up} ${styles.inner} ${styles.inner6}`}></div>
                        <div className={`${styles.arrow} ${styles.down} ${styles.inner} ${styles.inner5}`}></div>
                        <div className={`${styles.arrow} ${styles.up} ${styles.inner} ${styles.inner4}`}></div>
                        <div className={`${styles.arrow} ${styles.down} ${styles.outer} ${styles.outer13}`}></div>
                        <div className={`${styles.arrow} ${styles.up} ${styles.outer} ${styles.outer12}`}></div>
                    </div>
                    <div className={styles.row}>
                        <div className={`${styles.arrow} ${styles.down} ${styles.outer} ${styles.outer3}`}></div>
                        <div className={`${styles.arrow} ${styles.up} ${styles.outer} ${styles.outer4}`}></div>
                        <div className={`${styles.arrow} ${styles.down} ${styles.inner} ${styles.inner1}`}></div>
                        <div className={`${styles.arrow} ${styles.up} ${styles.inner} ${styles.inner2}`}></div>
                        <div className={`${styles.arrow} ${styles.down} ${styles.inner} ${styles.inner3}`}></div>
                        <div className={`${styles.arrow} ${styles.up} ${styles.outer} ${styles.outer11}`}></div>
                        <div className={`${styles.arrow} ${styles.down} ${styles.outer} ${styles.outer10}`}></div>
                    </div>
                    <div className={styles.row}>
                        <div className={`${styles.arrow} ${styles.down} ${styles.outer}${styles.outer5}`}></div>
                        <div className={`${styles.arrow} ${styles.up} ${styles.outer} ${styles.outer6}`}></div>
                        <div className={`${styles.arrow} ${styles.down} ${styles.outer} ${styles.outer7}`}></div>
                        <div className={`${styles.arrow} ${styles.up} ${styles.outer} ${styles.outer8}`}></div>
                        <div className={`${styles.arrow} ${styles.down} ${styles.outer} ${styles.outer9}`}></div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Loader