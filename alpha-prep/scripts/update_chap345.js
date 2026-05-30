import fs from 'fs';
import path from 'path';

// --- CHAPTER CONTENT ---
const chap3_sections = [
  {
    "title": "3.1 Products with Regard to Rates",
    "body": "**3.1.1 Treasuries:** U.S. government debt securities widely considered free of default risk. They serve as the foundational benchmark for pricing almost all other financial assets globally. They include short-term Treasury Bills (T-Bills), medium-term Treasury Notes (T-Notes), and long-term Treasury Bonds (T-Bonds).\n\n**3.1.2 Interest Rate Swaps (IRS):** A highly liquid OTC derivative contract where two parties agree to exchange future interest rate cash flows based on a specified principal amount. Typically, one party pays a fixed interest rate and receives a floating rate (like SOFR), allowing institutions to hedge interest rate exposure.\n\n**3.1.3 Swaptions:** An option granting the right, but not the obligation, to enter into an underlying interest rate swap. A 'payer swaption' gives the buyer the right to pay fixed and receive floating. They are heavily used by mortgage servicers to hedge convexity risk.\n\n**3.1.4 TIPS (Treasury Inflation-Protected Securities):** U.S. government bonds designed to protect investors from inflation. The principal value of TIPS is indexed to the Consumer Price Index (CPI). When inflation rises, the principal increases, causing the fixed coupon payments to rise as well.\n\n**3.1.5 Money Markets:** The segment of the financial market in which instruments with high liquidity and very short maturities (overnight to one year) are traded. Participants use it for short-term borrowing and lending via commercial paper, repos, and T-Bills."
  },
  {
    "title": "3.2 Categories of Bonds",
    "body": "**3.2.1 Corporate Bonds:** Debt securities issued by corporations to raise capital. Because they carry a higher risk of default than government bonds, they offer a higher yield (the credit spread). They are split into Investment Grade (high quality) and High Yield (junk bonds).\n\n**3.2.2 Treasury Bonds:** Sovereign debt backed by the full faith and credit of the U.S. government. They represent the risk-free rate in financial modeling and serve as a safe haven asset during times of macroeconomic stress.\n\n**3.2.3 Municipal Bonds:** Debt issued by states or cities to finance capital expenditures. Their primary appeal is their tax-advantaged status; the interest income is often exempt from federal taxes, making them attractive to high-net-worth investors.\n\n**3.2.4 Agency Bonds:** Bonds issued by a U.S. government-sponsored enterprise (GSE) like Fannie Mae. While not explicitly guaranteed by the U.S. Treasury, they carry an implicit guarantee, making them very low risk."
  },
  {
    "title": "3.3 Basic Terms",
    "body": "**3.3.1 & 3.3.2 Bid and Ask/Offer Price:** The Bid price is the highest price a dealer will pay to buy an asset. The Ask (Offer) price is the lowest price the dealer will sell it for. The difference is the bid-ask spread, representing the cost of liquidity.\n\n**3.3.3 Basis Point (BPS):** A standard unit of measure for interest rates. One basis point is equal to 1/100th of 1% (0.01%). A rate hike from 5.00% to 5.25% is a 25 basis point increase.\n\n**3.3.4 Tick Price:** The minimum upward or downward movement in the price of a security. In the Treasury market, prices are often quoted in fractions like 1/32nds."
  },
  {
    "title": "3.4 Simple vs. Compound Interest",
    "body": "**3.4.1 Simple Interest:** Interest calculated solely on the principal amount. It does not account for interest accumulating over time. It is rarely used in advanced fixed income pricing.\n\n**3.4.2 & 3.4.3 Compounding and Continuous Compounding:** Compound interest is calculated on both the principal and the accumulated interest. Continuous compounding assumes interest is compounded an infinite number of times per year, using the natural logarithm base $e$ ($Pe^{rt}$), crucial for derivatives pricing like Black-Scholes.\n\n**3.4.4 Bond Price and Yield To Maturity (YTM):** Yield to Maturity is the internal rate of return (IRR) an investor earns if they hold the bond to maturity. There is a strict inverse relationship: as market yields rise, the price of existing bonds falls."
  },
  {
    "title": "3.5 Term Structure and Yield Curves",
    "body": "**3.5.1 Shapes:** The yield curve plots interest rates of bonds with differing maturities. A 'Normal' curve slopes upward. An 'Inverted' curve (short-term rates higher than long-term) is a notorious historical leading indicator of an impending economic recession.\n\n**3.5.2 Curve Movements:** The yield curve rarely moves in parallel. It undergoes 'Slope Changes' (Steepening or Flattening). A Bull Steepener occurs when short-term rates fall faster than long-term rates. 'Curvature Movement' (Butterflies) involves the middle of the curve shifting differently than the ends."
  },
  {
    "title": "3.6 - 3.8 How to Measure Interest Rate Risk",
    "body": "**3.6 Macaulay Duration:** The weighted average time (in years) it takes for an investor to receive the bond's cash flows. It helps understand how long it takes to recoup an investment but isn't a direct measure of price sensitivity.\n\n**3.7 Modified Duration:** An extension of Macaulay Duration that measures the bond's exact price sensitivity to a 1% (100 bps) change in yield. If Modified Duration is 5, a 1% rate increase causes a 5% price drop.\n\n**3.8 PVBP / DV01:** The Dollar Value of an 01 (DV01) measures the absolute dollar change in the price of a bond for a single basis point (0.01%) change in yield, giving traders their exact dollar risk exposure."
  },
  {
    "title": "3.9 Rates Trade Idea Sample",
    "body": "**Rates Trade Idea Sample:** A classic macro trade is the '2s10s Curve Flattener'. If a trader believes the Fed will hike rates aggressively, they expect short-term rates to rise faster than long-term rates. They would short 2-year Treasury futures and buy 10-year Treasury futures."
  },
  {
    "title": "Recommended Reading",
    "body": "- [Investopedia: Understanding Duration and Convexity](https://www.investopedia.com/terms/d/duration.asp)\n- [CME Group: Introduction to U.S. Treasury Futures](https://www.cmegroup.com/education/courses/introduction-to-us-treasury-futures.html)\n- [PIMCO: What is the Yield Curve?](https://www.pimco.com/en-us/resources/education/understanding-the-yield-curve/)"
  }
];

