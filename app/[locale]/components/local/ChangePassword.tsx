import React, { useEffect, useState } from "react";
import styles from "@/styles/changePass.module.css";
import Image from "next/image";
import Link from "next/link";

interface ChangePass {
  setIsChangePassOpen: Function;
}

const ChanchePassword = ({ setIsChangePassOpen }: ChangePass) => {

  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  const [queue, setQueue] = useState<number | any>(0);

  const [timer, setTimer] = useState<number>(61);

  const dum = queue === 1.1

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((timer) => timer - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [dum]);

  return (
    <div className={styles.ChangePass}>
      <div
        className={styles.ChangeForm}
      >
        <button
          className={styles.exit}
          onClick={() => {
            setIsChangePassOpen(false);
          }}
        >
          <Image
            src={"/icons/close.svg"}
            alt="close auth icon"
            width={21}
            height={21}
          />
        </button>
        {!queue ? (
          <form action={"#"} autoComplete="off">
            <h1>Введите код отправленный на ваш телефон</h1>
            <div className={styles.ChangeInput}>
              <p>Код</p>
              <input type="text" maxLength={8} required autoComplete="false" />
            </div>
            <button
              className={styles.Changebutton}
              onClick={() => {
                queue === 1 ? setQueue(1.1) : setQueue(2.1);
              }}
            >
              Подтвердить
            </button>
          </form>
        ) : queue === 2.1 ? (
          <form action={"#"} autoComplete="off">
            <h1>Введите код отправленный на ваш телефон</h1>
            <div className={styles.ChangeInput}>
              <p>Код</p>
              <input
                type="password"
                maxLength={8}
                required
                autoComplete="false"
              />
            </div>
            <button
              className={styles.Changebutton}
              onClick={() => {
                setQueue(2.2);
              }}
            >
              Подтвердить
            </button>
          </form>
        ) : queue === 2.2 ? (
          <form action={"#"} autoComplete="off">
            <div className={styles.ChangeInput}>
              <p>Новый пароль</p>
              <input
                type="password"
                maxLength={8}
                required
                autoComplete="false"
              />
            </div>
            <div className={styles.ChangeInput}>
              <p>Подтвердите пароль</p>
              <input
                type="password"
                maxLength={8}
                required
                autoComplete="false"
              />
            </div>
            <Link href="/allCategoriy">
              <button className={styles.Changebutton}>Подтвердить</button>
            </Link>
          </form>
        ) : null}
        <button
          className={styles.Change}
          style={
            queue === 1.1 && timer === 0
              ? {
                color: "#f00",
              }
              : {
                color: "#888",
              }
          }
          onClick={() => {
            queue === 0
              ? setQueue(1)
              : queue === 1 || queue === 2
                ? setQueue(0)
                : queue === 1.1
                  ? setTimer(60)
                  : setQueue(1.1);
          }}
        >
          {queue === 0
            ? ""
            : queue === 2.2
              ? ""
              : `Запросить еще раз ( 0:${timer >= 0 ? timer : setTimer(0)} )`}
        </button>
      </div>
      <div
        onClick={() => {
          setIsChangePassOpen(false);
        }}
      />
    </div>
  );
};

export default ChanchePassword;
