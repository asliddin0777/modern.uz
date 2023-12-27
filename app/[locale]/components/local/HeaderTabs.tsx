import React from 'react'
import styles from "@/styles/headerTabs.module.css"

interface Tabs {
  buttonColor: number
  setButtonColor: Function
}

const HeaderTabs = ({ buttonColor, setButtonColor }: Tabs) => {
  return (
    <div className={styles.headerTabs}>
      <div className={styles.tabs}>
        <button
          onClick={() => {
            setButtonColor(0);
          }}
          style={
            buttonColor !== 0
              ? { borderColor: "#8A8A8A" }
              : { borderColor: "#E4B717", color: "#E4B717" }
          }
        >
          Maxsulotlar
        </button>
        <button
          style={
            buttonColor !== 1
              ? { borderColor: "#8A8A8A" }
              : { borderColor: "#E4B717", color: "#E4B717" }
          }
          onClick={() => {
            setButtonColor(1);
          }}
        >
          Zavodlar
        </button>
      </div>
    </div>
  )
}

export default HeaderTabs