const chap4_sections = [
  {
    "title": "4.1 Spot & 4.2 Forward",
    "body": "**4.1 Spot Market:** The spot FX market involves the immediate exchange of two currencies at the prevailing market rate. Standard settlement for major pairs (like EUR/USD) is T+2 (two business days after execution). It is the most liquid financial market globally.\n\n**4.2 Forward Market:** An OTC contract to exchange currencies at a predetermined rate on a specific future date. Forwards are heavily used by multinational corporations to hedge future currency risk. Forward rates are determined mathematically by the interest rate differentials between the two countries (Interest Rate Parity)."
  },
  {
    "title": "4.3 Options & 4.4 Corporate FX Solutions",
    "body": "**4.3 FX Options:** A derivative giving the buyer the right, but not the obligation, to exchange currencies at a pre-agreed strike price. It acts as an insurance policy. A company can buy a EUR put to protect against Euro depreciation while retaining upside.\n\n**4.4 Corporate FX Solutions:** Structured hedging solutions provided by bank sales desks. Instead of plain forwards, banks structure 'Target Redemption Forwards' or 'Seagull Options' to reduce upfront premium costs for corporate clients while providing a customized corridor of protection."
  },
  {
    "title": "4.5 FX Trade Ideas",
    "body": "**FX Trade Ideas (The Carry Trade):** A staple macro trade in FX is the Carry Trade. A trader borrows a currency with a very low interest rate (the funding currency, e.g., JPY) and invests in a currency with a high interest rate (the target currency, e.g., MXN). The trader profits from the interest rate differential as long as the target currency does not depreciate significantly."
  },
  {
    "title": "Recommended Reading",
    "body": "- [Investopedia: Currency Carry Trade](https://www.investopedia.com/terms/c/currencycarrytrade.asp)\n- [CFI: Forward Exchange Contract](https://corporatefinanceinstitute.com/resources/derivatives/forward-exchange-contract/)\n- [CME Group: FX Options Guide](https://www.cmegroup.com/education/courses/introduction-to-fx-options.html)"
  }
];

