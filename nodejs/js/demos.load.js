var stripe = Stripe('pk_test_2au0zrZiHXYBsQiatxtBwX6A');
window.onload = function() {


  //stripe init
  var stripe = Stripe('pk_test_2au0zrZiHXYBsQiatxtBwX6A');
  var elements = stripe.elements();

  //custom styling
  var style = {
    base: {
      fontSize: '16px',
      color: "#32325d",
    }
  };

  //instance of card element
  var card = elements.create('card', {
    style: style
  });

  //init card-element
  card.mount('#card-element');
  document.getElementById('card-element').style.display = 'none';
  card.addEventListener('change', function(event) {
    var displayError = document.getElementById('card-errors');
    if (event.error) {
      displayError.textContent = event.error.message;
    } else {
      displayError.textContent = '';
    }
  });



document.getElementById("payment-choice").addEventListener("change", function() {
  let optionSelected = this.value;
  switch (optionSelected) {
    case "credit-card":
      document.getElementById('card-element').style.display = '';
      document.getElementById('submit-payment').style.display = '';
      break;

    case "eos":
      document.getElementById('card-element').style.display = 'none';
      document.getElementById('submit-payment').style.display = '';
      break;

    case "tipit":
      document.getElementById('card-element').style.display = 'none';
      document.getElementById('submit-payment').style.display = '';
      break;

    default:
      document.getElementById('card-element').style.display = 'none';
      document.getElementById('submit-payment').style.display = 'none';
      break;
  }
})


  document.getElementById("submit-payment").addEventListener("click", function(e){
    e.preventDefault();
  });
}
