"use strict";


// // SPOLLERS
const spollersArray = document.querySelectorAll('[data-spollers]');
if (spollersArray.length > 0) {
	// Получение обычных слойлеров
	const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
		return !item.dataset.spollers.split(",")[0];
	});
	// Инициализация обычных слойлеров
	if (spollersRegular.length > 0) {
		initSpollers(spollersRegular);
	}

	// Получение слойлеров с медиа запросами
	const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
		return item.dataset.spollers.split(",")[0];
	});

	// Инициализация слойлеров с медиа запросами
	if (spollersMedia.length > 0) {
		const breakpointsArray = [];
		spollersMedia.forEach(item => {
			const params = item.dataset.spollers;
			const breakpoint = {};
			const paramsArray = params.split(",");
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		});

		// Получаем уникальные брейкпоинты
		let mediaQueries = breakpointsArray.map(function (item) {
			return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
		});
		mediaQueries = mediaQueries.filter(function (item, index, self) {
			return self.indexOf(item) === index;
		});

		// Работаем с каждым брейкпоинтом
		mediaQueries.forEach(breakpoint => {
			const paramsArray = breakpoint.split(",");
			const mediaBreakpoint = paramsArray[1];
			const mediaType = paramsArray[2];
			const matchMedia = window.matchMedia(paramsArray[0]);

			// Объекты с нужными условиями
			const spollersArray = breakpointsArray.filter(function (item) {
				if (item.value === mediaBreakpoint && item.type === mediaType) {
					return true;
				}
			});
			// Событие
			matchMedia.addListener(function () {
				initSpollers(spollersArray, matchMedia);
			});
			initSpollers(spollersArray, matchMedia);
		});
	}
	// Инициализация
	function initSpollers(spollersArray, matchMedia = false) {
		spollersArray.forEach(spollersBlock => {
			spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
			if (matchMedia.matches || !matchMedia) {
				spollersBlock.classList.add('_init');
				initSpollerBody(spollersBlock);
				spollersBlock.addEventListener("click", setSpollerAction);
			} else {
				spollersBlock.classList.remove('_init');
				initSpollerBody(spollersBlock, false);
				spollersBlock.removeEventListener("click", setSpollerAction);
			}
		});
	}
	// Работа с контентом
	function initSpollerBody(spollersBlock, hideSpollerBody = true) {
		const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
		if (spollerTitles.length > 0) {
			spollerTitles.forEach(spollerTitle => {
				if (hideSpollerBody) {
					spollerTitle.removeAttribute('tabindex');
					if (!spollerTitle.classList.contains('_active')) {
						spollerTitle.nextElementSibling.hidden = true;
					}
				} else {
					spollerTitle.setAttribute('tabindex', '-1');
					spollerTitle.nextElementSibling.hidden = false;
				}
			});
		}
	}

	function setSpollerAction(e) {
		const el = e.target;
		if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
			const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
			const spollersBlock = spollerTitle.closest('[data-spollers]');
			const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
			if (!spollersBlock.querySelectorAll('._slide').length) {
				if (oneSpoller && !spollerTitle.classList.contains('_active')) {
					hideSpollersBody(spollersBlock);
				}
				spollerTitle.classList.toggle('_active');
				_slideToggle(spollerTitle.nextElementSibling, 500);
			}
			e.preventDefault();
		}
	}

	function hideSpollersBody(spollersBlock) {
		const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
		if (spollerActiveTitle) {
			spollerActiveTitle.classList.remove('_active');
			_slideUp(spollerActiveTitle.nextElementSibling, 500);
		}
	}
}
//========================================================================================================================================================
//SlideToggle
let _slideUp = (target, duration = 500) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = target.offsetHeight + 'px';
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = true;
			target.style.removeProperty('height');
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
}
let _slideDown = (target, duration = 500) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		if (target.hidden) {
			target.hidden = false;
		}
		let height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + 'ms';
		target.style.height = height + 'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout(() => {
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
}
let _slideToggle = (target, duration = 500) => {
	if (target.hidden) {
		return _slideDown(target, duration);
	} else {
		return _slideUp(target, duration);
	}
}


