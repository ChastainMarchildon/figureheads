
function stripeCheckout(){
  const stripe = Stripe('pk_test_KtoZqH7idkT9anePS9XkRk7D');
  console.log('here');
  //const checkoutButton = document.getElementById('checkout-button-plan_F99sURKqZZKMVs');
  //checkoutButton.addEventListener('click', function () {
    // When the customer clicks on the button, redirect
    // them to Checkout.
    console.log('here');
    stripe.redirectToCheckout({
      items: [{plan: 'plan_F99sURKqZZKMVs', quantity: 1}],

      // Do not rely on the redirect to the successUrl for fulfilling
      // purchases, customers may not always reach the success_url after
      // a successful payment.
      // Instead use one of the strategies described in
      // https://stripe.com/docs/payments/checkout/fulfillment
      successUrl: 'https://localhost:3000/listings',
      cancelUrl: 'https://your-website.com/canceled',
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
