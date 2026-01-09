import styles from "styles/Main.module.scss";
import { useScrollAnimation } from "hooks/useScrollAnimation";

const prices = [
  {
    title: "Класична стрижка",
    desc: "Ідеальна стрижка — найкращий аксесуар для чоловіка.",
    price: "$34+",
  },
  {
    title: "Королівське гоління",
    desc: "Наше фірмове триетапне гоління",
    price: "$35+",
  },
  {
    title: "Спеціалізована чоловіча стрижка",
    desc: "Точний крій з деталями + оформлення шиї",
    price: "$34+",
  },
  {
    title: "Масажний шампунь",
    desc: "Розслаблюючий шампунь + масаж шкіри голови + гарячий рушник",
    price: "$12+",
  },
  {
    title: "Стрижка + Королівське гоління",
    desc: "Наші виняткові секрети спеціально для вас",
    price: "$60+",
  },
  {
    title: "Стрижка + Підрівнювання бороди",
    desc: "Борода чи гоління — ми створюємо різницю, що формує справжній стиль",
    price: "$65+",
  },
  {
    title: "Чоловіче фарбування",
    desc: "Покращіть свій зовнішній вигляд за допомогою послуги перманентного фарбування",
    price: "$55+",
  },
  {
    title: "Довга стрижка",
    desc: "Наша довга стрижка подібна до класичної",
    price: "$55+",
  },
];

export default function PricesSection() {
  const [titleRef, titleActive] = useScrollAnimation(0.7);
  
  return (
    <section className={styles.pricesSection}>
      <div className={styles.center}>
        <h2 
          className={`${styles.title} ${titleActive ? styles.active : ''}`} 
          ref={titleRef}
        >
          Наші ціни
        </h2>
        <div className={styles.pricesGrid}>
          {prices.map((item, index) => (
            <PriceItem key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}


function PriceItem ({item, index}) {
  const [ref, active] = useScrollAnimation(0.7);

  return (
    <div 
    className={`${styles.priceItem} ${active ? styles.active : ''}`} ref={ref}
    style={{animationDelay: `${index * 0.1}s`}}
    >
    <div className={styles.priceLeft}>
        <h3>{item.title}</h3>
        <p>{item.desc}</p>
      </div>
      <div className={styles.priceRight}>{item.price}</div>
    </div>
  );
}