<?php
session_start();
$_SESSION['EOSCurrentValue'] = 3.20;

$settings = Array();
$settings['stripe-key'] = '';
$settings['customer-id'] = "";

//tipit settings (disabled for git demo, web demo can use tipit)
$settings['send-tip-endpoint'] = "https://tipit.io";
$settings['tipit-from-account-name'] = "";
$settings['tipit-from-account-uid'] = "";
$settings['tipit-to-account-name'] = "";
$settings['tipit-to-account-uid'] = "";

 ?>
