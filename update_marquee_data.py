
import yfinance as yf
import json
import time
from pathlib import Path

def update_marquee_data():
    """
    Fetches the latest market data from Yahoo Finance for the top 10 US and HK stocks
    and saves it to marquee_data.json.
    """
    us_tickers = ["NVDA", "MSFT", "AAPL", "GOOGL", "AMZN", "META", "AVGO", "TSM", "TSLA", "LLY"]
    hk_tickers = ["0700.HK", "1299.HK", "0005.HK", "0941.HK", "0883.HK", "0857.HK", "3988.HK", "1398.HK", "0939.HK", "3690.HK"]
    all_tickers = us_tickers + hk_tickers
    
    data = []
    for ticker_symbol in all_tickers:
        retries = 3
        while retries > 0:
            try:
                ticker = yf.Ticker(ticker_symbol)
                
                # Fetch current market data
                try:
                    price = ticker.fast_info.last_price
                    prev_close = ticker.fast_info.previous_close
                except:
                    info = ticker.info
                    price = info.get('regularMarketPrice') or info.get('currentPrice') or info.get('previousClose')
                    prev_close = info.get('previousClose')
                
                if price is None:
                    print(f"Error: Could not retrieve price for {ticker_symbol}.")
                    raise ValueError("Price is None")

                if prev_close is None:
                     print(f"Warning: No previous close for {ticker_symbol}, change will be 0.")
                     change = 0
                else:
                    change = price - prev_close
                
                # Use shortName for display, fallback to symbol
                try:
                     name = ticker.info.get('shortName', ticker_symbol)
                except:
                     name = ticker_symbol

                # Prepare the data structure
                data.append({
                    "symbol": ticker_symbol,
                    "name": name,
                    "price": f"{price:,.2f}",
                    "change": f"{change:+.2f}",
                })
                break
            except Exception as e:
                print(f"Error fetching {ticker_symbol}: {e}. Retries left: {retries-1}")
                retries -= 1
                time.sleep(2)

    if not data:
        print("Error: No data fetched. Aborting update.")
        exit(1)

    # Define the output path relative to the script's location
    output_path = Path(__file__).parent / 'marquee_data.json'
    
    # Write data to the JSON file
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    print(f"Successfully updated marquee data to {output_path}")

if __name__ == '__main__':
    update_marquee_data()
