import React, { useMemo } from "react";
import Slider from "react-slick";
import styles from "./StoriesSlider.module.scss";
import { slide1, slide2, slide3, slide4, slide5, slide6 } from "assets";
import { useScrollAnimation } from "hooks/useScrollAnimation";

const slides = [
  {
    id: 1,
    img: slide1,
    title: "Я не просто перукар.",
    description: "Ut enim ad minim veniam",
  },
  {
    id: 2,
    img: slide2,
    title: "Кліпперс та ставлення",
    description: "Ut enim ad minim veniam",
  },
  {
    id: 3,
    img: slide3,
    title: "Стрижка з пристрастю",
    description: "Ut enim ad minim veniam",
  },
  {
    id: 4,
    img: slide4,
    title: "Перукар — художник",
    description: "Ut enim ad minim veniam",
  },
  {
    id: 5,
    img: slide5,
    title: "Хороший перукар не просто стриже волосся.",
    description: "Ut enim ad minim veniam",
  },
  {
    id: 6,
    img: slide6,
    title: "Успіх не є ключем до щастя",
    description: "Ut enim ad minim veniam",
  },
];

export default function StoriesSlider() {
  const [titleRef, titleActive] = useScrollAnimation(0.6);
  const [subtitleRef, subtitleActive] = useScrollAnimation(0.6);
  const [sliderRef, sliderActive] = useScrollAnimation(0.3);
  const [slideTitleRef, slideTitleActive] = useScrollAnimation(0.9);
  const [slideDescriptionRef, slideDescriptionActive] = useScrollAnimation(0.9);

 const settings = useMemo(() => ({
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false, 
        },
      },
    ],
  }), []);

  return (
    <section className={styles.storiesSection}>
      <h2
        ref={titleRef}
        className={`${styles.title} ${titleActive ? styles.active : ""}`}
      >
        Історії наших перукарень
      </h2>

      <p
        ref={subtitleRef}
        className={`${styles.subtitle} ${
          subtitleActive ? styles.active : "" 
        }`}
      >
        Справжня міра успіху — не те, що ти маєш, а те, що ти віддаєш.
      </p>

      <div
        ref={sliderRef}
        className={`${styles.sliderWrapper} ${
          sliderActive ? styles.active : ""
        }`}
      >
        <Slider {...settings} className={styles.slider}>
          {slides.map((slide) => (
            <div key={slide.id} className={styles.slide}>
              <div className={styles.imageWrapper}>
                <img src={slide.img} alt={slide.title} />
              </div>

              <div className={styles.caption}>
                <h4 ref={slideTitleRef} className={`${styles.slideTitle} ${slideTitleActive ? styles.active : ""} `}>{slide.title}</h4>
                <p ref={slideDescriptionRef} className={`${styles.slideDescription} ${slideDescriptionActive ? styles.active : ""}`}>{slide.description}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
