//-.-. --- -.. . -.. / -... -.-- / Tipit hackathon demo -... . -. / .- .-.. - .... .- ..- ... . .-.//
require('dotenv').config();
const stripeKey = process.env.STRIPE_KEY;
const stripeCustomer = process.env.STRIPE_CUSTOMER;
const stripe = require('stripe')(stripeKey);
var express = require('express');
var dataRequest = require('request');


var app = express();
app.use(express.json());
let portNum = 5000;
app.listen(portNum);
console.log('Server is running on port ' + portNum)

app.use(function (req, res, next) {
    var allowedOrigins = [
                          'http://127.0.0.1',
                          'http://localhost',
                          'https://localhost',
                          'https://127.0.0.1',
                          'https://54.189.233.120'
                        ];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
         res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


app.post('/stripe-record-eos', function(request, response){
  if (typeof request.body !== 'undefined') {

      let invoiceItemJSON = {
              customer : stripeCustomer,
              amount : 399,
              currency : 'usd',
              description : "12oz Wild Clover Honey Bear"
      }

      stripe.invoiceItems.create(invoiceItemJSON)
      .then((invoiceItem) => {

        let description = 'txid : ' + request.body.txid + ' memo : ' + request.body.memo;
        let buyer = request.body.buyer;
        let amount = request.body.amount;
        let seller = request.body.seller;

        let invoiceJSON = {
          customer : stripeCustomer,
          description : description,
          custom_fields : [
            {
              name : "token",
              value : "EOS"
            },
            {
              name : "buyer",
              value : buyer
            },
            {
              name : "amount",
              value : amount
            },
            {
              name : "seller",
              value : seller
            }
          ]
        };


        //create the invoice
        stripe.invoices.create(invoiceJSON)
        .then((invoice) => {

          let invoiceID = invoice.id;

          //retrieve and pay the invoice
          stripe.invoices.pay(invoiceID, {"paid_out_of_band" : true})
          .then((paidInvoice) => {

            let paidInvoiceID = paidInvoice.id;
            stripe.invoices.retrieve(paidInvoiceID)
            .then((paidInvoiceObject) => {
              let invoiceURL = paidInvoiceObject.invoice_pdf;
              responseOut = {
                "success" : true,
                "response" : "success",
                "invoice_url" : invoiceURL
              };
              response.send(JSON.stringify(responseOut));
            })
          })
        })
    });
  }
});


//make payment through tipit
app.post('/tipit-payment', function(request, response){
  if (typeof request.body !== 'undefined') {
    let amount = request.body.amount;
    let memo = request.body.memo;

    responses = Object();
    jsonOutObj = {
      from_name : "@BenTipit",
      from_uid : "1072624448996425728",
      to_name : "@truerinfo",
      to_uid : "788595946913398784",
      pid : 5,
      tid : "8",
      full_amount : parseFloat(amount),
      memo : memo
    }

    var endpointAddress = process.env.TIPIT_ENDPOINT
    dataRequest.post(endpointAddress, {json : jsonOutObj}, function(err,httpResponse,body){

      console.log(body);

      responseOut = {
        "success" : true,
        "response" : body,
        "tipit_url" : "https://tipit.io/twitter/@truerinfo/" + body.id
      };

      response.send(JSON.stringify(responseOut));
    });
    };
});


//fetch the file location from ipfs (mockup)
app.post('/fetch-content', function(request, response){
    let file = "bread-stock-photo.png";
    downloadAddress = "https://ipfs.globalupload.io/QmR9jyWyvruKEwXg219L9f1KihnywGS7FQyvCp7kp47wpD";

    responseOut = {
      success :true,
      file : downloadAddress
    };

    response.send(JSON.stringify(responseOut));

});


//for getting the vceipt
app.post('/get-vceipt', function(request, response){

  jsonOutObj = {
    "contract" :"gilsertience",
    "scope" :"newcustomer1",
    "table" :"vctabs",
    "key" :"1",
    "keytype"  : "number"
  }

  console.log(jsonOutObj);

  var endpointAddress = 'http://kylin-dsp-1.liquidapps.io/v1/dsp/ipfsservice1/get_table_row'


  var headers = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
      'Content-Type' : 'text/plain'
  };

  dataRequest.post(endpointAddress, {headers :headers, json : jsonOutObj}, function(requestOut, responseKylin){


    responseOut = {
      "success" : true,
      "response" : responseKylin
    }

    response.send(JSON.stringify(responseOut));

  });

});





// const customer = await stripe.customers.create({
//   email: 'customer@example.com',
// });
