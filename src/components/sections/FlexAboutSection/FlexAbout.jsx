import styles from "styles/FlexAbout.module.scss";
import React from "react";
import  {serviceImg} from "assets";
import styleMain from "styles/About.module.scss";
import { useScrollAnimation } from "hooks/useScrollAnimation";

const FlexAbout = () => {
  const [ref1, active1] = useScrollAnimation(0.8);
  const [ref2, active2] = useScrollAnimation(0.8);
  const [ref3, active3] = useScrollAnimation(0.8);
    return (
        <section className={styles.flexAbout}>
            <div className={styleMain.center}>
            <h2 className={`${styles.flexAbout__contentTitle} ${active1 ? styles.active : ""}`} ref={ref1}>Ласкаво просимо до кращої перукарні на Манхеттені</h2>
            <div className={styles.flexAboutFlex}>

            <div className={`${styles.flexAbout__img} ${active3 ? styles.active : ""}`} ref={ref2}>
                <img src={serviceImg} alt="serviceImg" />
            </div>

            <div className={`${styles.flexAbout__content} ${active2 ? styles.active : ""}`} ref={ref3}>
              <a href="tel:+901234563211" className={styles.phoneNumber}>
                +90 123 456 32 11
              </a>
              <h3>Години роботи</h3>
              <div className={styles.hours}>
                <b>ПН–ЧТ&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>{" "}
                <span>09:00 – 19:00</span>
              </div>
              <div className={styles.hours}>
                <b>СБ–ВС&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>{" "}
                <span>09:00 – 19:00</span>
              </div>
              <p className={styles.barberDescription}>
                <i>
                  * Комплексні перукарські послуги • Подарункові пакети • Унікальні засоби для догляду • Ялівець • Авторські коктейлі • Visa/MasterCard/Amex.
                </i>
              </p>
            </div>
            </div>

        </div>
        </section>
    )
}

export default FlexAbout