
import yfinance as yf
from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

@app.route('/api/market-data')
def get_market_data():
    tickers = [
        "^GSPC", "^IXIC", "JPY=X", "CNY=X", "SGDCNY=X", 
        "^FVX", "^TNX", "BZ=F", "GC=F", "SI=F"
    ]
    
    data = []
    for ticker_symbol in tickers:
        ticker = yf.Ticker(ticker_symbol)
        
        # Try to get 1-day data with 1-minute interval
        hist = ticker.history(period="1d", interval="1m")
        
        # If minute-data is not available, fall back to 1-month daily data
        if hist.empty:
            hist = ticker.history(period="1mo")

        sparkline = hist['Close'].tolist()

        info = ticker.info
        price = info.get('regularMarketPrice', info.get('previousClose'))
        change = price - info['previousClose']
        change_percent = (change / info['previousClose']) * 100

        data.append({
            "symbol": ticker_symbol,
            "price": f"{price:,.2f}",
            "change": f"{change:+.2f}",
            "changePercent": f"{change_percent:+.2f}%",
            "sparkline": sparkline,
            "en": { "name": info.get('shortName', ticker_symbol) },
            "zh": { "name": info.get('shortName', ticker_symbol) }
        })

    return jsonify(data)

if __name__ == '__main__':
    app.run(port=5001)