//TextSpollers
let textSpollers = document.querySelectorAll('.text-spoller');
if (textSpollers.length > 0) {
	for (let index = 0; index < textSpollers.length; index++) {
		const textSpoller = textSpollers[index];
		let textSpollerText = textSpoller.querySelector('.text-spoller__text');
		let textSpollerBtn = textSpoller.querySelector('.spoller-btn');
		let textSpollerHeight = 150;


		if (textSpollerText.offsetHeight < textSpollerHeight) {
			textSpollerText.classList.add('_open');
			textSpollerBtn.classList.add('_hidden');

		} else {
			textSpollerText.style.height = textSpollerHeight + 'px';
			textSpollerBtn.addEventListener('click', (e) => {
				e.preventDefault();

				if (!(textSpollerText.classList.contains('_open') && textSpollerBtn.classList.contains('_open'))) {
					textSpollerBtn.classList.add('_open');
					textSpollerText.classList.add('_open');
					textSpollerText.style.height = 'auto';
				} else {
					textSpollerBtn.classList.remove('_open');
					textSpollerText.classList.remove('_open');
					textSpollerText.style.height = textSpollerHeight + 'px';
				}

			})
		}

	}
}

if (document.querySelector('.products .products__body')) {
	new Swiper(".products .products__body", {		
		centeredSlides: false,
		grabCursor: true,
		slidesPerView: 1.3,
		spaceBetween: 20,
		keyboard: {
			enabled: true,
		},
		breakpoints: {

			480: {
				slidesPerView: 1.5,
				spaceBetween: 20,
			},


			640: {
				slidesPerView: 2.5,
				spaceBetween: 20,
			},
			1000: {
				slidesPerView: 3,
				spaceBetween: 20,
			},
			1255: {
				grabCursor: false,
				slidesPerView: 4,
				spaceBetween: 30,
			},

			1800: {
				grabCursor: false,
				slidesPerView: 4,
				spaceBetween: 50,
			},

		},

		// Navigation arrows
		navigation: {
			nextEl: '.products .slider-arrows__arrow--next',
			prevEl: '.products .slider-arrows__arrow--prev',
		},
		loop: false,
		autoplay: {
			delay: 2500,
			disableOnInteraction: false,
		},
	});
}

if (document.querySelector('.blog-slider .blog-slider__body')) {
	new Swiper(".blog-slider .blog-slider__body", {		
		centeredSlides: false,
		grabCursor: true,
		slidesPerView: 1.3,
		spaceBetween: 20,
		keyboard: {
			enabled: true,
		},
		breakpoints: {

			480: {
				slidesPerView: 1.5,
				spaceBetween: 20,
			},


			640: {
				slidesPerView: 2.1,
				spaceBetween: 20,
			},
			1000: {
				grabCursor: false,
				slidesPerView: 3,
				spaceBetween: 20,
			},
			1255: {
				grabCursor: false,
				slidesPerView: 3,
				spaceBetween: 30,
			},

			1800: {
				grabCursor: false,
				slidesPerView: 3,
				spaceBetween: 50,
			},

		},

		// Navigation arrows
		navigation: {
			nextEl: '.blog-slider .slider-arrows__arrow--next',
			prevEl: '.blog-slider .slider-arrows__arrow--prev',
		},
		loop: false,
		autoplay: {
			delay: 2500,
			// disableOnInteraction: false,
		},
	});
}

if (document.querySelector('.hero__slider')) {
	new Swiper(".hero__slider", {
		autoHeight: true,		
		centeredSlides: false,
		grabCursor: true,
		spaceBetween: 50,
		// effect: "fade",
		keyboard: {
			enabled: true,
		},
		breakpoints: {

		

		},

		pagination: {
			el: ".swiper-pagination",
			clickable: true,
		  },

		// Navigation arrows
		navigation: {
			nextEl: '.hero__slider .slider-arrows__arrow--next',
			prevEl: '.hero__slider .slider-arrows__arrow--prev',
		},
		loop: true,
		autoplay: {
			delay: 12500,
			disableOnInteraction: false,
		},
		

	});
}

