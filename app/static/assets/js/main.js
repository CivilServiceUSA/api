(function (e) {
  e.fn.notifyMe = function (t) {
    var form = e(this);

    var name = form.find('input[name=NAME]');
    var email = form.find('input[name=EMAIL]');
    var app_name = form.find('input[name=APP_NAME]');
    var app_type = form.find('select[name=APP_TYPE]');
    var app_purp = form.find('textarea[name=APP_PURP]');
    var app_desc = form.find('textarea[name=APP_DESC]');
    var app_url = form.find('textarea[name=APP_URL]');

    var action = form.attr('action');
    var method = form.attr('method');
    var note = form.find('.note');

    var message = $('.message');
    var block = $('.block-message');

    // Reset and hide all messages on .keyup()
    $("#signup-form input, #signup-form textarea").keyup(function () {
      block.addClass("").removeClass("show-block-valid show-block-error");
      message.fadeOut();
    });

    $("#signup-form select").change(function () {
      block.addClass("").removeClass("show-block-valid show-block-error");
      message.fadeOut();
    });

    form.on("submit", function (t) {
      console.log('data', e(this).serialize());

      var valid = true;
      var error_message = '';

      t.preventDefault();
      var h = email.val();
      var valid_email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (name.val() === '') {
        valid = false;
        error_message = 'Developer Name cannot be blank.<br>Please check it and try again.';
        name.focus();
      } else if ( !valid_email.test(email.val())) {
        valid = false;
        error_message = 'Developer Email Address is Invalid.<br>Please check it and try again.';
        email.focus();
      } else if (app_name.val() === '') {
        valid = false;
        error_message = 'Application Name cannot be blank.<br>Please check it and try again.';
        app_name.focus();
      } else if (app_type.val() === '') {
        valid = false;
        error_message = 'Application Type cannot be blank.<br>Please check it and try again.';
        app_type.focus();
      } else if (app_purp.val() === '') {
        valid = false;
        error_message = 'Application Purpose cannot be blank.<br>Please check it and try again.';
        app_purp.focus();
      } else if (app_desc.val() === '') {
        valid = false;
        error_message = 'Application Description cannot be blank.<br>Please check it and try again.';
        app_desc.focus();
      } else if (app_url.val() === '') {
        valid = false;
        error_message = 'Application URL Whitelist cannot be blank.<br>Please check it and try again.';
        app_url.focus();
      }

      if (valid) {
        message.removeClass("error bad-email success-full");
        message.hide().html('').fadeIn();
        note.show();

        console.log('data', e(this).serialize());

        e.ajax({
          type: method,
          url: action,
          data: e(this).serialize(),
          cache: false,
          dataType: 'json',
          contentType: "application/json; charset=utf-8",
          error: function(err) {
            note.hide();
            block.addClass("show-block-error").removeClass("show-block-valid");
            if (e.status == 404) {
              message.html('<p class="notify-valid">Service is not available at the moment.<br>Please check your internet connection or try again later.</p>').fadeIn();
            } else {
              message.html('<p class="notify-valid">Oops. Looks like something went wrong.<br>Please try again later.</p>').fadeIn();
            }
            trackEvent('Subscribe', 'AJAX Error', JSON.stringify(err));
          },
          success: function(data) {
            note.hide();
            if (data.result !== 'success') {
              message.addClass("bad-email").removeClass("success-full");
              block.addClass("show-block-error").removeClass("show-block-valid");
              message.html('<p class="notify-valid">' + data.msg + '</p>').fadeIn();

              if(data.msg.indexOf('is already subscribed') > -1){
                trackEvent('Subscribe', 'MailChimp Notice', 'Email Already Subscribed');
              } else {
                trackEvent('Subscribe', 'MailChimp Error', data.msg);
              }
            } else {
              form.trigger( 'reset' );

              message.removeClass("bad-email").addClass("success-full");
              block.addClass("show-block-valid").removeClass("show-block-error");
              message.html('<p class="notify-valid">Woo Hoo! We\'ll enabled your API Key within <br>24 hours of confirming your email address.</p>').fadeIn();

              trackEvent('Subscribe', 'MailChimp Success', 'User Subscribed');
            }
          }
        });
      } else {
        message.addClass("bad-email").removeClass("success-full");
        block.addClass("show-block-error").removeClass("show-block-valid");
        message.html('<p class="notify-valid">' + error_message + '</p>').fadeIn();
        note.hide();
      }
    })
  }

})(jQuery);

