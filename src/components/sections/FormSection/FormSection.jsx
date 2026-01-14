import styles from "./FormSection.module.scss";
import React, { useState, useEffect } from "react";
import { useScrollAnimation } from "hooks/useScrollAnimation";
import stylesError from "styles/Error.module.scss";

const API_BASE_URL = 'https://barbershop-3f2ae-default-rtdb.firebaseio.com'; 

const FormSection = () => {
    const [ref, active] = useScrollAnimation();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState({});
    const [formData, setFormData] = useState(() => {
        const storedFormData = sessionStorage.getItem('contactData');
        if (storedFormData) {
            return JSON.parse(storedFormData);
        } else {
            return {
                name: '',
                email: '',
                message: ''
            };
        }
    });

    useEffect(() => {
        sessionStorage.setItem('contactData', JSON.stringify(formData));
    }, [formData]);


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[A-Za-zА-Яа-яЄєЇїІіҐґ'’\s-]{3,30}$/;

    const handleChange = (e) => {
        const { name, value } = e.target;
        let errorMsg = '';

        if (value.trim() !== '') {
            switch (name) {
                case 'email':
                    if (!emailRegex.test(value)) {
                        errorMsg = 'Некоректний email';
                    }
                    break;
                case 'name':
                    if (!nameRegex.test(value)) {
                        errorMsg = "Некоректне ім'я (тільки букви, 3-30 символів)";
                    }
                    break;
                case 'message':
                    if (value.trim().length < 10) {
                        errorMsg = "Повідомлення має бути не менше 10 символів";
                    } else if (value.trim().length > 500) {
                        errorMsg = "Повідомлення має бути не більше 500 символів";
                    }
                    break;
                default:
                    break;
            }
        }

        setError(prev => ({
            ...prev,
            [name]: errorMsg
        }));

        setFormData(prev => ({
            ...prev,
            [name]: value,
            submittedAt: new Date().toISOString()
        }));
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = "Ім'я є обов'язковим";
            isValid = false;
        } else if (!nameRegex.test(formData.name.trim())) {
            newErrors.name = "Некоректне ім'я (тільки букви, 3-30 символів)";
            isValid = false;
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email є обов\'язковим';
            isValid = false;
        } else if (!emailRegex.test(formData.email.trim())) {
            newErrors.email = 'Некоректний email';
            isValid = false;
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Повідомлення є обов\'язковим';
            isValid = false;
        } else if (formData.message.trim().length < 10) {
            newErrors.message = "Повідомлення має бути не менше 10 символів";
            isValid = false;
        } else if (formData.message.trim().length > 500) {
            newErrors.message = "Повідомлення має бути не більше 500 символів";
            isValid = false;
        }

        setError(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);
        
        try {
            const response = await fetch(`${API_BASE_URL}/records.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setIsSuccess(true);
                
                setFormData({
                    name: '',
                    email: '',
                    message: '',
                });

                sessionStorage.removeItem('contactData');

                
                setTimeout(() => {
                    setIsSuccess(false);
                }, 3000);
            } else {
                throw new Error('Помилка відправки форми');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setError(prev => ({
                ...prev,
                submit: 'Помилка відправки. Спробуйте ще раз.'
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            message: ''
        });
        setError({});
        setIsSuccess(false);
    };

    return (
        <section className={styles.contactSection}>
            <div className={styles.contactCenter}>
                <div className={`${styles.contactContent} ${active ? styles.active : ''}`} ref={ref}>
                    <h2>Зв'язатись з нами</h2>
                    <p>
                        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio.
                        Quisque volutpat mattis eros. Nullam malesuada erat ut turpis.
                    </p>

                    <form className={styles.contactForm} onSubmit={handleSubmit} noValidate>
                        {isSuccess && (
                            <div className={styles.successMessage}>
                                Дякуємо! Ваше повідомлення відправлено.<br />
                                Ми зв'яжемося з вами найближчим часом.
                            </div>
                        )}
                        
                        <div className={styles.formGroup}>
                            <input 
                                type="text" 
                                name="name"
                                placeholder="Enter your Name" 
                                value={formData.name}
                                onChange={handleChange}
                                className={error.name ? stylesError.inputError : ''}
                            />
                            {error.name && <span className={stylesError.error}>{error.name}</span>}
                        </div>
                        
                        <div className={styles.formGroup}>
                            <input 
                                type="email" 
                                name="email"
                                placeholder="Enter a valid email address" 
                                value={formData.email}
                                onChange={handleChange}
                                className={error.email ? stylesError.inputError : ''}
                            />
                            {error.email && <span className={stylesError.error}>{error.email}</span>}
                        </div>
                        
                        <div className={styles.formGroup}>
                            <textarea 
                                name="message"
                                placeholder="Enter your message" 
                                value={formData.message}
                                onChange={handleChange}
                                className={error.message ? stylesError.inputError : ''}
                            />
                            {error.message && <span className={stylesError.error}>{error.message}</span>}
                        </div>
                        
                        {error.submit && (
                            <div className={stylesError.submitError}>{error.submit}</div>
                        )}
                        
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className={isLoading ? styles.buttonLoading : ''}
                        >
                            {isLoading ? (
                                <>
                                    <span className={styles.loader}></span>
                                    Відправка...
                                </>
                            ) : (
                                'Представити на розгляд'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default FormSection;