const chap5_sections = [
  {
    "title": "5.1 Must-know FICC Technicals Recap",
    "body": "**5.1 FICC Fundamentals:** Fed Policy manipulates the Fed Fund Rate, anchoring the Yield Curve. Bond Pricing dictates that prices fall when yields rise, measured by Duration. High Yield bonds carry higher default risks than Investment Grade, trading at wider credit spreads. In FX, currencies operate on a Free Float (market-driven) or a Fixed Float (pegged by the central bank)."
  },
  {
    "title": "5.2 Types of Derivatives",
    "body": "**5.2 Core Derivative Types:** \n1. **Forward (OTC):** A highly customizable, bilateral contract with counterparty credit risk.\n2. **Futures:** Standardized contracts traded on exchanges (like CME) requiring daily margin, eliminating counterparty risk.\n3. **Warrant (OTC):** Similar to an option but issued directly by the company, diluting equity when exercised.\n4. **Swap (OTC):** An agreement to exchange a series of cash flows, such as fixed-for-floating Interest Rate Swaps.\n5. **Option:** Grants the right, but not the obligation, to buy (Call) or sell (Put)."
  },
  {
    "title": "5.3 Typical Option Strategy",
    "body": "**5.3.1 - 5.3.3 Strategies:** \n- **Put Spread:** Buying a put and selling a lower-strike put to reduce upfront premium while capping max profit.\n- **Collar:** A common corporate hedge. Holding the stock, buying an OTM Put (downside protection), and selling an OTM Call (to finance the Put). It limits both severe losses and massive gains.\n\n**5.3.4 Greeks:** Mathematical sensitivities. Delta (directional risk), Gamma (convexity/change in Delta), Theta (time decay), and Vega (sensitivity to implied volatility)."
  },
  {
    "title": "5.4 Fixed Income Derivatives",
    "body": "**5.4 Structured Products:** \n- **ABS & MBS:** Pooling illiquid assets (auto loans, mortgages) and selling tranches. MBS carry 'prepayment risk' if homeowners refinance.\n- **CDO:** Complex products slicing pooled debt into risk tiers. Senior tranches are paid first; equity tranches absorb first losses.\n- **Credit Default Swap (CDS):** An insurance contract against a company or sovereign nation defaulting on its debt."
  },
  {
    "title": "5.5 Advanced FICC Derivatives: Options & Black Scholes",
    "body": "**5.5.2 Option Classifications:** Moneyness defines intrinsic value: In-The-Money (ITM) has value, At-The-Money (ATM) strike equals spot, Out-of-The-Money (OTM) has only time value.\n\n**5.5.3 Black Scholes Model:** The fundamental pricing model assuming underlying prices follow a log-normal distribution. The Five Factors are: Spot Price, Strike Price, Time to Expiry, Implied Volatility, and Risk-Free Rate.\n\n**5.5.4 The Greeks Deep Dive:** \n- **Delta:** Change in premium for a $1 change in the underlying.\n- **Gamma:** Rate of change of Delta; highest for ATM options.\n- **Theta:** Time decay; the value an option loses each passing day.\n- **Vega:** Sensitivity to Implied Volatility. When markets panic, Vega causes option premiums to spike."
  },
  {
    "title": "Recommended Reading",
    "body": "- [Investopedia: Options Basics Tutorial](https://www.investopedia.com/options-basics-tutorial-4583012)\n- [CME Group: Introduction to Interest Rate Swaps](https://www.cmegroup.com/education/courses/introduction-to-interest-rate-swaps.html)\n- [Corporate Finance Institute: Black-Scholes Model](https://corporatefinanceinstitute.com/resources/derivatives/black-scholes-merton-model/)"
  }
];

