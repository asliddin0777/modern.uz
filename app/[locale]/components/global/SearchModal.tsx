import IProduct from '@/interfaces/Product/IProduct'
import React, { useEffect, useState } from 'react'
import styles from "@/styles/head.module.css"
import Link from "next/link"
import Image from "next/image"
interface ISearch {
    products: IProduct[]
    entity?: string
}

const SearchModal = ({ products, entity }: ISearch) => {
    const [scrolled, setScrolled] = useState(false);
    const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 0) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (
        <div className={entity === "burger" ? styles.searchModalbur: products.length === 0 || scrolled === true ? styles.dn : styles.searchModal}>
            <div className={styles.wrapper}>
                {products.map(pro => {
                    return <Link key={pro.id} href={`/product/${pro.name}?id=${pro.id}`} className={styles.product}>
                        <div className={styles.leftSide}>
                            <Image src={pro.media.length ? `${process.env.NEXT_PUBLIC_IMAGE_API}/${pro.media[0].name}` : "/images/no-image.png"} width={300} height={300} alt={pro.name} />
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