if (document.querySelector('.blog-gallery')) {
	new Swiper(".blog-gallery", {
		autoHeight: true,		
		centeredSlides: false,
		grabCursor: true,
		spaceBetween: 50,
		// effect: "fade",
		keyboard: {
			enabled: true,
		},
		breakpoints: {

		

		},

		pagination: {
			el: ".swiper-pagination",
			type: "fraction",
		  },

		// Navigation arrows
		navigation: {
			nextEl: '.blog-gallery .slider-arrows__arrow--next',
			prevEl: '.blog-gallery .slider-arrows__arrow--prev',
		},
		loop: false,
		autoplay: {
			delay: 8500,
			disableOnInteraction: false,
		},
	});
}

if (document.querySelector('.tariffs__slider')) {
	new Swiper(".tariffs__slider", {		
		centeredSlides: false,
		grabCursor: true,
		slidesPerView: 1.3,
		spaceBetween: 20,
		keyboard: {
			enabled: true,
		},
		breakpoints: {

			480: {
				slidesPerView: 1.5,
				spaceBetween: 20,
			},


			640: {
				slidesPerView: 2.1,
				spaceBetween: 20,
			},
			1000: {
				grabCursor: false,
				slidesPerView: 3,
				spaceBetween: 20,
			},
			1255: {
				grabCursor: false,
				slidesPerView: 3,
				spaceBetween: 30,
			},

			1800: {
				grabCursor: true,
				slidesPerView: 3,
				spaceBetween: 50,
			},

		},

		// Navigation arrows

		loop: false,
		autoplay: {
			delay: 2500,
			disableOnInteraction: false,
		},
	});
}


// Start tabs.js
(function () {

	'use strict';

	var tabs = function (options) {

		var el = document.querySelector(options.el);
		var tabNavigationLinks = el.querySelectorAll(options.tabNavigationLinks);
		var tabContentContainers = el.querySelectorAll(options.tabContentContainers);
		var activeIndex = 0;
		var initCalled = false;

		var init = function () {
			if (!initCalled) {
				initCalled = true;
				// el.classList.remove('no-js');

				for (var i = 0; i < tabNavigationLinks.length; i++) {
					var link = tabNavigationLinks[i];
					handleClick(link, i);
				}
			}
		};

		/**
		 * handleClick
		 *
		 * @description Handles click event listeners on each of the links in the
		 *   tab navigation. Returns nothing.
		 * @param {HTMLElement} link The link to listen for events on
		 * @param {Number} index The index of that link
		 */
		var handleClick = function (link, index) {
			link.addEventListener('click', function (e) {
				e.preventDefault();
				goToTab(index);
			});
		};

		/**
		 * goToTab
		 *
		 * @description Goes to a specific tab based on index. Returns nothing.
		 * @param {Number} index The index of the tab to go to
		 */
		var goToTab = function (index) {
			if (index !== activeIndex && index >= 0 && index <= tabNavigationLinks.length) {
				tabNavigationLinks[activeIndex].classList.remove('_active');
				tabNavigationLinks[index].classList.add('_active');
				tabContentContainers[activeIndex].classList.remove('_active');
				tabContentContainers[index].classList.add('_active');
				activeIndex = index;
			}
		};

		/**
		 * Returns init and goToTab
		 */
		return {
			init: init,
			goToTab: goToTab
		};

	};

	/**
	 * Attach to global namespace
	 */
	window.tabs = tabs;

})();


if (document.querySelector('.tariffs')) {
	var productTabs = tabs({
		el: '.tariffs',
		tabNavigationLinks: '.tabs__nav-lnk',
		tabContentContainers: '.tabs__content'
	});

	productTabs.init();

}


const body = document.querySelector('body');
// const menuPopup = document.querySelector('.header__main-menu');
// const menuClose = document.querySelector('.header__btn-close');
const lockPadding = document.querySelectorAll('.lock-padding');
// let overlay = document.querySelector('.overlay');
let unlock = true;
const timeout = 700;

