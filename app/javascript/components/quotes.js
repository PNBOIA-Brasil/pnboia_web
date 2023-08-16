import Typed from 'typed.js';

const initQuotes = () => {
  const bannerTyped = document.getElementById("banner-typed-text");
  if (bannerTyped){
    new Typed('#banner-typed-text', {
      strings: ["PNBOIA"],
      typeSpeed: 200,
      loop: true
    });
  }
};

export { initQuotes };
