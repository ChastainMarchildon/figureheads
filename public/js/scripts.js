
function stripeCheckout(){
  //LIVE
  //const stripe = Stripe('pk_live_RHnRzb3urR9p7w026yXtSTcS');

  //TEST
  const stripe = Stripe('pk_test_KtoZqH7idkT9anePS9XkRk7D');
  //const checkoutButton = document.getElementById('checkout-button-plan_F99sURKqZZKMVs');
  //checkoutButton.addEventListener('click', function () {
    // When the customer clicks on the button, redirect
    // them to Checkout.
    stripe.redirectToCheckout({
      //LIVE
      //items: [{plan: 'plan_F9BhYiaWCFKcsC', quantity: 1}],


      //TEST
      items: [{plan: 'plan_F99sURKqZZKMVs', quantity: 1}],

      // Do not rely on the redirect to the successUrl for fulfilling
      // purchases, customers may not always reach the success_url after
      // a successful payment.
      // Instead use one of the strategies described in
      // https://stripe.com/docs/payments/checkout/fulfillment
      successUrl: 'https://fotio.ca/gethired',
      cancelUrl: 'https://fotio.ca/error',
    })
    .then(function (result) {
      if (result.error) {
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer.
        var displayError = document.getElementById('error-message');
        displayError.textContent = result.error.message;
      } 
    });
}

function uploadArea(userId){
  var widget = cloudinary.createUploadWidget({ 
    cloudName: "dryhb9oao", 
    uploadPreset: "vhf4r1m9" ,
    folder:userId,
    tags:[userId]
  }, (error, result) => { });
  widget.open();
}


/*** Builds an image link by recieving the URL from the controller. This parses the JSON response of that URL, extracting only whats needed to appeand to the image link, then builds an img tag */
function buildImageLink(url){
  lastIndex = url.lastIndexOf('\'');
  const newUrl = url.substring(10,lastIndex);
  fetch(newUrl)
  .then(res => res.json())
  .then(function(myJson) {
    for (var i = 0; i < myJson.resources.length; i++) {
      var imageResource = myJson.resources[i];
      const src='https://res.cloudinary.com/dryhb9oao/image/upload/v1561217109/'+imageResource.public_id +'.'+imageResource.format
      if(i!=1){
        $("section.content-section").append("<a href='" + src + "'><img class='card' style='width:550px; height:800px; display:inline-block;' src=" + src +'></a>');
      }
      else{
        var sheet = document.createElement('style')
        sheet.innerHTML = ".header-section{background-image: url('"+ src + "')}";
        $("section").append(sheet);
      }
    }
  });
}

function homePageCarousel(){
  $(document).ready(function () {
    //Weddings
    setTimeout(function () {
        $("#indexCarousel").css({
          'background-image':'url("https://images.unsplash.com/photo-1459501462159-97d5bded1416?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80")',
          'background-size': 'cover',
          'background-position': 'center',
          'animation': 'fadeIn',
        });
      }, 100),
    //Portraits
    setTimeout(function () {
      $("#indexCarousel").css({
        'background-image':'url("https://images.unsplash.com/photo-1528914457842-1af67b57139d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80")',
        'background-size': 'cover',
        'background-position': 'center',
        'animation': 'fadeIn',
      });
     }, 990),
  //Events
    setTimeout(function () {
      $("#indexCarousel").css({
        'background-image':'url("https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80")',
        'background-size': 'cover',
        'background-position': 'center',
        'animation': 'fadeIn',
      });
    }, 1990),
//Modelling
    setTimeout(function () {
      $("#indexCarousel").css({
        'background-image':'url("https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80")',
        'background-size': 'cover',
        'background-position': 'center',
        'animation': 'fadeIn',
      });
    }, 2900),
//More
    setTimeout(function () {
      $("#indexCarousel").css({
        'background-image':'url("https://images.unsplash.com/photo-1481923387198-050ac1a2896e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1266&q=80")',
        'background-size': 'cover',
        'background-position': 'center',
        'animation': 'fadeIn',
      });
     }, 3990);
});
}

function hamburgerMenu() {
  var x = document.getElementById("nav-section-2");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}
