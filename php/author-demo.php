<?php

include "settings.php";

 ?>
<html>
<head>
  <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1">

  <!-- project remote resources -->
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/eosjs@16.0.9/lib/eos.min.js"></script>
  <script type='text/javascript' src='https://js.stripe.com/v3/'></script>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/eosjs@16.0.7/lib/eos.min.js"></script>
  <script src="https://cdn.scattercdn.com/file/scatter-cdn/js/latest/scatterjs-core.min.js"></script>
  <script src="https://cdn.scattercdn.com/file/scatter-cdn/js/latest/scatterjs-plugin-eosjs.min.js"></script>
  <link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Raleway&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
  <link rel="apple-touch-icon" sizes="57x57" href="https://tipit.io/content/img/favicons/apple-icon-57x57.png">
  <link rel="apple-touch-icon" sizes="60x60" href="https://tipit.io/content/img/favicons/apple-icon-60x60.png">
  <link rel="apple-touch-icon" sizes="72x72" href="https://tipit.io/content/img/favicons/apple-icon-72x72.png">
  <link rel="apple-touch-icon" sizes="76x76" href="https://tipit.io/content/img/favicons/apple-icon-76x76.png">
  <link rel="apple-touch-icon" sizes="114x114" href="https://tipit.io/content/img/favicons/apple-icon-114x114.png">
  <link rel="apple-touch-icon" sizes="120x120" href="https://tipit.io/content/img/favicons/apple-icon-120x120.png">
  <link rel="apple-touch-icon" sizes="144x144" href="https://tipit.io/content/img/favicons/apple-icon-144x144.png">
  <link rel="apple-touch-icon" sizes="152x152" href="https://tipit.io/content/img/favicons/apple-icon-152x152.png">
  <link rel="apple-touch-icon" sizes="180x180" href="https://tipit.io/content/img/favicons/apple-icon-180x180.png">
  <link rel="icon" type="image/png" sizes="192x192"  href="https://tipit.io/content/img/favicons/android-icon-192x192.png">
  <link rel="icon" type="image/png" sizes="32x32" href="./content/img/favicons/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="96x96" href="https://tipit.io/content/img/favicons/favicon-96x96.png">
  <link rel="icon" type="image/png" sizes="16x16" href="https://tipit.io/content/img/favicons/favicon-16x16.png">

  <!-- project local resources -->
  <script type="text/javascript" src="js/demos.load.js"></script>
  <script type="text/javascript" src="js/data-calls.js"></script>
  <link rel="stylesheet" href="css/style.css">

</head>

<body>
<?php

$seller = "markstkphoto";
$purchaseType = "author";

//TODO : If we have time incorporate QR code on item
$breadFileAddress = "https://ipfs.globalupload.io/QmR9jyWyvruKEwXg219L9f1KihnywGS7FQyvCp7kp47wpD";
require_once('vendor/autoload.php');
\Stripe\Stripe::setApiKey('sk_test_Jp6a1lZoadeeZnKAsAtMdVjx');
$productCaption = "Bread Loaf Stock Photo";
$productDescription = "This professionally photographed loaf of bread is great for use in culinary websites in culinary advertising.";
$productImageURL =  "img/milk-bread-watermarked.png";
$productName = "Bread Loaf Stock Photo";
$productWebsite = "http://www.photosbymark.com";
$itemPrice = 1.50;
$itemPriceString = "1.50";
$EOSCost = round(($itemPrice/$_SESSION['EOSCurrentValue']), 4);


?>

<!-- arrow back to main index -->
<a class="back-arrow fa fa-arrow-left" href="./"></a>

<div class="main-wrapper" >
<div class="inner-container">

<!-- seller photo -->
<div class="seller-header">
  <img src="img/mark-stair.png">
  <a href="#">Mark Stair's Stock Photography</a>
</div>

<!-- product description -->
<br>
<h1><?php echo $productCaption; ?></h1>
<img src="<?php echo $productImageURL; ?>">
<p><?php echo $productDescription; ?></p>
<p><a href="<?php echo $productWebsite; ?>" target="_blank"><?php echo $productWebsite; ?></a></p>
<br>
<h1>Price : <?php echo $EOSCost; ?> EOS or $<?php echo $itemPriceString ; ?></h1>


<div class="success-response" style="display:none;">
</div>


<!-- payment type dropdown -->
<select id="payment-choice">
  <option value="">Select Payment Type</option>
  <option value="eos">EOS</option>
  <option value="tipit">tipit</option>
  <option value="credit-card">Credit Card</option>
</select>


<!-- payment form for submission -->
<form id="payment-selected" data-seller="<?php echo $seller; ?>" data-amount="<?php echo $EOSCost; ?>" data-memo="<?php echo $productCaption; ?>" data-purchase-type="<?php echo $purchaseType; ?>">

  <!-- card entry stripe -->
  <div id="card-element">
  </div>

  <!-- eos payment -->
  <div id="eos-payment">
  </div>

  <!-- submit button -->
  <button id="submit-payment" onclick="submitPayment()" style="display:none;">
    <span id="submit-text">Submit Payment</span>
    <span id="submit-icon" class="fa fa-check"></span>
  </button>

</form>

</div>
</div>
</body>
</html>