window.onload = function() {
	document.addEventListener('click', documentActions);
	
	function documentActions(e) {
		const targetElement = e.target;
		
		if ((targetElement.closest('.menu-burger'))) {
			document.querySelector('.header__main-menu').classList.add('_open');
			document.querySelector('.header__btn-close').classList.add('_active');
			document.querySelector('.header__actions').classList.add('_hidden');
			// overlay.classList.add('_active');
			bodyLock();
		} 
		else if  (targetElement.classList.contains('header__btn-close')) {
			document.querySelector('.header__main-menu').classList.remove('_open');
			document.querySelector('.header__btn-close').classList.remove('_active');
			document.querySelector('.header__actions').classList.remove('_hidden');
			// overlay.classList.remove('_active');
			bodyUnLock();
		}

		// else if (!targetElement.closest('.page-header__nav') 
		// && document.querySelector('.page-header__nav._active') 
		// || targetElement.classList.contains('nav__close')) {
		// 	document.querySelector('.page-header__nav').classList.remove('_active');
		// 	overlay.classList.remove('_active');
		// 	bodyUnLock();
		// }
 
	}

	// window.onresize = function () {
	// 	if ((document.querySelector('.header__main-menu'))) {
	// 		if (document.querySelector('.header__main-menu').classList.contains('_open')) {
	// 			document.querySelector('.header__main-menu').classList.remove('_open');
	// 			bodyUnLock();
	// 		}
	// 		if (document.querySelector('.header__btn-close').classList.contains('_active')) {
	// 			document.querySelector('.header__btn-close').classList.remove('_active');
	// 			bodyUnLock();
	// 		}

	// 		if (document.querySelector('.header__actions').classList.contains('_hidden')) {
	// 			document.querySelector('.header__actions').classList.remove('_hidden');
	// 			bodyUnLock();
	// 		}
	// 	}
	// }

	let onresize = function(e) {
		//note i need to pass the event as an argument to the function
		width = e.target.outerWidth;
		// height = e.target.outerHeight;
	 }
	 window.addEventListener("resize", function(){
		if ((document.querySelector('.header__main-menu'))) {
					if (document.querySelector('.header__main-menu').classList.contains('_open')) {
						document.querySelector('.header__main-menu').classList.remove('_open');
						bodyUnLock();
					}
					if (document.querySelector('.header__btn-close').classList.contains('_active')) {
						document.querySelector('.header__btn-close').classList.remove('_active');
						bodyUnLock();
					}
		
					if (document.querySelector('.header__actions').classList.contains('_hidden')) {
						document.querySelector('.header__actions').classList.remove('_hidden');
						bodyUnLock();
					}
				}
	 });

	
}

//////////////////////////////////////////////

function bodyLock() {
	const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

	if (lockPadding.length > 0) {
		for (let index = 0; index < lockPadding.length; index++) {
			const el = lockPadding[index];
			el.style.paddingRight = lockPaddingValue;
		}
	}

	body.style.paddingRight = lockPaddingValue;
	body.classList.add('_lock');

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}

function bodyUnLock() {
	setTimeout(function () {
		for (let index = 0; index < lockPadding.length; index++) {
			const el = lockPadding[index];
			el.style.paddingRight = '0px';
		}
		body.style.paddingRight = '0px';
		body.classList.remove('_lock');
	}, timeout);

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}


(function () {
	if (!Element.prototype.closest) {
		Element.prototype.closest = function (css) {
			var node = this;
			while (node) {
				if (node.matches(css)) return node;
				else node = node.parentElement;
			}
			return null;
		};
	}
})();

(function () {
	if (!Element.prototype.matches) {
		Element.prototype.matches = Element.prototype.webkitMatchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			Element.prototype.mozkitMatchesSelector ||
			Element.prototype.msMatchesSelector;

	}
})();


function findOffset(element) {
	var top = 0,
		left = 0;

	do {
		top += element.offsetTop || 0;
		left += element.offsetLeft || 0;
		element = element.offsetParent;
	} while (element);

	return {
		top: top,
		left: left
	};
}

function addEventListeners(element, eventNames, listener) {
	var events = eventNames.split(' ');
	for (var i = 0, iLen = events.length; i < iLen; i++) {
		element.addEventListener(events[i], listener, false);
	}
}

(function (w) {
	var loadJS = function (src, cb) {
		"use strict";
		var ref = w.document.getElementsByTagName("script")[0];
		var script = w.document.createElement("script");
		script.src = src;
		script.async = true;
		ref.parentNode.insertBefore(script, ref);
		if (cb && typeof (cb) === "function") {
			script.onload = cb;
		}
		return script;
	};
	// commonjs
	if (typeof module !== "undefined") {
		module.exports = loadJS;
	} else {
		w.loadJS = loadJS;
	}
}(typeof global !== "undefined" ? global : this));