// --- QUIZ QUESTIONS ---
const chap3_quizzes = [
  { question: "Which of the following is considered virtually free of default risk?", options: ["Corporate Bonds", "Municipal Bonds", "U.S. Treasuries", "Agency Bonds"], correctAnswer: 2, explanation: "U.S. Treasuries are backed by the full faith and credit of the U.S. government, making them the global risk-free benchmark." },
  { question: "In an Interest Rate Swap (IRS), what is typically exchanged?", options: ["Principal amounts only", "Fixed interest cash flows for floating interest cash flows", "Equity shares for bonds", "Foreign currency for domestic currency"], correctAnswer: 1, explanation: "An IRS generally involves exchanging a fixed interest rate payment for a floating rate payment based on a notional principal." },
  { question: "What does the principal of a TIPS bond track?", options: ["The Federal Funds Rate", "The S&P 500", "The Consumer Price Index (CPI)", "The price of Gold"], correctAnswer: 2, explanation: "TIPS are indexed to inflation via the CPI, adjusting the principal upward as inflation rises." },
  { question: "Money markets are utilized primarily for which of the following?", options: ["Long-term equity investments", "30-year sovereign debt issuance", "Very short-term borrowing and lending (overnight to 1 year)", "High-yield junk bond trading"], correctAnswer: 2, explanation: "Money markets deal in highly liquid, short-term debt instruments like commercial paper and repos." },
  { question: "Why do Corporate Bonds yield more than Treasury Bonds?", options: ["They are tax-exempt", "They carry a higher risk of default", "They have shorter maturities", "They are backed by the government"], correctAnswer: 1, explanation: "Investors demand a credit spread to compensate for the higher probability that a corporation might default compared to the U.S. government." },
  { question: "What is the primary advantage of Municipal Bonds?", options: ["They offer the highest absolute yields", "They have zero duration risk", "Their interest income is often exempt from federal taxes", "They are convertible into stock"], correctAnswer: 2, explanation: "Municipal bonds appeal to high-net-worth individuals because the interest is generally tax-free." },
  { question: "What does the 'Bid' price represent in market making?", options: ["The price the dealer sells the asset to the client", "The highest price the dealer is willing to pay to buy the asset", "The exact mid-point of the market", "The commission charged by the broker"], correctAnswer: 1, explanation: "The Bid is what the dealer will pay you if you want to sell your security." },
  { question: "How much is 50 basis points (bps)?", options: ["5.00%", "0.50%", "0.05%", "0.005%"], correctAnswer: 1, explanation: "One basis point is 0.01%. Therefore, 50 bps equals 0.50%." },
  { question: "Which formula utilizes the natural logarithm base 'e'?", options: ["Simple Interest", "Discrete Compound Interest", "Continuous Compounding", "Macaulay Duration"], correctAnswer: 2, explanation: "Continuous compounding uses the formula Pe^(rt), assuming interest compounds infinitely." },
  { question: "What is the relationship between Bond Prices and Yield to Maturity (YTM)?", options: ["Directly proportional", "Strictly inverse", "Exponentially positive", "Completely uncorrelated"], correctAnswer: 1, explanation: "As market yields rise, the fixed cash flows of an existing bond become less attractive, forcing its price to fall." },
  { question: "What does an 'Inverted' yield curve historically signal?", options: ["A massive economic boom", "Stable inflation", "An impending economic recession", "A surge in corporate earnings"], correctAnswer: 2, explanation: "An inverted curve (short rates > long rates) suggests the market expects the Fed to aggressively cut rates in the future to fight a recession." },
  { question: "What characterizes a 'Bull Steepener' yield curve movement?", options: ["Long-term rates rise faster than short-term rates", "Short-term rates fall faster than long-term rates", "All rates rise equally", "All rates fall equally"], correctAnswer: 1, explanation: "A bull steepener typically happens when the central bank aggressively cuts short-term rates to stimulate the economy." },
  { question: "What does Macaulay Duration measure?", options: ["The exact dollar change in price", "The weighted average time in years to receive the bond's cash flows", "The probability of default", "The convexity of the bond"], correctAnswer: 1, explanation: "Macaulay duration calculates the weighted average time until all cash flows are realized." },
  { question: "If a bond has a Modified Duration of 6, what happens if yields increase by 1%?", options: ["The price increases by 6%", "The price decreases by 6%", "The yield drops to 0%", "The price decreases by 1%"], correctAnswer: 1, explanation: "Modified duration measures price sensitivity. A 1% yield increase causes a roughly 6% price drop." },
  { question: "What does DV01 measure?", options: ["The percentage change in price for a 1% yield change", "The absolute dollar change in price for a 1 basis point change in yield", "The daily trading volume of the bond", "The dividend yield of the bond"], correctAnswer: 1, explanation: "DV01 (Dollar Value of an 01) gives traders the exact dollar risk exposure per basis point movement." },
  { question: "In a '2s10s Flattener' trade, what is the trader's expectation?", options: ["Short-term rates will fall and long-term rates will rise", "Short-term rates will rise faster than long-term rates", "Both rates will remain completely flat", "The Fed will cut rates to zero"], correctAnswer: 1, explanation: "A flattener implies the spread between 10yr and 2y will narrow, usually because short rates are rising rapidly." },
  { question: "Which bonds are considered 'Junk Bonds'?", options: ["Investment Grade", "Treasuries", "High Yield", "Agency Bonds"], correctAnswer: 2, explanation: "High yield bonds carry lower credit ratings and higher default risk, hence the colloquial term 'junk'." },
  { question: "What is a 'Receiver Swaption'?", options: ["The right to pay fixed and receive floating", "The right to receive fixed and pay floating", "The obligation to buy a Treasury bond", "A swap that has expired"], correctAnswer: 1, explanation: "It gives the holder the right to receive the fixed leg of the swap." },
  { question: "What does the 'Tick Price' represent?", options: ["The annual coupon rate", "The minimum price movement allowed by the exchange", "The time to maturity", "The bid-ask spread"], correctAnswer: 1, explanation: "The tick size is the minimum increment a price can change, e.g., 1/32 in Treasuries." },
  { question: "Agency bonds like Fannie Mae carry what type of guarantee?", options: ["Explicit U.S. Treasury guarantee", "No guarantee whatsoever", "Implicit U.S. government guarantee", "Private insurance guarantee"], correctAnswer: 2, explanation: "While not directly backed by the Treasury like T-Bonds, GSEs have an implicit guarantee that the government won't let them fail." }
];

