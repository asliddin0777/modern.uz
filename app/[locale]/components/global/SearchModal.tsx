import IProduct from '@/interfaces/Product/IProduct'
import React, { useEffect, useState } from 'react'
import styles from "@/styles/head.module.css"
import Link from "next/link"
import Image from "next/image"
interface ISearch {
    products: IProduct[]
    entity?: string
    setProducts: React.Dispatch<React.SetStateAction<IProduct[]>> | undefined
    searchTerm: string
    mt: boolean
}

const SearchModal = ({ products, entity, setProducts, searchTerm, mt }: ISearch) => {
    const [scrolled, setScrolled] = useState(false);

    // useEffect(()=> {
    //     if(mt === true && products.length) {
    //         document.body.style.overflow = "hidden"
    //     } else {
    //         document.body.style.overflow = ""
    //     }
    // }, [mt])

    return (
        <div style={mt === true ? {
            marginTop: -10
        }: {}} className={entity === "burger" ? styles.searchModalbur : products.length === 0 ? styles.dn : styles.searchModal}>
            <div className={styles.wrapper}>
                {products.map(pro => {
                    return <Link key={pro.id} href={`/product/${pro.name}?id=${pro.id}`} className={styles.product}>
                        <div className={styles.leftSide}>
                            <Image src={pro.media.length ? `${process.env.NEXT_PUBLIC_IMAGE_API}/${pro.media[0].name}` : "/images/no-image.png"} className={pro.media.length ? "" : styles.noImg} width={300} height={300} alt={pro.name} />
                        </div>
                        <div className={styles.rightSide}>
                            <h3>{pro.name}</h3>
                            <button>Посмотреть больше</button>
                        </div>
                    </Link>
                })}
            </div>
        </div>
    )
}

export default SearchModal