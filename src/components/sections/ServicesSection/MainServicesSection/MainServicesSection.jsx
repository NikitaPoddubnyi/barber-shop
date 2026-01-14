import styles from "./MainServices.module.scss";
import styleMain from "styles/Main.module.scss";
import { useScrollAnimation } from "hooks/useScrollAnimation";
import {beard, serviceImg, cuts, shaving, child} from "assets";

const MainServicesSection = () => {
    const [ref7, active7] = useScrollAnimation(0.7);
    const [ref8, active8] = useScrollAnimation(0.7);
    const [ref9, active9] = useScrollAnimation(0.7);
    const [ref10, active10] = useScrollAnimation(0.9);
    return (
                <section className={styles.servicesSection}>
             <div className={styleMain.center}>
          <h2 ref={ref8} className={`${styles.servicesTitle} ${active8 ? styles.active : ""}`}>Послуги перукарні</h2>
         <p className= {`${styles.servicesDescription} ${active9 ? styles.active : ""}`} ref={ref9}>Дізнайтеся більше про наші послуги</p>
          <div className={styles.servicesGrid}>

            <div className={`${styles.serviceLeft} ${active7 ? styles.active : ""}`} ref={ref7}>
              <img src={serviceImg} alt="Крій бороди" loading="lazy"/>
            </div>

            <div className={`${styles.serviceRight}`}>

            <div className={`${styles.serviceCard} ${active10 ? styles.active : ""}`} ref={ref10}>
              <img src={cuts} alt="Ножиці" />
              <p className={styles.serviceName}>Стрижка</p>
            </div>

            <div className={`${styles.serviceCard} ${active10 ? styles.active : ""}`} ref={ref10}>
              <img src={shaving} alt="Гоління" />
              <p className={styles.serviceName}>Гоління</p>
            </div>
            <div className={`${styles.serviceCard} ${active10 ? styles.active : ""}`} ref={ref10}>
              <img src={beard} alt="Догляд за бородою" />
              <p className={styles.serviceName}>Догляд за бородою</p>
            </div>

            <div className={`${styles.serviceCard} ${active10 ? styles.active : ""}`} ref={ref10}>
              <img src={child} alt="Дитячі стрижки" />
              <p className={styles.serviceName}>Дитячі стрижки</p>
            </div>

          </div>
          </div>
          </div>
        </section>
    )
}

export default MainServicesSection