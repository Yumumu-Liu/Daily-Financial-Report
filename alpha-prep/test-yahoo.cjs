const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();
async function run() {
  try {
    const symbols = ["^GSPC", "^TNX", "JPY=X", "EURUSD=X", "GC=F", "CL=F"];
    const quotes = await yahooFinance.quote(symbols);
    console.log(JSON.stringify(quotes, null, 2));
  } catch (e) {
    console.error(e);
  }
}
run();
