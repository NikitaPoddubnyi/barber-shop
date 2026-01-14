import Nav from "components/nav";
import Footer  from "components/footer";
import React, { useState, useEffect, useCallback, useRef } from "react";
import styles from "./Contacts.module.scss";
import { logo2, slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8 } from "assets";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FormSection } from "components/sections";
import { useScrollAnimation } from 'hooks/useScrollAnimation';

const Contacts = () => {
  const [ ref1, active1 ] = useScrollAnimation(0.7);
  const [ ref2, active2 ] = useScrollAnimation(0.7);
  const [ ref3, active3 ] = useScrollAnimation(0.7);
  const [ ref4, active4 ] = useScrollAnimation(0.7);

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 4,
    arrows: true,
    responsive: [
      {
        breakpoint: 1400,
        settings: { slidesToShow: 3,
                   slidesToScroll: 3
         }
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2,
                   slidesToScroll: 2
         }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1,
                   slidesToScroll: 1
         }
      }
    ]
  };
    return (
        <>
        <title>Контакти</title>
        <Nav/>
            <header className={styles.header}>
               <div className={styles.center}>
                <h1 ref={ref1} className={`${styles.title} ${active1 ? styles.active : ""}`}>Зв'язатись<br /> з нами</h1>
                </div>
            </header>
        <main className={styles.main}>

            <section className={styles.flexAbout}>
            <div className={styles.center}>
            <h2 className={`${styles.flexAbout__contentTitle} ${active2 ? styles.active : ""}`} ref={ref2}>Ласкаво просимо<br /> до кращої перукарні на<br /> Манхеттені</h2>
            <div className={styles.flexAboutFlex}>

            <div className={`${styles.flexAbout__img} ${active3 ? styles.active : ""}`} ref={ref3}>
                <img src={logo2} alt="serviceImg" />
            </div>

            <div className={`${styles.flexAbout__content} ${active4 ? styles.active : ""}`} ref={ref4}>
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
                <span>09:00 – 18:00</span>
              </div>
              <p className={styles.barberDescription}>
                <i>
                  * Комплексні перукарські послуги • Подарункові пакети • Унікальні засоби для догляду • Ялівець • Авторські коктейлі • Visa/MasterCard/Amex.
                </i>
              </p>
            </div>
            </div>
            <div className={styles.ContactsSlider}>
            <Slider {...settings}>
                {[slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8].map((img, i) => (
                <div key={i} className={styles.slide}>
                <img src={img} alt="service" />
          </div>
        ))}
      </Slider>
            </div>
            </div>
        </section>
        <FormSection/>
        </main>
        <Footer/>
        </>
        )
}

export default Contacts;