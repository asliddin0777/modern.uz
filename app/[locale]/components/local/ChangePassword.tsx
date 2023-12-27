import React, { useEffect, useState } from "react";
import styles from "@/styles/changePass.module.css";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

interface ChangePass {
  setIsChangePassOpen: Function;
  userInfo?: {
    userToken: string
  }
}

const ChanchePassword = ({ setIsChangePassOpen, userInfo }: ChangePass) => {

  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  const [queue, setQueue] = useState<number | any>(0);

  const [timer, setTimer] = useState<number>(61);
  const [pass, setPass] = useState<string>("")
  const [retry, setRetry] = useState<string>("")
  const dum = queue === 1.1

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((timer) => timer - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [dum]);

  const handleSubmit = (e: {
    preventDefault: Function
  }) => {
    e.preventDefault()
    if (pass === retry) {
      axios.put(`${process.env.NEXT_PUBLIC_API}/api/users/update`, {
        password: pass
      }, {
        headers: {
          Authorization: userInfo?.userToken
        }
      })
    }
    setIsChangePassOpen(false)
  }

  if (userInfo) {
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
            <form onSubmit={handleSubmit} action={"#"} autoComplete="off">
              <div className={styles.ChangeInput}>
                <p>Yangi parol</p>
                <input
                  type="password"
                  maxLength={8}
                  required
                  onChange={(text) => setPass(text.target.value)}
                  name="password"
                  autoComplete="false"
                />
              </div>
              <div className={styles.ChangeInput}>
                <p>Parolni tasdiqlang</p>
                <input
                  type="password"
                  maxLength={8}
                  required
                  onChange={(text) => setRetry(text.target.value)}
                  name="retry"
                  autoComplete="false"
                />
              </div>
              <button className={styles.Changebutton}>Tasdiqlash</button>
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
            // setIsChangePassOpen(false);
          }}
        />
      </div>
    );
  }

};

export default ChanchePassword;
