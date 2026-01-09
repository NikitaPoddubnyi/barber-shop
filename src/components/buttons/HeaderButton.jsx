import styles from "styles/Buttons.module.scss";
import { useScrollAnimation } from 'hooks/useScrollAnimation';

const HeaderButton = () => {
    const [ref, active] = useScrollAnimation(0.7);

    const phoneNumber = "+380123456789"; 

    return (
        <>
            <a
                ref={ref}
                href={`tel:${phoneNumber}`}
                className={`${styles.HeaderButton} ${active ? styles.active : ''}`}
            >
                ЗАМОВИТИ ДЗВІНОК
            </a>
        </>
    );
};

export default HeaderButton;