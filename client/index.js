const puppeteer = require("puppeteer");

const errors = [];
const args = process.argv.slice(2);
const arg1 = args[0];
const isHelp = arg1 === "-h" || arg1 === "--help";
const addr = args[0];
const numTabs = parseInt(args[1], 10);
const delay = args[2] ? parseInt(args[2], 10) : 20;

if (!isHelp) {
  if (!addr) {
    errors.push(`  Missing address of server to test.`);
  }

  if (!numTabs) {
    errors.push(`  Missing number of players.`);
  }
}

if (isHelp || !addr || !numTabs) {
  if (!isHelp) {
    console.error("\x1b[31m\n" + errors.join("\n") + "\x1b[0m");
  }
  console.log(`
Usage:

  Make sure to remove consent and intro steps from the project you want to test.
  Start your empirica project somewhere accessible from the machine you want to
  run the tests on. Create batches to sustain the number of concurrent players
  you wish to test. Then start this program with the address of the experiment
  and how many players you want to throw at it.

Examples:

  yarn start localhost:3000 10
  yarn start 123.123.123.123 100
  yarn start mytest.example.com 6

    `);
  process.exit(isHelp ? 0 : 1);
}

console.log(
  `Testing http://${addr} with ${numTabs} players, on a ${delay}s loop.`
);

function sleep(time) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time);
  });
}

(async () => {
  const browser = await puppeteer.launch({
    // dumpio: true
  });

  const pages = [];

  for (let i = 0; i < numTabs; i++) {
    console.log(`Creating page ${i}`);
    const page = await browser.newPage();
    pages.push(page);
    console.log(`Created page ${i}`);
  }

  while (true) {
    for (let i = 0; i < pages.length; i++) {
      console.log(`Loading page ${i}`);
      const randomID = Math.random()
        .toString(36)
        .substr(2, 9);
      const page = pages[i];
      await page.goto(`http://${addr}?playerIdKey=${randomID}`);

      await page.screenshot({ path: "example.png" });

      // Input Player ID
      const playerInput = await page.waitForSelector("#id", {
        timeout: 300000 // 5min
      });
      await page.evaluate(
        (input, randomID) => (input.value = randomID),
        playerInput,
        randomID
      );
      await page.click(".new-player button");
      console.log(`Loaded page ${i}`);
    }

    let step = 0;
    let running = true;
    do {
      step++;
      console.log(`Starting loop ${step}`);

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];

        // Wait for next step or exit
        await page.waitForSelector(
          ".task-response button, .exit-survey button",
          {
            timeout: 300000 // 5min
          }
        );
        const isStep = await page.$(".task-response button");

        if (isStep) {
          console.log(`Running step ${step} on page #${i}`);

          await page.$eval("#value", input => {
            input.value = Math.random();
            input.dispatchEvent(new Event("input", { bubbles: true }));
          });

          // Wait randomly between 10 and 30s before submitting
          sleep((delay * 1000) / numTabs);

          await page.click(".task-response button");
        } else {
          console.log(`Game is finished on page #${i}`);
          running = false;
        }
      }
    } while (running);
  }

  // We never get here, do we.
  await browser.close();
})();