// ===============================================
// 2 START IntersectionObserver
// ===============================================

/* W3C Intersection Observer Polyfill https://github.com/w3c/IntersectionObserver  */
(function (e, f) {
	function m(a) {
		this.time = a.time;
		this.target = a.target;
		this.rootBounds = a.rootBounds;
		this.boundingClientRect = a.boundingClientRect;
		this.intersectionRect = a.intersectionRect || l();
		this.isIntersecting = !!a.intersectionRect;
		a = this.boundingClientRect;
		a = a.width * a.height;
		var b = this.intersectionRect,
			b = b.width * b.height;
		this.intersectionRatio = a ? b / a : this.isIntersecting ? 1 : 0
	}

	function c(a, b) {
		b = b || {};
		if ("function" != typeof a) throw Error("callback must be a function");
		if (b.root && 1 != b.root.nodeType) throw Error("root must be an Element");
		this._checkForIntersections = u(this._checkForIntersections.bind(this), this.THROTTLE_TIMEOUT);
		this._callback = a;
		this._observationTargets = [];
		this._queuedEntries = [];
		this._rootMarginValues = this._parseRootMargin(b.rootMargin);
		this.thresholds = this._initThresholds(b.threshold);
		this.root = b.root || null;
		this.rootMargin = this._rootMarginValues.map(function (a) {
			return a.value + a.unit
		}).join(" ")
	}

	function u(a, b) {
		var d = null;
		return function () {
			d || (d = setTimeout(function () {
				a();
				d = null
			}, b))
		}
	}

	function q(a, b, d, c) {
		"function" ==
			typeof a.addEventListener ? a.addEventListener(b, d, c || !1) : "function" == typeof a.attachEvent && a
				.attachEvent("on" + b, d)
	}

	function r(a, b, d, c) {
		"function" == typeof a.removeEventListener ? a.removeEventListener(b, d, c || !1) : "function" == typeof a
			.detatchEvent && a.detatchEvent("on" + b, d)
	}

	function n(a) {
		try {
			var b = a.getBoundingClientRect()
		} catch (d) { }
		if (!b) return l();
		b.width && b.height || (b = {
			top: b.top,
			right: b.right,
			bottom: b.bottom,
			left: b.left,
			width: b.right - b.left,
			height: b.bottom - b.top
		});
		return b
	}

	function l() {
		return {
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
			width: 0,
			height: 0
		}
	}

	function t(a, b) {
		for (; b;) {
			if (b == a) return !0;
			b = p(b)
		}
		return !1
	}

	function p(a) {
		return (a = a.parentNode) && 11 == a.nodeType && a.host ? a.host : a
	}
	if ("IntersectionObserver" in e && "IntersectionObserverEntry" in e && "intersectionRatio" in e
		.IntersectionObserverEntry.prototype) "isIntersecting" in e.IntersectionObserverEntry.prototype || Object
			.defineProperty(e.IntersectionObserverEntry.prototype, "isIntersecting", {
				get: function () {
					return 0 < this.intersectionRatio
				}
			});
	else {
		var g = [];
		c.prototype.THROTTLE_TIMEOUT =
			100;
		c.prototype.POLL_INTERVAL = null;
		c.prototype.USE_MUTATION_OBSERVER = !0;
		c.prototype.observe = function (a) {
			if (!this._observationTargets.some(function (b) {
				return b.element == a
			})) {
				if (!a || 1 != a.nodeType) throw Error("target must be an Element");
				this._registerInstance();
				this._observationTargets.push({
					element: a,
					entry: null
				});
				this._monitorIntersections();
				this._checkForIntersections()
			}
		};
		c.prototype.unobserve = function (a) {
			this._observationTargets = this._observationTargets.filter(function (b) {
				return b.element != a
			});
			this._observationTargets.length ||
				(this._unmonitorIntersections(), this._unregisterInstance())
		};
		c.prototype.disconnect = function () {
			this._observationTargets = [];
			this._unmonitorIntersections();
			this._unregisterInstance()
		};
		c.prototype.takeRecords = function () {
			var a = this._queuedEntries.slice();
			this._queuedEntries = [];
			return a
		};
		c.prototype._initThresholds = function (a) {
			a = a || [0];
			Array.isArray(a) || (a = [a]);
			return a.sort().filter(function (a, d, c) {
				if ("number" != typeof a || isNaN(a) || 0 > a || 1 < a) throw Error(
					"threshold must be a number between 0 and 1 inclusively");
				return a !== c[d - 1]
			})
		};
		c.prototype._parseRootMargin = function (a) {
			a = (a || "0px").split(/\s+/).map(function (a) {
				a = /^(-?\d*\.?\d+)(px|%)$/.exec(a);
				if (!a) throw Error("rootMargin must be specified in pixels or percent");
				return {
					value: parseFloat(a[1]),
					unit: a[2]
				}
			});
			a[1] = a[1] || a[0];
			a[2] = a[2] || a[0];
			a[3] = a[3] || a[1];
			return a
		};
		c.prototype._monitorIntersections = function () {
			this._monitoringIntersections || (this._monitoringIntersections = !0, this.POLL_INTERVAL ? this
				._monitoringInterval = setInterval(this._checkForIntersections,
					this.POLL_INTERVAL) : (q(e, "resize", this._checkForIntersections, !0), q(f, "scroll", this
						._checkForIntersections, !0), this.USE_MUTATION_OBSERVER && "MutationObserver" in e && (this
							._domObserver = new MutationObserver(this._checkForIntersections), this._domObserver.observe(f, {
								attributes: !0,
								childList: !0,
								characterData: !0,
								subtree: !0
							}))))
		};
		c.prototype._unmonitorIntersections = function () {
			this._monitoringIntersections && (this._monitoringIntersections = !1, clearInterval(this
				._monitoringInterval), this._monitoringInterval = null,
				r(e, "resize", this._checkForIntersections, !0), r(f, "scroll", this._checkForIntersections, !0), this
					._domObserver && (this._domObserver.disconnect(), this._domObserver = null))
		};
		c.prototype._checkForIntersections = function () {
			var a = this._rootIsInDom(),
				b = a ? this._getRootRect() : l();
			this._observationTargets.forEach(function (d) {
				var c = d.element,
					h = n(c),
					f = this._rootContainsTarget(c),
					k = d.entry,
					g = a && f && this._computeTargetAndRootIntersection(c, b);
				d = d.entry = new m({
					time: e.performance && performance.now && performance.now(),
					target: c,
					boundingClientRect: h,
					rootBounds: b,
					intersectionRect: g
				});
				k ? a && f ? this._hasCrossedThreshold(k, d) && this._queuedEntries.push(d) : k && k.isIntersecting &&
					this._queuedEntries.push(d) : this._queuedEntries.push(d)
			}, this);
			this._queuedEntries.length && this._callback(this.takeRecords(), this)
		};
		c.prototype._computeTargetAndRootIntersection = function (a, b) {
			if ("none" != e.getComputedStyle(a).display) {
				var d = n(a);
				a = p(a);
				for (var c = !1; !c;) {
					var h = null,
						g = 1 == a.nodeType ? e.getComputedStyle(a) : {};
					if ("none" == g.display) return;
					a == this.root ||
						a == f ? (c = !0, h = b) : a != f.body && a != f.documentElement && "visible" != g.overflow && (h = n(
							a));
					if (h) {
						var g = Math.max(h.top, d.top),
							k = Math.min(h.bottom, d.bottom),
							l = Math.max(h.left, d.left),
							d = Math.min(h.right, d.right),
							h = d - l,
							m = k - g,
							d = 0 <= h && 0 <= m && {
								top: g,
								bottom: k,
								left: l,
								right: d,
								width: h,
								height: m
							};
						if (!d) break
					}
					a = p(a)
				}
				return d
			}
		};
		c.prototype._getRootRect = function () {
			if (this.root) var a = n(this.root);
			else {
				a = f.documentElement;
				var b = f.body;
				a = {
					top: 0,
					left: 0,
					right: a.clientWidth || b.clientWidth,
					width: a.clientWidth || b.clientWidth,
					bottom: a.clientHeight ||
						b.clientHeight,
					height: a.clientHeight || b.clientHeight
				}
			}
			return this._expandRectByRootMargin(a)
		};
		c.prototype._expandRectByRootMargin = function (a) {
			var b = this._rootMarginValues.map(function (b, c) {
				return "px" == b.unit ? b.value : b.value * (c % 2 ? a.width : a.height) / 100
			}),
				b = {
					top: a.top - b[0],
					right: a.right + b[1],
					bottom: a.bottom + b[2],
					left: a.left - b[3]
				};
			b.width = b.right - b.left;
			b.height = b.bottom - b.top;
			return b
		};
		c.prototype._hasCrossedThreshold = function (a, b) {
			a = a && a.isIntersecting ? a.intersectionRatio || 0 : -1;
			b = b.isIntersecting ? b.intersectionRatio ||
				0 : -1;
			if (a !== b)
				for (var c = 0; c < this.thresholds.length; c++) {
					var e = this.thresholds[c];
					if (e == a || e == b || e < a !== e < b) return !0
				}
		};
		c.prototype._rootIsInDom = function () {
			return !this.root || t(f, this.root)
		};
		c.prototype._rootContainsTarget = function (a) {
			return t(this.root || f, a)
		};
		c.prototype._registerInstance = function () {
			0 > g.indexOf(this) && g.push(this)
		};
		c.prototype._unregisterInstance = function () {
			var a = g.indexOf(this); - 1 != a && g.splice(a, 1)
		};
		e.IntersectionObserver = c;
		e.IntersectionObserverEntry = m
	}
})(window, document);

