import styles from './HeaderParallax.module.scss';
import HeaderButtonAbout from "components/buttons/HeaderButtonAbout";
import { useScrollAnimation } from 'hooks/useScrollAnimation';

const HeaderParallax = () => {
  const [ref1, active1] = useScrollAnimation(0.8);
  const [ref2, active2] = useScrollAnimation(0.8);
  return (
    <header className={styles.header}>
      <div className={styles.overlay}></div>

      <div className={styles.center}>
        <h1 ref={ref1} className={`${styles.title} ${active1 ? styles.active : ""}`}>ПРО НАС</h1>
        <p className={`${styles.description} ${active2 ? styles.active : ""}`} ref={ref2}>
          Ми розвиваємо нашу пристрасть до перукарського 
          мистецтва через нашу відданість нашим клієнтам.
        </p>
        <HeaderButtonAbout />
      </div>
    </header>
  );
};

export default HeaderParallax;
