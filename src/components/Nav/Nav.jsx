import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import styles from "styles/Nav.module.scss";
import { logo } from "assets";
import NavButton from "components/buttons/NavButton";

const Nav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const isPagesActive = ['/services', '/admin'].includes(location.pathname);
  const submenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 821;
      setIsMobile(mobile);
      if (!mobile) {
        setSubmenuOpen(false); 
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSubmenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (submenuRef.current && !submenuRef.current.contains(event.target)) {
        if (!isMobile && submenuOpen) {
          setSubmenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [submenuOpen, isMobile]);

  const handlePagesClick = (e) => {
    e.preventDefault();
    setSubmenuOpen(!submenuOpen);
  };

  const closeAllMenus = () => {
    setMobileOpen(false);
    setSubmenuOpen(false);
  };

  const handleSubmenuItemClick = () => {
    closeAllMenus();
  };

  const handleServicesClick = (e) => {
    if (!isMobile) {
      e.preventDefault();
      setSubmenuOpen(!submenuOpen);
      navigate('/services');
    }
  };

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <Link to="/" onClick={closeAllMenus}>
            <img src={logo} alt="logo" />
          </Link>

          <button 
            className={styles.burger + (mobileOpen ? " " + styles.open : "")}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className={`${styles.menuWrapper} ${mobileOpen ? styles.open : ""}`}>
            <button 
              className={styles.closeBtn}
              onClick={closeAllMenus}
              aria-label="Close menu"
            >
              &times;
            </button>

            <ul className={styles.mainMenu}>
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? styles.active : undefined
                  }
                  onClick={closeAllMenus}
                >
                  HOME
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    isActive ? styles.active : undefined
                  }
                  onClick={closeAllMenus}
                >
                  ABOUT US
                </NavLink>
              </li>

              <li 
                ref={submenuRef}
                className={`${styles.hasSubmenu} ${isPagesActive ? styles.active : ''} ${submenuOpen ? styles.submenuOpen : ''}`}
                onMouseEnter={() => !isMobile && setSubmenuOpen(true)}
                onMouseLeave={() => !isMobile && setSubmenuOpen(false)}
              >
                {isMobile ? (
                  <NavLink
                    to="/services"
                    onClick={handlePagesClick}
                    className={({ isActive }) =>
                      isActive ? styles.active : undefined
                    }
                    end
                  >
                    SERVICES
                  </NavLink>
                ) : (
                  <NavLink
                    to="/services"
                    onClick={handleServicesClick}
                    className={({ isActive }) =>
                      isActive || submenuOpen ? styles.active : undefined
                    }
                    end
                  >
                    SERVICES
                  </NavLink>
                )}

                <ul className={`${styles.submenu} ${
                  isMobile ? (submenuOpen ? styles.mobileOpen : '') : 
                  (submenuOpen) ? styles.mobileOpen : ''
                }`}>
                  <li>
                   <NavLink 
                    to="/services"
                    className={({ isActive }) => 
                      `${styles.submenuItem} ${isActive ? styles.active : ""}`
                    }
                    onClick={handleSubmenuItemClick}
                  >
                    OUR SERVICES
                  </NavLink>
                  </li>
                  <li>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) => 
                      `${styles.submenuItem} ${isActive ? styles.active : ""}`
                    }
                    onClick={handleSubmenuItemClick}
                  >
                    ADMINISTRATION
                  </NavLink>
                  </li>
                </ul>
              </li>

              <li>
                <NavLink
                  to="/contacts"
                  className={({ isActive }) =>
                    isActive ? styles.active : undefined
                  }
                  onClick={closeAllMenus}
                >
                  CONTACT
                </NavLink>
              </li>
            </ul>

            <div className={styles.mobileButtonContainer}>
              <NavButton onClick={closeAllMenus} />

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
          </div>

          <div className={styles.desktopButton}>
            <NavButton />
            
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div 
          className={styles.menuOverlay}
          onClick={closeAllMenus}
        />
      )}
    </>
  );
};

export default Nav;