//popup

const popupLinks = document.querySelectorAll('.popup-link');

if (popupLinks.length > 0) {
	for (let index = 0; index < popupLinks.length; index++) {
		const popupLink = popupLinks[index];
		popupLink.addEventListener("click", function (e) {
			const popupName = popupLink.getAttribute('href').replace('#', '');
			const curentPopup = document.getElementById(popupName);
			popupOpen(curentPopup);
			e.preventDefault();
		});
	}
}

const popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {
	for (let index = 0; index < popupCloseIcon.length; index++) {
		const el = popupCloseIcon[index];
		el.addEventListener('click', function (e) {
			popupClose(el.closest('.popup'));
			e.preventDefault();
		});
	}
}

function popupOpen(curentPopup) {
	if (curentPopup && unlock) {
		const popupActive = document.querySelector('popup._open');
		if (popupActive) {
			popupClose(popupActive, false);
		} else {
			bodyLock();
		}

		curentPopup.classList.add('_open');
	}
}


function popupClose(popupActive, doUnlock = true) {
	if (unlock) {
		popupActive.classList.remove('_open');
		// if (video) {
		// 	pauseButton.addEventListener("click", function () {
				// player.pauseVideo();
		// 	  });
		// }

		// navPopup.classList.remove('_open');
		// iconMenu.classList.remove('_active');

		if (doUnlock) {
			bodyUnLock();
		}
	}
}


