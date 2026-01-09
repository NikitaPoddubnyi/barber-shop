import { useEffect } from "react";

export const useBodyScrollLock = (isLocked) => {
    useEffect(() => {
      if (isLocked) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.classList.add('modal-open');
            
            return () => {
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.classList.remove('modal-open');
                window.scrollTo(0, scrollY);
            };
        }
    }, [isLocked]);
};

