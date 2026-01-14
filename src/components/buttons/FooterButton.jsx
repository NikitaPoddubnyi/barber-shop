import styles from "./Buttons.module.scss";
import { useScrollAnimation } from 'hooks/useScrollAnimation';

const FooterButton = () => {
     const [rel, active] = useScrollAnimation(0.8);

    const phoneNumber = "+12345678900"; 
    const defaultMessage = "Привіт! Маю питання щодо послуг барбершопу.";

    const handleWhatsAppClick = () => {
        const message = encodeURIComponent(defaultMessage);
        const url = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(url, "_blank");
    };

    return (
        <button 
            className={` ${styles.FooterButton} ${active ? styles.active : ''}`}
            onClick={handleWhatsAppClick}
            ref={rel}
        >
            +12-345-678-89089
        </button>
    );
};

export default FooterButton;