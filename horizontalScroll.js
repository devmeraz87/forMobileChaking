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
        scale: 5,
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
          scale: 5,
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
  

// Marquee /?
const horizontalScrollMarqueeV = horizontalScrollMarquee("._gsap_marquee_3", {
	reversed: true,
	repeat: -1,
	ease: "power4.out"
})


// Horizontal loop 3
function horizontalScrollMarquee(items, config) {
	items = gsap.utils.toArray(items);
	config = config || {};
	let tl = gsap.timeline({repeat: config.repeat, paused: config.paused, defaults: {ease: "none"}, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)}),
		length = items.length,
		startX = items[0].offsetLeft,
		times = [],
		widths = [],
		xPercents = [],
		curIndex = 0,
		pixelsPerSecond = (config.speed || 1) * 200,
		snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
		totalWidth, curX, distanceToStart, distanceToLoop, item, i;
	gsap.set(items, { // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
		xPercent: (i, el) => {
			let w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
			xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / w * 100 + gsap.getProperty(el, "xPercent"));
			return xPercents[i];
		}
	});
	gsap.set(items, {x: 0});
	totalWidth = items[length-1].offsetLeft + xPercents[length-1] / 100 * widths[length-1] - startX + items[length-1].offsetWidth * gsap.getProperty(items[length-1], "scaleX") + (parseFloat(config.paddingRight) || 0);
	for (i = 0; i < length; i++) {
		item = items[i];
		curX = xPercents[i] / 100 * widths[i];
		distanceToStart = item.offsetLeft + curX - startX;
		distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
		tl.to(item, {xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond}, 0)
		  .fromTo(item, {xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)}, {xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false}, distanceToLoop / pixelsPerSecond)
		  .add("label" + i, distanceToStart / pixelsPerSecond);
		times[i] = distanceToStart / pixelsPerSecond;
	}
	function toIndex(index, vars) {
		vars = vars || {};
		(Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length); // always go in the shortest direction
		let newIndex = gsap.utils.wrap(0, length, index),
			time = times[newIndex];
		if (time > tl.time() !== index > curIndex) { // if we're wrapping the timeline's playhead, make the proper adjustments
			vars.modifiers = {time: gsap.utils.wrap(0, tl.duration())};
			time += tl.duration() * (index > curIndex ? 1 : -1);
		}
		curIndex = newIndex;
		vars.overwrite = true;
		return tl.tweenTo(time, vars);
	}
	tl.next = vars => toIndex(curIndex+1, vars);
	tl.previous = vars => toIndex(curIndex-1, vars);
	tl.current = () => curIndex;
	tl.toIndex = (index, vars) => toIndex(index, vars);
	tl.times = times;
  tl.progress(1, true).progress(0, true); // pre-render for performance
  if (config.reversed) {
    tl.vars.onReverseComplete();
    tl.reverse();
  }
	return tl;
}