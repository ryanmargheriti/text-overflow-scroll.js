(function($){
	// Apply styles to animate and text indent the text
	var applyActiveStyles = function(elToChange, textIndent, duration, easing) {
		elToChange.css({
			'transition': 'text-indent ' + duration + 'ms ' + easing,
			'text-indent': (-textIndent) + 'px'
		}).addClass('active');
	};

	// Reset/remove previously added styles
	var removeActiveStyles = function(elToChange, duration) {
		elToChange.css({
			'transition': (duration /3)  + 'ms',
			'text-indent': '0'
		}).removeClass('active');
	};

	var ScrollText = function(el, settings) {
		this.el = el;
		this.container = el.parent();
		this.settings = settings;
	};

	ScrollText.prototype = $.extend({
		getWidth: function() {
			var calcWidth = this.el.css('position','absolute').width();
			this.el.css('position','relative');
			return calcWidth;
		},
		// Get the width of the direct parent of the scrolling element
		getContainerWidth: function() {
			return this.container.width()
		},
		// Determine which element will receive the hover event
		getHoverTarget: function() {
			if(this.settings.hoverElement == 'parent') {
				return this.container;
			} else {
				return this.el;
			}
		},
		// Calculate how far the text needs to indent
		calculateTextIndent : function() {
			return this.getWidth() - this.getContainerWidth();
		},
		calculateDuration: function() {
			if(this.settings.speed == 'fast') {
				return this.el.text().length * 42;
			} else if (this.settings.speed == 'slow') {
				return this.el.text().length * 105;
			} else {
				return this.el.text().length * 68;
			}
		},
		attachClipEffect: function() {
			if(this.settings.clipTechnique == 'ellipsis') {
				this.el.append('<span class="autoscroll-clip-ellipsis">...</span>')
			} else if(this.settings.clipTechnique == 'fade') {
				this.el.addClass('autoscroll-clip-fade');
			}
		},
		// Attach the hover event
		attachEvent: function() {
			var that = this;
			this.getHoverTarget().hover(function() {
				applyActiveStyles(that.el, that.calculateTextIndent(), that.calculateDuration(), that.settings.easing);
				}, function() {
					removeActiveStyles(that.el, that.calculateDuration());
				});
		},
		// Roll Out!
		init: function() {
			if(this.getWidth() > this.getContainerWidth()) {
				this.attachClipEffect();
				this.attachEvent();
			}
		}
	});


	$.fn.scrollingText = function(options) {

		// Combine global settings and user settings
		var settings = $.extend({
			speed: 'medium',					// Speed in which you want the animation to run
			hoverElement: 'self',			// Element to hook the hover event to
			easing: 'ease-out',				// Easing function to use
			clipTechnique: 'fade',				// Technique to clip the end of the text
			complete: null						// Placeholder for callback
		}, options);

		return this.each(function() {
			var scrollText = new ScrollText($(this), settings);
			scrollText.init();
			$(this).data("scrollText", scrollText);

			//window.scrollText = scrollText;
		})

	}
}(jQuery));