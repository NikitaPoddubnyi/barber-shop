import { useRef } from 'react';
import styles from "./MainServices.module.scss";
import styleMain from "styles/Main.module.scss";
import { useScrollAnimation } from "hooks/useScrollAnimation";
import {beard, serviceImg, cuts, shaving, child} from "assets";

const useStaggeredAnimation = (count, threshold = 0.9) => {
    const refs = [];
    const states = [];
    
    for (let i = 0; i < count; i++) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [ref, active] = useScrollAnimation(threshold + (i * 0.05));
        refs.push(ref);
        states.push(active);
    }
    
    return [refs, states];
};

const MainServicesSection = () => {
    const [ref7, active7] = useScrollAnimation(0.7);
    const [ref8, active8] = useScrollAnimation(0.7);
    const [ref9, active9] = useScrollAnimation(0.7);
    
    const [cardRefs, cardActives] = useStaggeredAnimation(4, 0.85);

    const services = [
        { img: cuts, name: "Стрижка", alt: "Ножиці" },
        { img: shaving, name: "Гоління", alt: "Гоління" },
        { img: beard, name: "Догляд за бородою", alt: "Догляд за бородою" },
        { img: child, name: "Дитячі стрижки", alt: "Дитячі стрижки" }
    ];

    return (
        <section className={styles.servicesSection}>
            <div className={styleMain.center}>
                <h2 ref={ref8} className={`${styles.servicesTitle} ${active8 ? styles.active : ""}`}>
                    Послуги перукарні
                </h2>
                <p className={`${styles.servicesDescription} ${active9 ? styles.active : ""}`} ref={ref9}>
                    Дізнайтеся більше про наші послуги
                </p>
                <div className={styles.servicesGrid}>

                    <div className={`${styles.serviceLeft} ${active7 ? styles.active : ""}`} ref={ref7}>
                        <img src={serviceImg} alt="Крій бороди" loading="lazy"/>
                    </div>

                    <div className={styles.serviceRight}>
                        {services.map((service, index) => (
                            <div 
                                key={index}
                                className={`${styles.serviceCard} ${cardActives[index] ? styles.active : ""}`} 
                                ref={cardRefs[index]}
                            >
                                <img src={service.img} alt={service.alt} />
                                <p className={styles.serviceName}>{service.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MainServicesSection;