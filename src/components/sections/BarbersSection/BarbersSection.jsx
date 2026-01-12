
import React from 'react';
import styles from 'styles/BarbersSection.module.scss';
import styleMain from "styles/About.module.scss";
import { barber1, barber2, barber3, barber4, barber5, barber6 } from 'assets';
import { useScrollAnimation } from 'hooks/useScrollAnimation';

const barbers = [
  {
    name: "Фред Моррісон",
    role: "Власник",
    img: barber1, 
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      linkedin: "https://linkedin.com/?lang=ru"
    }
  },
  {
    name: "Адріан Сколд",
    role: "Перукар/стиліст",
    img: barber2,
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      linkedin: "https://linkedin.com/?lang=ru"
    }
  },
    {
    name: "Елмер Бріггс",
    role: "Перукар/стиліст",
    img: barber3,
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      linkedin: "https://linkedin.com/?lang=ru"
    }
  },
    {
    name: "Джеймс Олівер",
    role: "Перукар/стиліст",
    img: barber4,
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      linkedin: "https://linkedin.com/?lang=ru"
    }
  },
    {
    name: "Уолтер Ліллі",
    role: "Перукар/стиліст",
    img: barber5,
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      linkedin: "https://linkedin.com/?lang=ru"
    }
  },
    {
    name: "Алекс Грін",
    role: "Перукар/стиліст",
    img: barber6,
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      linkedin: "https://linkedin.com/?lang=ru"
    }
  },
];

const BarberCard = ({ barber }) => {
  const [ref1, active1] = useScrollAnimation(1.3);
  const [ref2, active2] = useScrollAnimation(1);
  
  return (
    <div className={`${styles.barberCard} ${active1 ? styles.active : ''}`} ref={ref1}>
      <img src={barber.img} alt={barber.name} className={`${styles.barberPhoto} ${active2 ? styles.active : ""}`}  ref={ref2}/>
      <span className={styles.role}>{barber.role}</span>
      <h3 className={styles.name}>{barber.name}</h3>
      <div className={styles.socialMedia}>
        <a href={barber.socials.facebook} target="_blank" rel="noreferrer">
          <img
            className={styles.socialMediaIcon}
            src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/facebook.svg"
            alt="Facebook"
          />
        </a>
        <a href={barber.socials.instagram} target="_blank" rel="noreferrer">
          <img
            className={styles.socialMediaIcon}
            src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/instagram.svg"
            alt="Instagram"
          />
        </a>
        <a href={barber.socials.linkedin} target="_blank" rel="noreferrer">
          <img
            className={styles.socialMediaIcon}
            src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linkedin.svg"
            alt="Linkedin"
          />
        </a>
      </div>
    </div>
  );
};

const BarbersSection = () => {
  const [ref1, active1] = useScrollAnimation(0.7);
  const [ref2, active2] = useScrollAnimation(0.7);

  return (
    <section className={styles.barbersSection}>
      <div className={styleMain.center}>
        <h4 className={`${styles.subtitle} ${active1 ? styles.active : ''}`} ref={ref1}>
          Ми зробимо вам дивовижну зачіску
        </h4>
        <h2 className={`${styles.title} ${active2 ? styles.active : ''}`} ref={ref2}>
          Супер професійні перукарі
        </h2>
        <div className={styles.barbersGrid}>
          {barbers.map((barber, index) => (
            <BarberCard key={index} barber={barber} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BarbersSection;