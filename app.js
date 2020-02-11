const puppeteer = require("puppeteer");
const fs = require("fs");
const readline = require("readline");
var firstLaunch = true;
var page;


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

StartScraping().catch(err =>
  console.log("ERRRRRRRRRRRRRRRORRRRRRRRRRRRRRRRR:  " + err)
);

async function StartScraping() {
  if (firstLaunch) {
    firstLaunch = false;
    const browser = await puppeteer.launch({ headless: false });
     page = await browser.newPage();
    console.log("1")
    await page.setViewport({ width: 1400, height: 800 });
    console.log("2")
    await page.goto(
      "https://www.yad2.co.il/realestate/forsale?city=6300&property=1,3&rooms=2.5--1&price=-1-1900000"
    );
    console.log("3")
  }
  // await page.screenshot({ path: "google.png" });

  console.log("4")
  while(true){
    var selected = await page.waitForSelector(".feeditem");
    console.log(selected)
    if(selected)
      break;
  }

  await page.evaluate(async () => {
    await sleep(5000)
    var deals = document.getElementsByClassName("feeditem");

    // #deals.length
    for (var i = 0; i < deals.length; i++) {
      console.log("deal number " + i);
      var dealElement = document.getElementById(deals[i].children[0].id);
      dealElement.click();
      await sleep(2000)

      console.log("deal number " + i + " ID");
      var id = dealElement.children[1].children[0]
        .getElementsByClassName("footer")[0]
        .innerText.match(/\d+/)[0];
        console.log("deal number " + i + " Price");
      var price = dealElement.children[0]
        .getElementsByClassName("left_col")[0]
        .getElementsByClassName("price")[0].innerText;
      console.log("deal number " + i + " desc");
      var desc = dealElement.children[0].getElementsByClassName("right_col")[0]
        .innerText;
        dealElement.click();

      // var deal = {
      //   id: id,
      //   price: price,
      //   desc: desc
      // };

      // b_dealAlreadyExists = false;
      // var dealID = deal.id;

      // // const content = await window.readfile('/etc/hosts');

      // if (!b_dealAlreadyExists && deal) {
      //   fs.appendFile("deals.txt", deal.id + "\n", function(err) {
      //     if (err) throw err;
      //     console.log("New deal added!");
      //   });

      //   // MAIL HERE on new shit
      // } else {
      //   console.log("Deal already exists");
      // }
    }
  });
console.log("end")
  // StartScraping();
}