import Nav from "components/nav";
import Footer  from "components/footer";
import React, { useState, useEffect, useCallback, useRef } from "react";
import styles from "styles/Main.module.scss";
import { HeaderButton, PreFooterButton } from "components/buttons";
import { cutsBarber, hipsterBurber, logo2, sliderImg1, sliderImg2, sliderImg3, call } from "assets";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useScrollAnimation } from 'hooks/useScrollAnimation';
import { StoriesSlider, DiscountSection, PricesSection, AboutSection, MainServicesSection } from "components/sections";


const Main = () => {
   const [ref1, active1] = useScrollAnimation(0.7);
  const [ref2, active2] = useScrollAnimation(0.7);
  const [ref3, active3] = useScrollAnimation(0.7);
  const [ref4, active4] = useScrollAnimation(0.7);
  const [ref5, active5] = useScrollAnimation(0.7);
  const [ref6, active6] = useScrollAnimation(0.7);
  const [ref7, active7] = useScrollAnimation(0.7);

  const images = [
    {
   img: sliderImg1,
   description: 'Перукарня «Манхетен»', 
  },
     {
   img: sliderImg2,
   description: 'Перукарня «Манхетен»', 
  },
   {
   img: sliderImg3,
   description: 'Перукарня «Манхетен»', 
  }
];

  return (
    <>
    <title>Перукарня «Манхетен»</title>
      <Nav />
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 ref={ref7} className={`${styles.headerTitle} ${active7 ? styles.active : ""}`}>Перукарня «Манхетен»</h1>
          <p
            ref={ref1}
            className={`${styles.headerDescription} ${active1 ? styles.active : ""}`}
          >
            Ваше задоволення - наш пріоритет.<br /> Забронюйте запис на сьогодні!
          </p>
          <HeaderButton />
        </div>
      </header>


      <main className={styles.main}>
        <section className={styles.workHoursSection}>
          <div className={styles.center}>
          <h2
            ref={ref2}
            className={`${styles.workHoursTitle} ${active2 ? styles.active : ""}`}
          >
            Ласкаво просимо до кращої перукарні на Манхеттені
          </h2>
          <div className={styles.barberGrid}>
            <div 
            ref={ref3}
            className={`${styles.barberCard} ${styles.img1} ${active3 ? styles.active : ""} `}>
              <img src={hipsterBurber} alt="Стайліст" />
            </div>
            <div
            ref={ref4}
             className={`${styles.barberCard} ${styles.img2} ${active4 ? styles.active : ""}`}>
              <img src={cutsBarber} alt="Крій бороди" />
            </div>

            <div
            ref={ref5} className={`${styles.logoBlock} ${active5 ? styles.active : ""}`}>
              <img src={logo2} alt="Логотип перукарні Манхетен" />
            </div>

            <div className={`${styles.barberWorkHours} ${active6 ? styles.active : ""}`} ref={ref6}>
              <a href="tel:+901234563211" className={styles.phoneNumber}>
                +90 123 456 32 11
              </a>
              <h3>Години роботи</h3>
              <div className={styles.hours}>
                <b>ПН–ЧТ&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>{" "}
                <span>09:00 – 19:00</span>
              </div>
              <div className={styles.hours}>
                <b>СБ–ВС&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>{" "}
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

        <AboutSection />

        <section className={styles.sliderSection}>
          <Slider
            className={styles.slider}
            dots={true}
            infinite={true}
            speed={500}
            slidesToShow={1}
            slidesToScroll={1}
            autoplay={true}
            autoplaySpeed={3000}
            arrows={true}
          >

            {images.map((image, index) => (
              <div key={index}>
                <img src={image.img} alt={image.description} />
              </div>
            ))}
          </Slider>
        </section>

        <MainServicesSection />

          <PricesSection />

          <DiscountSection />

            <StoriesSlider></StoriesSlider>

        <section className={styles.preFooterSection}>
          <div className={styles.center}>
          <div className={styles.preFooterGrid}>

            <div className={styles.preFooterFlex}>
          <h4 className={styles.preFooterTitle}>Робочі години</h4>
          <p className={styles.preFooterText}>ПН–ПТ: <b>08:00 – 19:00</b></p>
          <p className={styles.preFooterText}>Субота: <b>08:00 – 18:00</b></p>
          <p className={styles.preFooterText}>Неділя: <b>08:00 – 17:00</b></p>
            </div>

          <div className={styles.preFooterFlex}>
            <h4 className={styles.preFooterTitle}>Місцезнаходження</h4>
            <p className={styles.preFooterText}>
              17 Грін Стрит, Нью-Йорк,<br /> NY 10002, США
            </p>
            <br />
          <a
          className={styles.preFooterLink}
          href="mailto:support@barbershop.com"
          >
          support@barbershop.com
          </a>
          <a
          className={styles.preFooterLink}
          href="tel:+100123456789"
          >
          +100 123 456 78 90
          </a>
            </div>

          <div className={styles.preFooterFlex}>
            <img
            className={styles.preFooterIcon}
            src={call}
            alt="Дзвінок"
          />
            <h4 className={styles.preFooterTitle}>Питання</h4>
            <p className={styles.preFooterText}>
            Додайте нас до WhatsApp і надсилайте запити для миттєвої відповіді.
            </p>
            <PreFooterButton />
            </div>
         </div>
       </div>
      </section>

      </main>

      <Footer /> 
    </>
  );
};

export default Main;
