window.addEventListener("load", function () {
  gsap.registerPlugin(ScrollTrigger);

  const pageContainer = document.querySelector(".smoothScrollingWrapper");
  pageContainer.setAttribute("data-scroll-container", "");

  const scroller = new LocomotiveScroll({
    el: pageContainer,
    inertia: 0.8,
    smooth: true,
    getDirection: true 
  });
  
  scroller.on("scroll", function (t) {
    document.documentElement.setAttribute("data-direction", t.direction);
  });
  
  scroller.on("scroll", ScrollTrigger.update);
  
  ScrollTrigger.scrollerProxy(pageContainer, {
    scrollTop(value) {
      return arguments.length ?
      scroller.scrollTo(value, 0, 0) :
      scroller.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight };

    },

     pinType: pageContainer.style.transform ? "transform" : "fixed" });
  
      
    // Pinning and horizontal scrolling
    let horizontalSection = document.querySelector(".horizontal-scroll");
     let pinWrap = horizontalSection.querySelector(".pin-wrap");
     let pinWrapWidth = pinWrap.offsetWidth;
     let horizontalScrollLength = pinWrapWidth - window.innerWidth;
     let scrollTween = gsap.to(pinWrap, {
        scrollTrigger: {
          scroller: "[data-scroll-container]",
          scrub: true,
          trigger: horizontalSection,
          pin: true,
          start: "top top",
          end: () => `+=${pinWrapWidth}`,
          invalidateOnRefresh: true 
        },
        x: -horizontalScrollLength,
        ease: "none" 
      });


      //  _First figure
      gsap.to("._figure", {
        xPercent: 100,
        scale: 2,
        duration: 2,
        ease: "none",
        scrollTrigger: {
          trigger: "._figure_2",
          containerAnimation: scrollTween,
          delay: 3,
          scrub: true
        }
      });

      setTimeout(() => {
        //  _First figure
        gsap.to("._figure", {
          xPercent: -110,
          scale: 2,
          duration: 2,
          ease: "none",
          scrollTrigger: {
            trigger: "._figure_2",
            containerAnimation: scrollTween,
            delay: 3,
            scrub: true
          }
        });
      }, 3000);

      // >> Scalse figure inner // >> impossible to scale up figure form so in do inner
      gsap.to("._figure_inner", {
        duration: 2,
        scrollTrigger: {
          scroller: "[data-scroll-container]",
          trigger: "._figure",
          start: "top bottom", 
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true 
        },
        scale: 1,
        ease: "none",
        y: 0
      })

    // });
  
    /* COLOR CHANGER */
  
    const scrollColorElems = document.querySelectorAll("[data-bgcolor]");
    scrollColorElems.forEach((colorSection, i) => {
      const prevBg = i === 0 ? "" : scrollColorElems[i - 1].dataset.bgcolor;
      const prevText = i === 0 ? "" : scrollColorElems[i - 1].dataset.textcolor;
  
      ScrollTrigger.create({
        trigger: colorSection,
        scroller: "[data-scroll-container]",
        start: "top 50%",
        onEnter: () =>
        gsap.to("body", {
          backgroundColor: colorSection.dataset.bgcolor,
          color: colorSection.dataset.textcolor,
          overwrite: "auto" }),
  
        onLeaveBack: () =>
        gsap.to("body", {
          backgroundColor: prevBg,
          color: prevText,
          overwrite: "auto" }) });
  
  
    });


    
    // ScrollTrigger.addEventListener("refresh", () => { 
    //   scroller.update()
    // });
  
    // ScrollTrigger.refresh();
  });
  
