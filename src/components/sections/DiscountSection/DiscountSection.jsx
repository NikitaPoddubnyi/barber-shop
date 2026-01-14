import styles from "./DiscountSection.module.scss";
// import styleMain from "styles/Main.module.scss";
import { useScrollAnimation } from "hooks/useScrollAnimation";
import DiscountButton from "components/buttons/DiscountButton";

const DiscountSection = () => {

    const [ref11, active11] = useScrollAnimation(0.8);
    const [ref12, active12] = useScrollAnimation(0.8);

    return (
          <section className={styles.discountSection}>
            <div className={styles.sectionContent}>
              <div className={styles.discountLineOne}>
              <h1
                ref={ref11}
                className={`${styles.discountTitle} ${active11 ? styles.active : ""}`}
              >
                ЗНИ<br />ЖКА<br /> 15%
              </h1>             
              </div>
              <div className={styles.discountLineTwo}>
              <h2 className={`${styles.discountDescription} ${active12 ? styles.active : ""}`} ref={ref12}>НА ВАШОМУ<br /> ПЕРШОМУ <br />ПРИЙОМІ</h2>
              <DiscountButton/>
              </div>
              </div>
            </section>
    )
}

export default DiscountSection