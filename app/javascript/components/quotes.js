import Typed from 'typed.js';

const initQuotes = () => {
  const typValue = document.querySelector('#banner-typed-text');
  if (typValue) {
    new Typed('#banner-typed-text', {
      strings: ["OPERANTAR XLI"],
      typeSpeed: 200,
      loop: true
    });
  } else {
    new Typed('#banner-typed-text_old', {
      strings: ["OPERANTAR XL"],
      typeSpeed: 200,
      loop: true
    });
  }
}

export { initQuotes };
