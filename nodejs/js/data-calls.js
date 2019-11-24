

//call on transaction complete to show/hide ui elements
function transactionComplete() {
  document.getElementById('submit-text').innerHTML = 'Submit Payment';
  document.getElementById('submit-icon').className = 'fa fa-check';
  document.getElementById('submit-payment').style.display = 'none';
  document.getElementById('payment-choice').style.display = 'none';
  document.querySelector('.success-response').style.display = '';
}



//function to get the content purchased
async function getContent(txid) {
  try {
      const response = await fetch('http://localhost:5000/fetch-content', {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(
          {
          txid : txid,
        }
      ), // data can be `string` or {object}!
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const json = await response.json();
      transactionComplete();
      document.querySelector('.success-response').innerHTML += '&nbsp;&nbsp;&nbsp;<a target="_blank" href="' + json.file + '" download>Download</a>';

  } catch (error) {
    console.error(error);
  }
}






//function to record the receipt in stripe
async function getVceipt(txid) {
  try {
      const response = await fetch('http://localhost:5000/get-vceipt', {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(
          {
          txid : txid,
        }
      ), // data can be `string` or {object}!
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const json = await response.json();
      checkoutMethod = document.getElementById('payment-choice').value;
      getContent(txid);

  } catch (error) {
    console.error(error);
  }
}



//function to record the receipt in stripe
async function recordInStripe(buyer, seller, amount, txid, memo) {
  try {
      const response = await fetch('http://localhost:5000/stripe-record-eos', {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(
          {
          buyer : buyer,
          seller : seller,
          amount : amount,
          txid : txid,
          memo : memo
        }
      ), // data can be `string` or {object}!
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const json = await response.json();
      checkoutMethod = document.getElementById('payment-choice').value;
      if (checkoutMethod !== "tipit") {
        document.getElementById('submit-text').innerHTML = 'Submit Payment';
        document.getElementById('submit-icon').className = 'fa fa-check';
        transactionComplete();
        document.querySelector('.success-response').innerHTML = 'Purchase Successful &nbsp;<a href="https://kylin.eosx.io/tx/' + txid + '" target="_blank">View</a>';
      }

      document.querySelector('.success-response').innerHTML += '&nbsp;&nbsp;&nbsp;<a href="' + json.invoice_url + '" target="_blank">Stripe Invoice</a>';

  } catch (error) {
    console.error(error);
  }
}


//tipit transaction
async function tipitPayment(purchaseType, to, amount, memo) {
  try {

      const response = await fetch('http://localhost:5000/tipit-payment', {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(
          {
          amount : amount,
          memo : memo
        }
      ), // data can be `string` or {object}!
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const json = await response.json();


      switch (purchaseType) {
        case "pos":
          recordInStripe("tipitaccount", to, amount, json.response.txid, memo);
          transactionComplete();
          document.querySelector('.success-response').innerHTML = 'Purchase Successful &nbsp;<a href="' + json.tipit_url + '" target="_blank">View</a>';
          break;

        case "author":
          document.querySelector('.success-response').innerHTML = 'Purchase Successful &nbsp;<a href="' + json.tipit_url + '" target="_blank">View</a>';
          getVceipt(json.response.txid);
          break;

      }

      document.querySelector('.success-response').style.display = '';


  } catch (error) {
    console.error(error);
  }
}


//function to transfer eos from one person to another
function submitPayment() {

  //get variables from the form
  to = document.getElementById('payment-selected').getAttribute('data-seller');
  amount = document.getElementById('payment-selected').getAttribute('data-amount');
  memo = document.getElementById('payment-selected').getAttribute('data-memo');
  purchaseType = document.getElementById('payment-selected').getAttribute('data-purchase-type');
  checkoutMethod = document.getElementById('payment-choice').value;

  //credit card disabled for demo
  if (checkoutMethod !== "credit-card") {
    document.getElementById('submit-text').innerHTML = 'Processing ...';
    document.getElementById('submit-icon').className = 'fa fa-cog rotate';
  }

  switch (checkoutMethod) {
    case "tipit":
      tipitPayment(purchaseType, to, amount,  memo);
      break;

    case "eos":
      ScatterJS.plugins( new ScatterEOS());
      const network = {
        blockchain: 'eos',
        host: 'kylin.eossweden.org',
        port: 443,
        protocol: 'https',
        chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191'
      }

      ScatterJS.scatter.connect('checkout_demo').then(connected => {

        //set scatter to null
        const scatter = ScatterJS.scatter;
        isExtension = scatter.isExtension;
        window.ScatterJS = null;


        //############ Async transfer function
        async function transfer() {


          const network = {
            blockchain: 'eos',
            host: 'kylin.eossweden.org',
            port: 443,
            protocol: 'https',
            chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191'
          }


            scatter.getIdentity({
              accounts: [network]
            }).then(identity => {
              if (typeof identity.accounts[0].name !== 'undefined') {
                const accountName = identity.accounts[0].name;
              }
            });

            const eosOptions = {
              httpEndpoint: 'https://nodes.get-scatter.com'
            };
            const eos = scatter.eos(network, Eos, eosOptions, "https");

            scatter.getIdentity({
              accounts: [network]
            }).then(identity => {
              const account = identity.accounts[0];
              preoptions = '{ "authorization":["' + account.name + '@' + account.authority + '"] }';
              const options = JSON.parse(preoptions);

              eos.transaction("eosio.token", myaccount => {
                //transfer into tipit account for user
                myaccount.transfer({
                  from: account.name,
                  to: to,
                  quantity: amount + " EOS",
                  memo: memo
                }, options)
              })
              .then((output) => {
                txid = output.transaction_id;
                switch (purchaseType) {
                  case "pos":
                    //call Johns vreceipt method
                    const account = identity.accounts[0];
                    preoptions = '{ "authorization":["' + account.name + '@' + account.authority + '"] }';
                    const options = JSON.parse(preoptions);

                    //vreceipt example (dummy data)
                    eos.transaction("gilsertience", myaccount => {
                    myaccount.makereceipt({"payload" : {
                        "to" : to,
                        "from" : account.name,
                        "linkid" : "inv_432432",
                        "linkplatform" : "stripe",
                        "terms" : "Don't do anything bad",
                        "docs" : [
                            {
                            "owner" : "hankshoneys1",
                            "filename" : "honey1.jpg",
                            "filedesc" : "testdesc",
                            "ipfsurl" : "httpgoogle.com"
                          }
                        ]
                      }}, options)
                    })


                    recordInStripe(account.name, to, amount, txid, memo, eos);
                    break;

                  case "author":
                    document.querySelector('.success-response').innerHTML = 'Purchase Successful &nbsp;<a href="https://kylin.eosx.io/tx/' + txid + '" target="_blank">View</a>';
                    getVceipt(txid);
                    break;
                }
              })
              .catch((err) => {
                document.getElementById('submit-text').innerHTML = 'Submit Payment';
                document.getElementById('submit-icon').className = 'fa fa-check';
              })



            });
        }
        //############ End  Async transfer function

        const requiredFields = { accounts:[network] };
        scatter.getIdentity(requiredFields).then(identity => {
          transfer();
        });
      });
      break;

  }



}
