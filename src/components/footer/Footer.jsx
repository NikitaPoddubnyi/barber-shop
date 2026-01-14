import {logo2, call} from 'assets';
import styles from './Footer.module.scss';
import { FooterButton } from 'components/buttons';


const Footer = () => {
    return (
        <footer className={styles.footer}>
        <div className={styles.center}>
          <div className={styles.footerGrid}>

            <div className={styles.footerFlex}>
            <img className={styles.footerLogo} src={logo2} alt="logo" />
          <p className={styles.footerTextItem1}>​Full service barber shops & men’s grooming in Manhattan, New York.</p>
          <p className={styles.footerTextTime}>
            MON-THU
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <b>08:00 – 19:00</b></p>
          <p className={styles.footerTextTime}>SAT-SUN
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <b>08:00 – 18:00</b></p>
            </div>

          <div className={styles.footerFlex}>
            <h4 className={styles.footerTitle}>Location</h4>
            <p className={styles.footerText}>
             ​17 Green St, New York,
            <br />NY 10002, USA
            </p>
            <br />
          <a
          className={styles.footerLink}
          href="mailto:support@barbershop.com"
          >
          support@barbershop.com
          </a>
          <a
          className={styles.footerLink}
          href="tel:+100123456789"
          >
          +100 123 456 78 90
          </a>

            <div className={styles.socialMedia}>
              <a href="https://facebook.com" target='_blank'><img
                className={styles.socialMediaIcon}
                src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/facebook.svg"
                alt="Facebook"
             />  </a>
             <a href='https://instagram.com' target='_blank'><img
                className={styles.socialMediaIcon}
                src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/instagram.svg"
                alt="Instagram"
              /> </a>
              <a href="https://twitter.com/?lang=ru" target='_blank'><img
                className={styles.socialMediaIcon}
                src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/x.svg"
                alt="Twitter"
              /></a>
            </div>
            </div>

          <div className={styles.footerFlex}>
            <img
            className={styles.footerIcon}
            src={call}
            alt="Дзвінок"
          />
            <h4 className={styles.footerTitle}>Questiongs?</h4>
            <p className={styles.footerText}>
            ​Add us on WhatsApp & send queries for instant reply.​
            </p>
            <FooterButton />
            </div>
         </div>
       </div>
        </footer>
    );
};

export default Footer;