function trackEvent(category, action, label, value){
  if(typeof ga !== 'undefined'){
    ga('send', 'event', category, action, label, value);
  }

  console.log('send', 'event', category, action, label, value);
}

(function() {

  "use strict";

  // Methods/polyfills.

  // classList | (c) @remy | github.com/remy/polyfills | rem.mit-license.org
  !function(){function t(t){this.el=t;for(var n=t.className.replace(/^\s+|\s+$/g,"").split(/\s+/),i=0;i<n.length;i++)e.call(this,n[i])}function n(t,n,i){Object.defineProperty?Object.defineProperty(t,n,{get:i}):t.__defineGetter__(n,i)}if(!("undefined"==typeof window.Element||"classList"in document.documentElement)){var i=Array.prototype,e=i.push,s=i.splice,o=i.join;t.prototype={add:function(t){this.contains(t)||(e.call(this,t),this.el.className=this.toString())},contains:function(t){return-1!=this.el.className.indexOf(t)},item:function(t){return this[t]||null},remove:function(t){if(this.contains(t)){for(var n=0;n<this.length&&this[n]!=t;n++);s.call(this,n,1),this.el.className=this.toString()}},toString:function(){return o.call(this," ")},toggle:function(t){return this.contains(t)?this.remove(t):this.add(t),this.contains(t)}},window.DOMTokenList=t,n(Element.prototype,"classList",function(){return new t(this)})}}();

  // canUse
  window.canUse=function(p){if(!window._canUse)window._canUse=document.createElement("div");var e=window._canUse.style,up=p.charAt(0).toUpperCase()+p.slice(1);return p in e||"Moz"+up in e||"Webkit"+up in e||"O"+up in e||"ms"+up in e};

  // window.addEventListener
  (function(){if("addEventListener"in window)return;window.addEventListener=function(type,f){window.attachEvent("on"+type,f)}})();

  // Vars.
  var	$body = document.querySelector('body');

  // Disable animations/transitions until everything's loaded.
  $body.classList.add('is-loading');

  window.addEventListener('load', function() {
    window.setTimeout(function() {
      $body.classList.remove('is-loading');
    }, 100);

    jQuery('input').each(function(){
      jQuery(this).data('orig-placeholder', jQuery(this).attr('placeholder'));
    });
    jQuery('input').focus(function(){
      jQuery(this).attr('placeholder', '')
    });
    jQuery('input').blur(function(){
      jQuery(this).attr('placeholder', jQuery(this).data('orig-placeholder'))
    });

    $("#signup-form").notifyMe();
  });

  // Slideshow Background.
  (function() {

    // Settings.
    var settings = {

      // Images (in the format of 'url': 'alignment').
      images: {
        'assets/images/bg01.jpg': 'center',
        'assets/images/bg02.jpg': 'center',
        'assets/images/bg03.jpg': 'center'
      },

      // Delay.
      delay: 6000

    };

    // Vars.
    var	pos = 0, lastPos = 0,
      $wrapper, $bgs = [], $bg,
      k, v;

    // Create BG wrapper, BGs.
    $wrapper = document.createElement('div');
    $wrapper.id = 'bg';
    $body.appendChild($wrapper);

    for (k in settings.images) {

      // Create BG.
      $bg = document.createElement('div');
      $bg.style.backgroundImage = 'url("' + k + '")';
      $bg.style.backgroundPosition = settings.images[k];
      $wrapper.appendChild($bg);

      // Add it to array.
      $bgs.push($bg);

    }

    // Main loop.
    $bgs[pos].classList.add('visible');
    $bgs[pos].classList.add('top');

    // Bail if we only have a single BG or the client doesn't support transitions.
    if ($bgs.length == 1
      ||	!canUse('transition'))
      return;

    window.setInterval(function() {

      lastPos = pos;
      pos++;

      // Wrap to beginning if necessary.
      if (pos >= $bgs.length)
        pos = 0;

      // Swap top images.
      $bgs[lastPos].classList.remove('top');
      $bgs[pos].classList.add('visible');
      $bgs[pos].classList.add('top');

      // Hide last image after a short delay.
      window.setTimeout(function() {
        $bgs[lastPos].classList.remove('visible');
      }, settings.delay / 2);

    }, settings.delay);

  })();
})();
