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

  <!-- project local resources -->
  <script type="text/javascript" src="js/demos.load.js"></script>
  <script type="text/javascript" src="js/data-calls.js"></script>
  <link rel="stylesheet" href="css/style.css">


</head>
<body>
<?php

//TODO : If we have time incorporate QR code on item
$seller = "hankshoneys1";
$purchaseType = "pos";
$productCaption = "12oz Wild Clover Honey Bear";
$productDescription = "This delicious honey is from the organic Green Mountain apiary located in the Green Mountains of Vermont.";
$productImageURL =  "https://www.bearcountrybees.com/wp-content/uploads/2015/03/12oz_bear.jpg";
$productName = "12oz Wild Clover Honey Bear";
$productWebsite = "https://hankshoney.com";
$itemPrice = 3.99;
$itemPriceString = "3.99";
$EOSCost = round((3.99/$_SESSION['EOSCurrentValue']), 4);
$_SESSION['amount'] = 399;
$_SESSION['product'] = $productName;


?>

<!-- arrow back to main index -->
<a class="back-arrow fa fa-arrow-left" href="./"></a>

<div class="main-wrapper" >
<div class="inner-container">


<!-- seller photo -->
<div class="seller-header">
  <img src="img/hanks_logo.png">
  <a href="#">Hank's Mountain Honeys</a>
</div>

<!-- product description -->
<br>
<h1><?php echo $productCaption; ?></h1>
<img src="<?php echo $productImageURL; ?>">
<p><?php echo $productDescription; ?></p>
<p><a href="<?php echo $productWebsite ?>" target="_blank"><?php echo $productWebsite; ?></a></p>
<br>
<h1><b>Price : <?php echo $EOSCost; ?> EOS or $<?php echo $itemPriceString ; ?></b></h1>



<div class="success-response" style="display:none;">
</div>



<!-- payment type dropdown -->
<select id="payment-choice" >
  <option value="">Select Payment Type</option>
  <option value="eos">EOS</option>
  <option value="tipit">Tipit</option>
  <option value="credit-card">Credit Card</option>
</select>


<!-- payment form for submission -->
<form id="payment-selected" data-seller="<?php echo $seller; ?>" data-amount="<?php echo $EOSCost; ?>" data-memo="<?php echo $productCaption; ?>" data-purchase-type="<?php echo $purchaseType; ?>" >

  <!-- card entry stripe -->
  <div id="card-element">
  </div>

  <!-- eos payment -->
  <div id="eos-payment">
  </div>

  <!-- submit button -->
  <button onclick="submitPayment()"  id="submit-payment" style="display:none;">
    <span id="submit-text">Submit Payment</span>
    <span id="submit-icon" class="fa fa-check"></span>
  </button>

</form>



</div>
</div>

</body>
</html>