const chap4_quizzes = [
  { question: "What is the standard settlement timeframe for most major spot FX pairs like EUR/USD?", options: ["T+0 (Same day)", "T+1", "T+2", "T+5"], correctAnswer: 2, explanation: "Spot FX traditionally settles two business days after the trade execution date (T+2)." },
  { question: "Which market involves immediate exchange of currencies at prevailing rates?", options: ["Forward Market", "Futures Market", "Options Market", "Spot Market"], correctAnswer: 3, explanation: "The spot market is for 'on the spot' immediate delivery." },
  { question: "Why do multinational corporations primarily use Forward contracts?", options: ["To speculate on daily price movements", "To hedge and lock in exchange rates for future payable/receivables", "To earn high dividend yields", "To avoid paying any taxes"], correctAnswer: 1, explanation: "Forwards allow companies to eliminate currency risk by locking in a known rate for a future date." },
  { question: "How are FX Forward rates mathematically determined?", options: ["By the CEO of the central bank", "By purely random market sentiment", "By the interest rate differentials between the two currencies (Interest Rate Parity)", "By the amount of gold each country holds"], correctAnswer: 2, explanation: "Covered Interest Rate Parity dictates that forward rates are a function of spot rates and the interest rate differential." },
  { question: "What does an FX Option provide to the buyer?", options: ["The obligation to exchange currencies", "The right, but not the obligation, to exchange currencies at a strike price", "A guaranteed fixed interest payment", "Voting rights in a foreign central bank"], correctAnswer: 1, explanation: "Options provide flexibility; the buyer can walk away if the market rate is more favorable than the strike price." },
  { question: "If a US company needs to pay a European supplier in Euros in 6 months, how can they hedge against the Euro appreciating?", options: ["Buy a EUR Put option", "Sell a EUR Forward", "Buy a EUR Call option (or buy a EUR Forward)", "Short the Euro in the spot market"], correctAnswer: 2, explanation: "To protect against the Euro becoming more expensive, they should secure the right to buy Euros at a capped price (Call option or Forward)." },
  { question: "What is a 'Target Redemption Forward' (TARF)?", options: ["A simple spot trade", "A standard exchange-traded future", "A structured Corporate FX solution offering customized hedging corridors", "A government bond"], correctAnswer: 2, explanation: "TARFs are complex OTC products structured by banks to lower premium costs for corporate hedgers." },
  { question: "What is the core mechanism of the 'Carry Trade'?", options: ["Buying gold and shorting silver", "Borrowing a low-interest currency to invest in a high-interest currency", "Trading exclusively during Asian market hours", "Only buying currencies that are depreciating"], correctAnswer: 1, explanation: "The trader pockets the interest rate differential (the carry) between the two currencies." },
  { question: "In a Carry Trade, the currency you borrow is called the:", options: ["Target currency", "Funding currency", "Reserve currency", "Fiat currency"], correctAnswer: 1, explanation: "The low-yielding currency used to fund the trade is the funding currency (historically JPY or CHF)." },
  { question: "What is the primary risk of a Carry Trade?", options: ["The target currency appreciates too much", "The funding currency depreciates", "The target currency sharply depreciates against the funding currency, wiping out the interest gains", "The stock market crashes"], correctAnswer: 2, explanation: "If the high-yield currency loses value rapidly, the exchange rate losses will vastly exceed the interest earned." },
  { question: "Which characteristic defines a 'Fixed Float' currency?", options: ["It fluctuates wildly every second", "Its value is pegged to another major currency by its central bank", "It has zero interest rate", "It is entirely decentralized like Bitcoin"], correctAnswer: 1, explanation: "Fixed float (pegged) currencies are heavily managed by the central bank to maintain a specific exchange rate." },
  { question: "Which is the most liquid financial market in the world?", options: ["U.S. Equities", "Global Real Estate", "The Spot FX Market", "Corporate Bonds"], correctAnswer: 2, explanation: "The foreign exchange market processes trillions of dollars in volume daily, making it the most liquid." },
  { question: "What happens to the upfront premium when a company uses a 'Collar' or 'Seagull' strategy instead of a vanilla option?", options: ["It drastically increases", "It is usually reduced or zeroed out because selling an option finances the bought option", "It becomes a negative premium", "It converts into a tax liability"], correctAnswer: 1, explanation: "Selling out-of-the-money options generates premium that offsets the cost of the protective option." },
  { question: "What does OTC stand for in FX markets?", options: ["Over-The-Counter", "Options Trade Clearing", "Official Treasury Currency", "Open Time Contract"], correctAnswer: 0, explanation: "OTC means the contract is traded directly between two parties bilaterally, rather than on a centralized exchange." },
  { question: "If the US interest rate is 5% and the Eurozone rate is 2%, the EUR/USD forward rate will typically:", options: ["Trade at a premium to the spot rate", "Trade at a discount to the spot rate", "Be exactly equal to the spot rate", "Be illegal to trade"], correctAnswer: 0, explanation: "Because the US rate is higher, the forward rate will adjust to prevent arbitrage, meaning the lower-yielding currency (EUR) trades at a forward premium." },
  { question: "Which of the following is an obligation rather than a right?", options: ["A Call Option", "A Put Option", "A Forward Contract", "A Warrant"], correctAnswer: 2, explanation: "Forwards are binding contracts. Both parties must execute the trade at maturity." },
  { question: "Why is the JPY historically a popular funding currency?", options: ["Because Japan has massive gold reserves", "Because the Bank of Japan historically maintained near-zero or negative interest rates", "Because it is the most expensive currency", "Because it is pegged to the USD"], correctAnswer: 1, explanation: "Ultra-low borrowing costs make JPY ideal for funding carry trades." },
  { question: "What is 'Moneyness' in FX options?", options: ["The physical cash required to settle", "Whether the option strike is In, At, or Out of the money compared to the spot rate", "The commission charged by the broker", "The interest rate differential"], correctAnswer: 1, explanation: "Moneyness describes the intrinsic value state of the option." },
  { question: "If a company holds receivables in GBP and wants to hedge against the GBP falling, they should:", options: ["Buy a GBP Put", "Buy a GBP Call", "Buy a USD Put", "Do nothing"], correctAnswer: 0, explanation: "A Put option gives them the right to sell GBP at a guaranteed floor price, protecting their receivables." },
  { question: "A 'Seagull' option strategy is generally used to:", options: ["Maximize unlimited upside", "Speculate on high volatility", "Hedge currency risk at a lower premium cost by combining a put spread and a sold call", "Avoid all counterparty risk"], correctAnswer: 2, explanation: "It is a structured corporate solution designed to provide a specific band of protection for cheap/zero cost." }
];