document.addEventListener('keydown', function (e) {
	if (e.which === 27) {

		const popupActive = document.querySelector('.popup._open');
		if (popupActive) {
			popupClose(popupActive);
		}

	}
});

  // Tel
  window.addEventListener("DOMContentLoaded", function () {
	[].forEach.call(document.querySelectorAll('._tel'), function (input) {
		var keyCode;
		function mask(event) {
			event.keyCode && (keyCode = event.keyCode);
			var pos = this.selectionStart;
			if (pos < 3) event.preventDefault();
			var matrix = "+38 (0__) ___ __ __",
				i = 0,
				def = matrix.replace(/\D/g, ""),
				val = this.value.replace(/\D/g, ""),
				new_value = matrix.replace(/[_\d]/g, function (a) {
					return i < val.length ? val.charAt(i++) || def.charAt(i) : a
				});
			i = new_value.indexOf("_");
			if (i != -1) {
				i < 5 && (i = 3);
				new_value = new_value.slice(0, i)
			}
			var reg = matrix.substr(0, this.value.length).replace(/_+/g,
				function (a) {
					return "\\d{1," + a.length + "}"
				}).replace(/[+()]/g, "\\$&");
			reg = new RegExp("^" + reg + "$");
			if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
			if (event.type == "blur" && this.value.length < 5) this.value = ""
		}

		input.addEventListener("input", mask, false);
		input.addEventListener("focus", mask, false);
		input.addEventListener("blur", mask, false);
		input.addEventListener("keydown", mask, false)

	});

});




