
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

function buildImageLink(userName){
  const imageLinks = [];
  cloudinary.image(userName +".json", {type: "list"});
  //const response = res.cloudinary.com/dryhb9oao/image/list/userName.json
  console.log(response);
}