const chap5_quizzes = [
  { question: "What is the primary difference between a Forward and a Futures contract?", options: ["Futures are OTC, Forwards are exchange-traded", "Forwards are highly standardized, Futures are customizable", "Futures are exchange-traded and standardized with daily margin; Forwards are OTC and customizable", "There is no difference"], correctAnswer: 2, explanation: "Futures eliminate counterparty risk via exchanges and daily margin; Forwards offer flexibility but carry credit risk." },
  { question: "What does 'Mark-to-Market' mean in Futures trading?", options: ["Marketing the contract to retail investors", "The daily settlement of gains and losses, requiring margin adjustments", "Waiting until maturity to calculate profit", "Pricing the contract based on the stock market"], correctAnswer: 1, explanation: "Futures accounts are adjusted daily based on the closing price to prevent default." },
  { question: "How does a Warrant differ from a standard Call Option?", options: ["Warrants are only for commodities", "Warrants are issued directly by the company and dilute existing equity when exercised", "Warrants have no expiration date", "Warrants can only be bought by the government"], correctAnswer: 1, explanation: "When a warrant is exercised, the company creates new shares, whereas standard options just transfer existing shares between traders." },
  { question: "What is the purpose of an Interest Rate Swap?", options: ["To physically exchange bonds", "To exchange a series of fixed cash flows for floating cash flows to manage rate exposure", "To buy insurance against a corporate default", "To swap stocks for currencies"], correctAnswer: 1, explanation: "Swaps allow institutions to alter their interest rate profile without changing their underlying balance sheet assets." },
  { question: "What defines an 'Out-of-the-Money' (OTM) Call option?", options: ["The strike price is below the current spot price", "The strike price is equal to the current spot price", "The strike price is above the current spot price", "The option has expired"], correctAnswer: 2, explanation: "An OTM call has no intrinsic value because buying at the higher strike price is worse than the current market price." },
  { question: "Which of the following is a key assumption of the Black-Scholes Model?", options: ["Interest rates fluctuate wildly", "The underlying asset follows a geometric Brownian motion (log-normal distribution)", "Arbitrage opportunities exist everywhere", "Volatility is completely unpredictable"], correctAnswer: 1, explanation: "The model assumes returns are normally distributed and prices follow a continuous log-normal random walk." },
  { question: "Which Greek measures an option's price sensitivity to changes in the underlying asset's price?", options: ["Vega", "Theta", "Gamma", "Delta"], correctAnswer: 3, explanation: "Delta represents how much the option premium changes for a $1 move in the underlying." },
  { question: "Which Greek measures the rate of change of Delta (convexity)?", options: ["Theta", "Vega", "Gamma", "Rho"], correctAnswer: 2, explanation: "Gamma measures how fast Delta changes. It is highest for At-The-Money options." },
  { question: "What does Theta represent in options pricing?", options: ["Directional risk", "Sensitivity to Implied Volatility", "Time decay (loss of value as expiry approaches)", "Interest rate risk"], correctAnswer: 2, explanation: "Options are wasting assets. Theta quantifies the daily bleed in extrinsic value." },
  { question: "When markets panic and Implied Volatility spikes, which Greek causes option premiums to increase?", options: ["Delta", "Gamma", "Theta", "Vega"], correctAnswer: 3, explanation: "Vega measures sensitivity to volatility. Higher volatility makes large swings more likely, increasing option value." },
  { question: "What is a 'Collar' strategy?", options: ["Selling a naked call", "Buying a put and selling a call while holding the underlying asset to limit both risk and reward", "Buying two calls and one put", "Shorting the stock and buying a put"], correctAnswer: 1, explanation: "A collar protects downside via the put, financed by capping the upside via the sold call." },
  { question: "Why would an investor use a 'Put Spread' instead of just buying a Put?", options: ["To get unlimited profit potential", "To reduce the upfront premium paid, accepting a capped maximum profit", "To increase their Theta decay", "To take physical delivery of the asset"], correctAnswer: 1, explanation: "Selling the lower strike put generates premium that partially offsets the cost of the bought put." },
  { question: "What is a primary risk associated with Mortgage-Backed Securities (MBS)?", options: ["They never pay interest", "Prepayment risk (homeowners refinancing when rates drop, returning principal early)", "They are totally illiquid", "They are issued by tech companies"], correctAnswer: 1, explanation: "If rates fall, homeowners refinance, and MBS investors get their cash back exactly when reinvestment rates are poor." },
  { question: "In a Collateralized Debt Obligation (CDO), which tranche absorbs the first losses?", options: ["The AAA Senior Tranche", "The Mezzanine Tranche", "The Equity (Junior) Tranche", "The Super Senior Tranche"], correctAnswer: 2, explanation: "The equity tranche offers the highest yield but takes the first hit if the underlying loans default." },
  { question: "What is a Credit Default Swap (CDS)?", options: ["A swap of floating for fixed interest", "An insurance contract that pays out if a specific company or sovereign defaults on its debt", "An option to buy a bond at a discount", "A government subsidy"], correctAnswer: 1, explanation: "The CDS buyer pays periodic premiums to the seller for protection against a credit event." },
  { question: "Which of the following is NOT one of the Five Factors in the Black-Scholes model?", options: ["Spot Price", "Strike Price", "Time to Expiry", "The company's P/E Ratio"], correctAnswer: 3, explanation: "Black-Scholes relies on Spot, Strike, Time, Volatility, and the Risk-Free Rate. It ignores fundamental valuation metrics." },
  { question: "What is a 'Ratchet Strike' option?", options: ["A vanilla European option", "An exotic option where the strike price resets periodically based on the underlying's performance", "An option that can never be exercised", "An option traded on the CME"], correctAnswer: 1, explanation: "Ratchet (or cliquet) options lock in gains by resetting the strike at specific intervals." },
  { question: "What does 'In-The-Money' (ITM) mean for a Put option?", options: ["The spot price is above the strike price", "The spot price is exactly equal to the strike price", "The spot price is below the strike price", "The option has zero premium"], correctAnswer: 2, explanation: "A put allows you to sell at the strike. If the market (spot) is lower than the strike, selling at the higher strike is profitable." },
  { question: "Which option style can be exercised at any time before expiration?", options: ["European Options", "Bermudan Options", "American Options", "Asian Options"], correctAnswer: 2, explanation: "American options offer early exercise flexibility, whereas European options can only be exercised at expiry." },
  { question: "Why do ATM options have the highest Gamma?", options: ["Because they are the cheapest", "Because small movements in the underlying can easily flip the option from OTM to ITM, causing Delta to swing rapidly", "Because they have no time value", "Because they are immune to volatility"], correctAnswer: 1, explanation: "Gamma is the rate of change of Delta. ATM options are at the tipping point, making their Delta highly sensitive." }
];

