(function() {
    var a = $('#banner-container').children();
    var index = 0;
    run()
  
    function run() {
      a.filter('.active').fadeOut(500).removeClass('active');
      a.eq(index).fadeIn(500).addClass('active');
      index = (index + 1) % a.length; // Wraps around if it hits the end
      setTimeout(run, 1000);
    }
  })();