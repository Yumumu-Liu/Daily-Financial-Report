
import yfinance as yf
import json
from pathlib import Path

def update_market_data():
    """
    Fetches the latest market data from Yahoo Finance for a predefined list of tickers
    and saves it to market_data.json.
    """
    tickers = [
        "^GSPC", "^IXIC", "JPY=X", "CNY=X", "SGDCNY=X",
        "^FVX", "^TNX", "BZ=F", "GC=F", "SI=F"
    ]
    
    data = []
    for ticker_symbol in tickers:
        try:
            ticker = yf.Ticker(ticker_symbol)
            
            # Fetch historical data for the sparkline chart (1 month)
            hist = ticker.history(period="1mo")
            if hist.empty:
                print(f"Warning: No history found for {ticker_symbol}, skipping sparkline.")
                sparkline = []
            else:
                sparkline = hist['Close'].tolist()

            # Fetch current market data
            info = ticker.info
            price = info.get('regularMarketPrice') or info.get('currentPrice') or info.get('previousClose')
            
            if price is None:
                print(f"Error: Could not retrieve price for {ticker_symbol}. Skipping.")
                continue

            prev_close = info.get('previousClose')
            if prev_close is None:
                 print(f"Warning: No previous close for {ticker_symbol}, change will be 0.")
                 change = 0
            else:
                change = price - prev_close

            change_percent = (change / prev_close) * 100 if prev_close else 0

            # Prepare the data structure
            data.append({
                "symbol": ticker_symbol,
                "price": f"{price:,.2f}",
                "change": f"{change:+.2f}",
                "changePercent": f"{change_percent:+.2f}%",
                "sparkline": sparkline,
            })
        except Exception as e:
            print(f"An error occurred while fetching data for {ticker_symbol}: {e}")

    # Define the output path relative to the script's location
    output_path = Path(__file__).parent / 'market_data.json'
    
    # Write data to the JSON file
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    print(f"Successfully updated market data to {output_path}")

if __name__ == '__main__':
    update_market_data()