// --- UPDATE SCRIPTS ---
async function run() {
  try {
    // 1. Update Curriculum
    const curriculumPath = path.join(process.cwd(), 'src/data/snt_curriculum.json');
    const curriculum = JSON.parse(fs.readFileSync(curriculumPath, 'utf-8'));
    
    const c3 = curriculum.find(c => c.id === 'chap3');
    if (c3) c3.content = { sections: chap3_sections };
    
    const c4 = curriculum.find(c => c.id === 'chap4');
    if (c4) c4.content = { sections: chap4_sections };
    
    const c5 = curriculum.find(c => c.id === 'chap5');
    if (c5) c5.content = { sections: chap5_sections };
    
    fs.writeFileSync(curriculumPath, JSON.stringify(curriculum, null, 2));
    console.log('Curriculum updated successfully.');

    // 2. Update Quizzes
    const quizzesPath = path.join(process.cwd(), 'src/data/snt_quizzes.json');
    const quizzes = JSON.parse(fs.readFileSync(quizzesPath, 'utf-8'));
    
    quizzes.chap3 = chap3_quizzes;
    quizzes.chap4 = chap4_quizzes;
    quizzes.chap5 = chap5_quizzes;
    
    fs.writeFileSync(quizzesPath, JSON.stringify(quizzes, null, 2));
    console.log('Quizzes updated successfully.');
  } catch (error) {
    console.error('Error updating data:', error);
  }
}

run();