import Slider from "react-slick";
import styles from "./TextSlider.module.scss";
import styleMain from "styles/About.module.scss";
import { useScrollAnimation } from "hooks/useScrollAnimation";

const slides = [
    {
        title: "2007",
        description: `Duis aute irure dolor  esse
         cillum dolore eu fugiat nulla pariatur. Excepteur sint ocaecat cupidatat not proident,
          sunt in culpa qui officia deserunt mollit anim id est Laborum.`,
    },
        {
        title: "2012",
        description: `Duis aute irure dolor esse
         cillum dolore eu fugiat nulla pariatur. Excepteur sint ocaecat cupidatat not proident,
          sunt in culpa qui officia deserunt mollit anim id est Laborum.`,
    },
        {
        title: "2016",
        description: `Duis aute irure dolor velit esse
         cillum dolore eu fugiat nulla pariatur. Excepteur sint ocaecat cupidatat not proident,
          sunt in culpa qui officia deserunt mollit anim id est Laborum.`,
    },
        {
        title: "2020",
        description: `Duis aute irure dolor velit esse
         cillum dolore eu fugiat nulla pariatur. Excepteur sint ocaecat cupidatat not proident,
          sunt in culpa qui officia deserunt mollit anim id est Laborum.`,
    },
        {
        title: "2024",
        description: `Duis aute irure dolor velit esse
         cillum dolore eu fugiat nulla pariatur. Excepteur sint ocaecat cupidatat not proident,
          sunt in culpa qui officia deserunt mollit anim id est Laborum.`,
    },
        {
        title: "2025",
        description: `Duis aute irure dolor velit esse
         cillum dolore eu fugiat nulla pariatur. Excepteur sint ocaecat cupidatat not proident,
          sunt in culpa qui officia deserunt mollit anim id est Laborum.`,
    },
]

const TextSlider = () => {
    const [ref1, active1] = useScrollAnimation(0.8);
    const [ref2, active2] = useScrollAnimation(0.9);
const settings = {
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
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className={styles.textSlider}>
    <div className={styleMain.center}>
        <h2 className={`${styles.title} ${active1 ? styles.active : ''}`} ref={ref1} >Наша історія</h2>
        <div className={styles.sliderContainer}>
      <Slider {...settings}>
        {slides.map((slide, id) => (
          <div key={id}  className={`${styles.slide} ${active2 ? styles.active : ''}`} ref={ref2}>
            <h3>{slide.title}</h3>
            <p>{slide.description}</p>
          </div>
        ))}
      </Slider>
        </div>
    </div>
    </section>
  );
};

export default TextSlider