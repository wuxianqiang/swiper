class Swiper {
  constructor(ele) {
    this.ele = document.querySelector(ele);
    this.list = this.ele.querySelectorAll(".swiper-slide");
    this.dots = this.ele.querySelectorAll(".swiper-pagination span");
    this.arrows = this.ele.querySelectorAll(".swiper-button span");
    this.imgList = this.ele.querySelectorAll("img");
    this.step = 0;
    this.timer = null;
    this.finished = true;
    this.initSwiper().autoPlay().mouseEvent().dotsEvent().arrowsEvent();
  }
  initSwiper() {
    this.imgList.forEach((item, index) => {
      item.style.display = "block";
      if (index === 0) {
        animate(item, {
          opacity: 1
        }, 300);
      }
    })
    return this;
  }
  autoPlay() {
    this.timer = setInterval(() => {
      if (this.finished) {
        this.finished = false;
        if (this.step === this.imgList.length - 1) {
          this.step = -1;
        }
        this.step++;
        this.paly()
      }
    }, 3000)
    return this;
  }
  paly() {
    this.list.forEach((item) => {
      item.style.zIndex = 0;
    })
    this.list[this.step].style.zIndex = 1;
    let img = this.imgList[this.step];
    animate(img, {
      opacity: 1
    }, 300, () => {
      this.imgList.forEach((item, index) => {
        if (index !== this.step) {
          item.style.opacity = 0;
          this.list[index].style.zIndex = 0;
        }
      })
      this.finished = true;
    })
    this.initDots();
    return this;
  }
  initDots() {
    this.dots.forEach((item, index) => {
      if (index !== this.step) {
        item.classList.remove("active")
      } else {
        item.classList.add("active")
      }
    })
    return this;
  }
  mouseEvent() {
    this.ele.onmouseenter = () => {
      clearInterval(this.timer)
    }
    this.ele.onmouseleave = () => {
      this.autoPlay()
    }
    return this;
  }
  dotsEvent() {
    this.dots.forEach((item, index) => {
      item.onclick = () => {
        if (this.finished) {
          this.finished = false;
          this.step = index;
          this.paly()
        }
      }
    })
    return this;
  }
  arrowsEvent() {
    this.arrows[0].onclick = () => {
      if (this.finished) {
        this.finished = false;
        if (this.step === 0) {
          this.step = this.imgList.length;
        }
        this.step--;
        this.paly();
      }
    };
    this.arrows[1].onclick = () => {
      if (this.finished) {
        this.finished = false;
        if (this.step === this.imgList.length - 1) {
          this.step = -1;
        }
        this.step++;
        this.paly()
      }
    }
    return this;
  }
}

function linear(t, b, c, d) {
  return c / d * t + b
}

function animate(element, target, duration, callback) {
  let change = {};
  let begin = {};
  for (let key in target) {
    begin[key] = getCss(element, key);
    change[key] = removeUnit(target[key]) - begin[key];
  }
  let time = 0;
  let timing = setInterval(() => {
    time += 20;
    if (time >= duration) {
      clearInterval(timing);
      for (let key in target) {
        setCss(element, key, target[key]);
      }
      callback && callback.call(element);
      return;
    }
    for (let key in target) {
      let current = linear(time, begin[key], change[key], duration);
      setCss(element, key, current);
    }
  }, 20)
}

function getCss(ele, attr) {
  let value = window.getComputedStyle(ele)[attr];
  return removeUnit(value);
}

function removeUnit(value) {
  let reg = /^[-+]?([1-9]\d+|\d)(\.\d+)?(px|pt|em|rem)$/;
  if (isNaN(value) && reg.test(value)) return parseFloat(value);
  if (isNaN(value)) return Number(value);
  return value
}

function setCss(ele, attr, val) {
  let reg = /^(width|height|top|bottom|left|right|(margin|padding)(Top|Left|Bottom|Right)?)$/;
  if (!isNaN(val) && reg.test(attr)) {
    ele.style[attr] = val + "px";
    return;
  }
  ele.style[attr] = val;
}