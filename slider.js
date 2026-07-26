class Slider {
    constructor(selector) {
        this.container = typeof selector === 'string' ? document.querySelector(selector) : selector;
        this.track = this.container.querySelector('.slider-track');
        this.originalSlides = Array.from(this.track.children);
        this.realCount = this.originalSlides.length;
        this.dotsContainer = this.container.querySelector('.slider-dots');
        this.prevBtn = this.container.querySelector('.slider-btn.prev');
        this.nextBtn = this.container.querySelector('.slider-btn.next');

        this.currentIndex = 1;
        this.isTransitioning = false;

        this.init();
    }

    init() {
        if (this.realCount === 0) return;
        this.setupClones();
        this.createDots();
        this.bindEvents();
        this.updatePosition(false);
        this.updateDots();
    }

    // extra slide on each end so the loop has somewhere to slide into
    setupClones() {
        const firstClone = this.originalSlides[0].cloneNode(true);
        const lastClone = this.originalSlides[this.realCount - 1].cloneNode(true);

        this.track.appendChild(firstClone);
        this.track.insertBefore(lastClone, this.originalSlides[0]);
    }

    createDots() {
        this.dotsContainer.innerHTML = '';
        this.dots = this.originalSlides.map((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'dot';
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => this.goToRealIndex(index));
            this.dotsContainer.appendChild(dot);
            return dot;
        });
    }

    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        this.track.addEventListener('transitionend', (e) => this.handleTransitionEnd(e));
    }

    next() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.currentIndex++;
        this.updatePosition(true);
        this.updateDots();
    }

    prev() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.currentIndex--;
        this.updatePosition(true);
        this.updateDots();
    }

    goToRealIndex(realIndex) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.currentIndex = realIndex + 1;
        this.updatePosition(true);
        this.updateDots();
    }

    // % instead of px avoids offsetWidth rounding issues
    updatePosition(animated = true) {
        this.track.style.transition = animated ? 'transform 0.4s ease-in-out' : 'none';
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    }

    updateDots() {
        const realIndex = (this.currentIndex - 1 + this.realCount) % this.realCount;
        this.dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === realIndex);
        });
    }

    // land on a clone -> jump back to the real slide with no transition, so it's invisible
    handleTransitionEnd(e) {
        if (e.target !== this.track) return;

        if (this.currentIndex === 0) {
            this.currentIndex = this.realCount;
            this.updatePosition(false);
        } else if (this.currentIndex === this.realCount + 1) {
            this.currentIndex = 1;
            this.updatePosition(false);
        }

        this.isTransitioning = false;
    }
}