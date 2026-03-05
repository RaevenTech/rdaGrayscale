/*!
* Start Bootstrap - Grayscale v7.0.6 (https://startbootstrap.com/theme/grayscale)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-grayscale/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Update copyright date
    const updateCopyrightDate = function () {
        const copyDateElements = document.querySelectorAll('.copy-date');
        const currentYear = new Date().getFullYear();
        copyDateElements.forEach(function (element) {
            element.textContent = currentYear;
        });
    };

    // Update copyright date on page load
    updateCopyrightDate();

    const scrollToTopButton = document.querySelector('.scroll-to-top');
    if (scrollToTopButton) {
        const toggleScrollToTop = () => {
            if (window.scrollY > 200) {
                scrollToTopButton.classList.add('scroll-to-top--visible');
            } else {
                scrollToTopButton.classList.remove('scroll-to-top--visible');
            }
        };

        toggleScrollToTop();
        document.addEventListener('scroll', toggleScrollToTop);

        scrollToTopButton.addEventListener('click', () => {
            setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 200);
        });
    }

    // Formspree modal/contact form submission (AJAX)
    const formspreeForms = document.querySelectorAll('form.contact-form[action^="https://formspree.io/"]');
    formspreeForms.forEach((form) => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
            const statusEl =
                form.querySelector('[data-form-status]') ||
                form.querySelector('#status');

            const setStatus = (message, isError = false) => {
                if (!statusEl) return;
                statusEl.textContent = message;
                statusEl.classList.toggle('text-danger', isError);
                statusEl.classList.toggle('text-success', !isError);
            };

            if (submitButton) submitButton.disabled = true;
            setStatus('Sending...');

            try {
                const response = await fetch(form.action, {
                    method: form.method || 'POST',
                    body: new FormData(form),
                    headers: { Accept: 'application/json' }
                });

                if (response.ok) {
                    setStatus('Thanks — your message has been sent.');
                    form.reset();

                    const modalEl = form.closest('.modal');
                    if (modalEl && window.bootstrap?.Modal) {
                        const instance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                        setTimeout(() => instance.hide(), 600);
                    }
                } else {
                    let errorMessage = 'Something went wrong. Please try again.';
                    try {
                        const data = await response.json();
                        if (data?.errors?.length) {
                            errorMessage = data.errors.map((err) => err.message).join(' ');
                        }
                    } catch (_) {
                        // ignore JSON parse errors
                    }
                    setStatus(errorMessage, true);
                }
            } catch (err) {
                setStatus('Network error. Please check your connection and try again.', true);
            } finally {
                if (submitButton) submitButton.disabled = false;
            }
        });
    });

});