
gsap.registerPlugin(SplitText, ScrollTrigger);

let wrapper = document.querySelector(".Horizontal");
let text = document.querySelector(".Horizontal__text");
let split = SplitText.create(".Horizontal__text", { type: "chars, words" });

const scrollTween = gsap.to(text, {
  xPercent: -100,
  ease: "none",
  scrollTrigger: {
    trigger: wrapper,
    pin: true,
    end: "+=5000px",
    scrub: true
  }
});

split.chars.forEach((char) => {
  gsap.from(char, {
    yPercent: "random(-200, 200)",
    rotation: "random(-20, 20)",
    ease: "back.out(1.2)",
    scrollTrigger: {
      trigger: char,
      containerAnimation: scrollTween,
      start: "left 100%",
      end: "left 30%",
      scrub: 1
    }
  });
});
  