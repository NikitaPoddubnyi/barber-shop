import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from 'utils/AdminUtils';
import Nav from 'components/nav';
import Footer from 'components/footer';
import styles from 'styles/Modals.module.scss';
import { useBodyScrollLock } from 'hooks/useBodyScrollLock';

const AdminVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { admin, verifyAdmin } = useAdmin();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    
    const maxAttempts = 3;
    const lockDuration = 5 * 60;
    const timerRef = useRef(null);
    
    useBodyScrollLock(true);

    useEffect(() => {
        const savedAttempts = localStorage.getItem('admin_attempts');
        const lockTime = localStorage.getItem('admin_lock_time');
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (savedAttempts) {
            const parsedAttempts = parseInt(savedAttempts, 10);
            setAttempts(parsedAttempts);
            
            if (parsedAttempts >= maxAttempts && lockTime) {
                const elapsed = currentTime - parseInt(lockTime, 10);
                
                if (elapsed < lockDuration) {
                    setIsLocked(true);
                    setTimeLeft(lockDuration - elapsed);
                    startTimer(lockDuration - elapsed);
                } else {
                    resetAttempts();
                }
            }
        }
    }, []);

    const startTimer = (initialTime) => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        
        setTimeLeft(initialTime);
        setIsLocked(true);
        
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setIsLocked(false);
                    resetAttempts();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const resetAttempts = () => {
        setAttempts(0);
        setIsLocked(false);
        setTimeLeft(0);
        localStorage.removeItem('admin_attempts');
        localStorage.removeItem('admin_lock_time');
        
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const saveAttempts = (newAttempts) => {
        setAttempts(newAttempts);
        localStorage.setItem('admin_attempts', newAttempts.toString());
        
        if (newAttempts >= maxAttempts) {
            const lockTime = Math.floor(Date.now() / 1000);
            localStorage.setItem('admin_lock_time', lockTime.toString());
            setIsLocked(true);
            startTimer(lockDuration);
        }
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (admin) {
            const from = location.state?.from?.pathname || '/admin';
            if (from !== location.pathname) {
                navigate(from, { replace: true });
            }
        }
    }, [admin, navigate, location]);

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!password.trim()) {
            setError('Введіть пароль');
            return;
        }

        if (isLocked) {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            setError(`Спробуйте через ${minutes}:${seconds.toString().padStart(2, '0')}`);
            return;
        }

        if (attempts >= maxAttempts) {
            setError(`Досягнуто ліміт спроб (${maxAttempts}). Спробуйте пізніше.`);
            return;
        }

        setIsLoading(true);
        setError('');

        await new Promise(resolve => setTimeout(resolve, 500));

        if (password.toLowerCase() === 'umbrella') {
            verifyAdmin();
            resetAttempts(); 
            const from = location.state?.from?.pathname || '/admin';
            navigate(from, { replace: true });
        } else {
            const newAttempts = attempts + 1;
            saveAttempts(newAttempts);
            
            if (newAttempts >= maxAttempts) {
                setError(`Невірний пароль. Досягнуто ліміт спроб. Спробуйте через 5 хвилин.`);
            } else {
                const remainingAttempts = maxAttempts - newAttempts;
                setError(`Невірний пароль. Залишилось спроб: ${remainingAttempts}`);
            }
            setPassword('');
        }
        
        setIsLoading(false);
    };

    const handleCancel = () => {
        navigate('/');
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <>
            <title>Вхід до панелі адміністрування</title>
            <Nav />
            <main className={styles.mainContainer}>
                <div className={styles.modalContainer}>
                    <div className={styles.modalVerification}>
                        <h2 className={styles.modaVerifylTitle}>Вхід до адмін панелі</h2>
                        <p className={styles.modalSubtitle}>
                            Для доступу до панелі управління введіть пароль адміністратора
                        </p>
                        
                        <div className={styles.attemptsContainer}>
                            {attempts > 0 && !isLocked && (
                                <div className={styles.attemptsInfo}>
                                    <div className={styles.attemptsCounter}>
                                        Спроба {attempts} з {maxAttempts}
                                    </div>
                                </div>
                            )}
                            
                            {isLocked && (
                                <div className={styles.lockInfo}>
                                    <div className={styles.lockMessage}>
                                        <strong>Доступ тимчасово заблоковано</strong>
                                        <div className={styles.timer}>
                                            Час до розблокування: {formatTime(timeLeft)}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <form onSubmit={handleSubmit} className={styles.verificationForm}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="password" className={styles.inputLabel}>
                                    Пароль адміністратора
                                </label>
                                <div className={styles.passwordContainer}>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={handlePasswordChange}
                                        placeholder="Введіть пароль"
                                        className={`${styles.passwordInput} ${error ? styles.error : ''}`}
                                        autoFocus={!isLocked}
                                        disabled={isLoading || isLocked}
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        className={styles.showPasswordBtn}
                                        onClick={toggleShowPassword}
                                        disabled={isLoading || isLocked}
                                        aria-label={showPassword ? 'Приховати пароль' : 'Показати пароль'}
                                    >
                                        {showPassword ? 'Сховати' : 'Показати'}
                                    </button>
                                </div>
                                {error && (
                                    <div className={styles.errorMessage}>
                                        <span className={styles.errorIcon}>&#9888;</span>
                                        {error}
                                    </div>
                                )}
                            </div>
                            
                            <div className={styles.buttonGroup}>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className={styles.cancelVerifyButton}
                                    disabled={isLoading}
                                >
                                    Скасувати
                                </button>
                                <button 
                                    type="submit" 
                                    className={styles.submitButton}
                                    disabled={isLoading || isLocked}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className={styles.spinner}></span>
                                            Перевірка...
                                        </>
                                    ) : isLocked ? (
                                        'Заблоковано'
                                    ) : (
                                        'Увійти'
                                    )}
                                </button>
                            </div>
                        </form>
                        
                        <div className={styles.helpText}>
                            <p>Якщо ви забули пароль, зверніться до головного адміністратора.</p>
                            {attempts > 0 && (
                                <p className={styles.resetNote}>
                                    Спроби автоматично скинуться через 5 хвилин після останньої невдалої спроби.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default AdminVerification;