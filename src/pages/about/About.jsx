import Nav from "components/nav";
import Footer  from "components/footer";
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HeaderParallax from "components/sections/HeaderAboutSection/HeaderParallax";
import styles from "styles/About.module.scss";
import { FlexAbout, TextSlider, BarbersSection, ServicesSection } from "components/sections";


const About = () => {
  return (
    <>
    <title>Про нас</title>

      <Nav />
    <main>
      <HeaderParallax />
      <FlexAbout />
      <TextSlider />
      <BarbersSection />
      <ServicesSection />
    </main>
      <Footer />
    </>
  );
};

export default About;
