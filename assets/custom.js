// Lightweight, idle-initialized UI behaviors and lazy carousel setup
(function(){
    function onReady(fn){
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    function initTabs(){
        if (!window.jQuery) return; // these widgets expect jQuery styles/animations
        $(".tab_nav li:first-child").addClass("active");
        $(".tabcontent").hide();
        $(".tabcontent:first").show();
        $(".tab_nav li").off('click.customTabs').on('click.customTabs', function(){
            $(".tab_nav li").removeClass("active");
            $(this).addClass("active");
            $(".tabcontent").hide();
            var e = $(this).find("a").attr("href");
            $(e).fadeIn();
            return false;
        });
        $(".ques-heading").off('click.customFaq').on('click.customFaq', function(e){
            var t = $(this).closest(".questions__item_row").find(".ques-desc");
            $(this).closest(".question-body").find(".ques-desc").not(t).slideUp();
            if ($(this).hasClass("active")) $(this).removeClass("active"); else { $(".ques-heading.active").removeClass("active"); $(this).addClass("active"); }
            t.stop(false, true).slideToggle();
            e.preventDefault();
        });
        $('.tab-header-item').off('click.customTabHeader').on('click.customTabHeader', function(){
            $('.tab-header-item').each(function(){ $(this).removeClass('active'); });
            $(this).addClass('active');
            $('.tab-content-item').hide();
            var to_open = $(this).attr('tab_content');
            $(`[content="${to_open}"]`).show();
        });
        $('.tab-header-item-mob').off('click.customTabHeaderMob').on('click.customTabHeaderMob', function(){
            $(this).toggleClass('active');
            var to_open = $(this).attr('tab_content');
            $(`[content="${to_open}"]`).slideToggle();
        });
    }

    function hasSlick(){
        return !!(window.jQuery && $.fn && $.fn.slick);
    }

    function loadSlickAssets(callback){
        if (hasSlick()) { callback && callback(); return; }
        var slickCssHref = 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css';
        var slickJsSrc = 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js';
        // Avoid duplicate loads
        if (!document.querySelector('link[data-slick]')) {
            var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = slickCssHref; l.setAttribute('data-slick','1'); document.head.appendChild(l);
        }
        if (!document.querySelector('script[data-slick]')) {
            var s = document.createElement('script'); s.src = slickJsSrc; s.defer = true; s.setAttribute('data-slick','1');
            s.onload = function(){ callback && callback(); };
            document.head.appendChild(s);
        } else {
            // script already requested; poll until available
            var t = setInterval(function(){ if (hasSlick()) { clearInterval(t); callback && callback(); } }, 50);
        }
    }

    function initSlickCarousel($el, options){
        if (!$el || !$el.length || $el.data('slick-initialized')) return;
        var start = function(){
            if (!hasSlick()) return;
            $el.slick(options);
            $el.data('slick-initialized', true);
        };
        if (!hasSlick()) { loadSlickAssets(start); } else { start(); }
    }

    function observeAndInitCarousels(){
        if (!('IntersectionObserver' in window) || !window.jQuery) {
            // Fallback: initialize on load if present
            if (hasSlick()) {
                initSlickCarousel($('.reviews-carucel'), {
                    infinite: true, slidesToShow: 1, slidesToScroll: 1, arrows: false, dots: true, autoplay: true, autoplaySpeed: 10000
                });
                initSlickCarousel($('.logo-list-carucell'), {
                    infinite: true, slidesToShow: 5, slidesToScroll: 1, arrows: false, dots: false, autoplay: true, autoplaySpeed: 10000,
                    responsive: [{ breakpoint: 769, settings: { slidesToShow: 4, slidesToScroll: 1 } }]
                });
            }
            return;
        }

        var io = new IntersectionObserver(function(entries){
            entries.forEach(function(entry){
                if (!entry.isIntersecting) return;
                var target = entry.target;
                if (target.classList.contains('reviews-carucel')) {
                    initSlickCarousel($(target), { infinite: true, slidesToShow: 1, slidesToScroll: 1, arrows: false, dots: true, autoplay: true, autoplaySpeed: 10000 });
                } else if (target.classList.contains('logo-list-carucell')) {
                    initSlickCarousel($(target), { infinite: true, slidesToShow: 5, slidesToScroll: 1, arrows: false, dots: false, autoplay: true, autoplaySpeed: 10000, responsive: [{ breakpoint: 769, settings: { slidesToShow: 4, slidesToScroll: 1 } }] });
                }
                io.unobserve(target);
            });
        }, { rootMargin: '0px 0px 200px 0px' });

        document.querySelectorAll('.reviews-carucel, .logo-list-carucell').forEach(function(el){ io.observe(el); });
    }

    function start(){
        initTabs();
        observeAndInitCarousels();
    }

    if ('requestIdleCallback' in window) {
        requestIdleCallback(function(){ onReady(start); }, { timeout: 2000 });
    } else {
        window.addEventListener('load', function(){ onReady(start); });
    }
})();