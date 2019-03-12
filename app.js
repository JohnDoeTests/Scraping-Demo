const puppeteer = require('puppeteer');
const elementButton = "#signup_step_one > div.step_content > form.col.col_choose.col_newnumbers.sub_form.form_validator > div > fieldset > div.radiobox_col.checkbox.checkbox_init > label > span";

GetPhoneNumber();

function CheckSpecialNumber(number) {
  let numberWithoutPrefix = number.substring(3);
  const set = new Set([]);
  var digitCount = 0;

  for (let i = 0; i < numberWithoutPrefix.length; i++) {
    if (!set.has(numberWithoutPrefix[i])) {
      set.add(numberWithoutPrefix[i])
      digitCount++;
    }
  }
  console.log(number + ", Unique digit count:" + digitCount);

  // Checks if the generated number has less than 3 unique digits.
  // Also checks if the number was fetched correctly.
  if (digitCount < 3 && number.length > 6) {
    return true
  }
  else {
    return false
  }
}


async function GetPhoneNumber() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 800 })
  await page.goto('https://019mobile.co.il/%D7%94%D7%A8%D7%A9%D7%9E%D7%AA-%D7%9C%D7%A7%D7%95%D7%97/?pack_id=10035');
  await page.screenshot({ path: 'google.png' });

  while (true) {
    await page.click(elementButton);
    await page.waitFor(300);
    const result = await page.evaluate(() => {
      // Target the 3 generated number values
      var number1 = document.querySelector('#checkbox_2').value;
      var number2 = document.querySelector('#checkbox_3').value;
      var number3 = document.querySelector('#checkbox_4').value;

      var numbers = []
      numbers.push(number1);
      numbers.push(number2);
      numbers.push(number3);

      return numbers;
    });

    var isSpecial = false;
    var isAnySpecialNumber = false;;
    for (let i = 0; i < result.length; i++) {
      isSpecial = CheckSpecialNumber(result[i]);
      if (isSpecial)
        isAnySpecialNumber = true;
    }

    if (isAnySpecialNumber) {
      console.log("SUCCESS!!!")
      break;
    }
    else {
      await page.click(elementButton);
      await page.click(elementButton);
      console.log("RETRYING...")
    }
  }
}
