const puppeteer = require("puppeteer");
const fs = require("fs");
var firstLaunch = true;
var page;
var noDealsIndex = []

StartScraping().catch(err => {
  console.log("ERRRRRRRRRRRRRRRORRRRRRRRRRRRRRRRR:  " + err);
  StartScraping();
});

async function StartScraping() {
  if (firstLaunch) {
    firstLaunch = false;
    const browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
    console.log("1");
    await page.setViewport({ width: 1400, height: 800 });
    console.log("2");
    await page.goto(
      "https://www.yad2.co.il/realestate/forsale?city=6300&property=1,3&rooms=2.5--1&price=-1-1900000"
    );
    console.log("3");
  }
  // await page.screenshot({ path: "google.png" });

  console.log("4");
  while (true) {
    var selected = await page.waitForSelector(".feeditem");
    // TODO retries
    if (selected) break;
  }

  var result = await page.evaluate(async () => {
    var dealsArray = [];
    // await new Promise(r => setTimeout(r, 15000));
    var deals = document.getElementsByClassName("feeditem");

    // i < deals.length
    for (var i = 0; i < 4; i++) {
      console.log("deal number " + i);
      if(!deals[i]) {
        noDealsIndex.push(i)
        continue;
      }
      var dealElement = document.getElementById(deals[i].children[0].id);
      dealElement.click();
      await new Promise(r => setTimeout(r, 6000));

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

      var deal = {
        id: id,
        price: price,
        desc: desc
      };

      dealsArray.push(deal);
    }
    return dealsArray;
  });

  console.log("RESULTS LENGTH " + result.length);
  for (var i = 0; i < result.length; i++) {
    console.log("result " + i);
    if(noDealsIndex.includes(i))
    {
      console.log("skipped result " + i)
      continue;
    }    

    fs.readFile("deals.txt", function(err, data) {
      console.log("reading file from " + i)
      if (err) throw err;
      var dealID = result[i].id;
      var newLine = dealID + "\n";
      if (data.indexOf(dealID) >= 0) {
        // Already exists
        console.log(dealID + " already exists");
      }
      else
      {
        // Doesnt exist in file
        fs.appendFile("deals.txt", newLine, error => {
          if (error) throw error;
          console.log(dealID + " Saved.");
        });
        console.log(" AND A NEWBORN WAS FOUND!")
      }
    });

  }

  await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
  StartScraping();
}
