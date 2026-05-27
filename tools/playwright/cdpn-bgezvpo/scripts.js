
gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin);

const down = 'M0-0.3C0-0.3,464,156,1139,156S2278-0.3,2278-0.3V683H0V-0.3z';
const center = 'M0-0.3C0-0.3,464,0,1139,0s1139-0.3,1139-0.3V683H0V-0.3z';

ScrollTrigger.create({
  trigger: '.footer',
  start: 'top bottom',
  toggleActions: 'play pause resume reverse',
  onEnter: self => {
    const velocity = self.getVelocity();
    const variation = velocity / 10000;

    gsap.fromTo('#bouncy-path', {
      morphSVG: down
    }, {
      duration: 2, 
      morphSVG: center, 
      ease: `elastic.out(${1 + variation}, ${1 - variation})`, 
      overwrite: 'true'
    });
  }
});
  