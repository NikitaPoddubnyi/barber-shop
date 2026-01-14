import React, {useState} from "react";
import styles from "./ServicesSection.module.scss";
import styleMain from "styles/About.module.scss";
import {beardImg, shaveImg, colorImg, cutImg} from "assets";
import { useScrollAnimation } from "hooks/useScrollAnimation";

const tabs = [
  {
    id: "beard",
    title: "BEARD AND MUSTACHE TRIM",
    image: beardImg,
    textBold: "Master the art of facial hair grooming with our precision trimming services. Our barbers sculpt and shape your beard and mustache to perfection, ensuring clean lines and balanced proportions that complement your facial structure.",
    text: "Using premium oils and specialized tools, we provide detailed grooming that transforms your facial hair into a statement of style. Whether you prefer a classic look or modern design, our expertise delivers impeccable results every time.",
  },
  {
    id: "shave",
    title: "ROYAL SHAVE",
    image: shaveImg,
    textBold: "Experience traditional luxury with our signature Royal Shave service—a timeless ritual of relaxation and precision craftsmanship that leaves your skin smooth and revitalized.",
    text: "We begin with warm towels to open pores, followed by premium shaving creams and a straight razor technique perfected over generations. The treatment concludes with soothing aftershave balms and cooling treatments for ultimate skin comfort.",
  },
  {
    id: "color",
    title: "HAIR COLORING",
    image: colorImg,
    textBold: "Transform your appearance with professional hair coloring that enhances your natural features while covering grays or creating vibrant new dimensions.",
    text: "Our color specialists use premium, ammonia-free products to achieve rich, lasting color with natural-looking results. From subtle highlights to complete transformations, we ensure healthy, radiant hair with customized color solutions.",
  },
  {
    id: "cuts",
    title: "CUTS AND FADES",
    image: cutImg,
    textBold: "Precision haircutting techniques that define modern masculinity—from classic styles to contemporary fades executed with unmatched skill.",
    text: "Each cut is tailored to your hair type, face shape, and personal style. Our barbers master both traditional and trending techniques, creating sharp fades, clean lines, and balanced proportions that maintain their shape between visits.",
  },
];

const ServicesSection = () => {
    const [ref, active] = useScrollAnimation();
    const [activeTab, setActiveTab] = useState('shave');

    const current = tabs.find((tab) => tab.id === activeTab)

    return(
        <section className={styles.tabsSection}>
            <div className={styleMain.center}>
                <h2 className={`${styles.title} ${active ? styles.active1 : ''}`} ref={ref}>Ми надаємо послуги преміум-класу</h2>
                  <div className={styles.tabs}>
                    {tabs.map(tab => (
                      <button
                      key={tab.id}
                      className={`${styles.tabBtn} ${
                      activeTab === tab.id ? styles.active : ""
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                      >
                      {tab.title}
                      </button>
                    ))}
                  </div>

                    <div className={styles.content}>
                    <img src={current.image} alt={current.title} />
                    <p><b>{current.textBold}</b></p>
                    <p>{current.text}</p>
                    </div>
            </div>
            </section>
    )
}

export default ServicesSection