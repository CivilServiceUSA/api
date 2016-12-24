var link = document.createElement('link');
link.href = "/docs.css";
link.type = "text/css";
link.rel = "stylesheet";
document.getElementsByTagName("head")[0].appendChild(link);

(function(){
  window.onload = function(){
    var footer = document.querySelector('.jsdoc-message');
    footer.innerHTML = document.getElementById('generated-date').innerHTML;
    footer.style.display = 'block';

    // Fix Annoying Scroll Bubbling
    document.querySelector('.dropdown-menu').onmousewheel = function(e) {
      document.querySelector('.dropdown-menu').scrollTop -= e.wheelDeltaY;
      e.preventDefault();
    };

    document.querySelector('#toc').onmousewheel = function(e) {
      document.querySelector('#toc').scrollTop -= e.wheelDeltaY;
      e.preventDefault();
    };
  }
})();