// Scroll main Nav
const mainMenuLinks = document.querySelectorAll('.main-menu a[data-goto]');
const mainMenu = document.querySelector('.header__main-menu');
const headerActions = document.querySelector('.header__actions');
const mainMenuClose = document.querySelector('.header__btn-close');

if (mainMenuLinks.length > 0) {
	mainMenuLinks.forEach(mainMenuLink => {
		mainMenuLink.addEventListener("click", onMainMenuLinkClick);
	});

}

function onMainMenuLinkClick(e) {
	e.preventDefault();
	const mainMenuLink = e.target;
		if (mainMenuLink.dataset.goto && document.querySelector(mainMenuLink.dataset.goto)) {
		let gotoBlock = document.querySelector(mainMenuLink.dataset.goto);
		let gotoBlockValue = gotoBlock.getBoundingClientRect().top + scrollY;

		if (mainMenu.classList.contains('_open')) {
			mainMenu.classList.remove('_open');
			headerActions.classList.remove('_hidden');
			mainMenuClose.classList.remove('_active');
			bodyUnLock();

		}
		window.scrollTo({
			top: gotoBlockValue,
			behavior: "smooth"
		})
	}

}



// Donate from slider scroll
// const donateSliderLnk = document.querySelector('.donate-slider-lnk');

// if(donateSliderLnk) {
// 	donateSliderLnk.addEventListener("click", onDonateSliderLnkClick);
// }

// function onDonateSliderLnkClick(e) {
// 	let toBlock = document.querySelector('.donate');
// 	if (donateSliderLnk && toBlock) {
// 		let offsetTop = toBlock.getBoundingClientRect().top;
// 		let gotoBlockValue = offsetTop + scrollY;

// 		window.scrollTo({
// 			top: gotoBlockValue,
// 			behavior: "smooth"
// 		})
// 	}
// 	e.preventDefault();
// }

// Scroll Footer Nav
const footerMenuLinks = document.querySelectorAll('.footer-menu a[data-goto]');

if (footerMenuLinks.length > 0) {
	footerMenuLinks.forEach(footerMenuLink => {
		footerMenuLink.addEventListener("click", onFooterMenuLinkClick);
	});

}

function onFooterMenuLinkClick(e) {
	e.preventDefault();
	const footerMenuLink = e.target;
		if (footerMenuLink.dataset.goto && document.querySelector(footerMenuLink.dataset.goto)) {
		let gotoBlock = document.querySelector(footerMenuLink.dataset.goto);
		let gotoBlockValue = gotoBlock.getBoundingClientRect().top + scrollY;

		window.scrollTo({
			top: gotoBlockValue,
			behavior: "smooth"
		})
	}

}


// SCroll bottom
const bottomBtn = document.querySelector('.title-block__bottom-link');

if(bottomBtn) {
	bottomBtn.addEventListener("click", onBottomBtnClick);
}

function onBottomBtnClick(e) {
	let toBlock = document.querySelector('.business-features');
	if (bottomBtn && toBlock) {
		let offsetTop = toBlock.getBoundingClientRect().top;
		let gotoBlockValue = offsetTop + scrollY;

		window.scrollTo({
			top: gotoBlockValue,
			behavior: "smooth"
		})
	}
	e.preventDefault();
}



//msg popup
const modals = document.querySelectorAll('.msg-popup');

function openModal(modalId) {
	const modal = document.getElementById(modalId);

	if (modal && !modal.classList.contains('_active')) {
		closeAllModals();
		modal.classList.add('_active');
		setTimeout(() => {
			closeModal(modal);
		}, 6000);
	}
}

function closeModal(modal) {
	modal.classList.remove('_active');
}

function closeAllModals() {
	modals.forEach((modal) => {
		modal.classList.remove('_active');
	});
}



// Приклад виклику функції для відкриття вспливаючого вікна 1
// openModal('popup');




