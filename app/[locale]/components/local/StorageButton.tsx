import React from 'react'
import styles from "@/styles/detail.module.css"
import { uuid as uuidv4 } from "uuidv4"
import IFormatedProps from '@/interfaces/IFormatedProps'
interface IProps {
    e: {
        id: string,
        value: string
    },
    index: number,
    setSelectedMemory: React.Dispatch<React.SetStateAction<string>>,
    selectedMemory: string,
    setControllerM: React.Dispatch<React.SetStateAction<number>>
}
const StorageButton = ({ e, index, setSelectedMemory, selectedMemory, setControllerM }: IProps) => {
    return (
        <button
            type="button"
            key={uuidv4()}
            className={
                selectedMemory === e.value
                    ? styles.memoryd
                    : styles.memory
            }
            onClick={() => {
                setControllerM(index);
                if (e.value === selectedMemory) {
                    setSelectedMemory("");
                } else {
                    setSelectedMemory(e.value);
                }
            }}
        >
            {e.value}
        </button>
    )
}

export default StorageButton