
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime
import json

# --- 配置 ---
SMTP_SERVER = 'smtp.example.com'  # 例如: 'smtp.gmail.com'
SMTP_PORT = 587
EMAIL_SENDER = 'your_email@example.com'
EMAIL_PASSWORD = 'your_app_password'  # 推荐使用应用专用密码
EMAIL_RECEIVER = 'receiver_email@example.com'

def get_market_data():
    # 在实际应用中，您会从API获取这些数据
    # 这里我们使用financial_report.html中的静态数据作为示例
    return [
        { "en": { "name": "S&P 500" }, "zh": { "name": "标准普尔500指数" }, "price": "6,945.10", "change": "+0.43%" },
        { "en": { "name": "Nasdaq" }, "zh": { "name": "纳斯达克指数" }, "price": "23,600.38", "change": "+0.42%" },
        { "en": { "name": "USD/JPY" }, "zh": { "name": "美元/日元" }, "price": "153.7550", "change": "-0.33%" },
        { "en": { "name": "USD/CNY" }, "zh": { "name": "美元/人民币" }, "price": "7.24", "change": "+0.02%" },
        { "en": { "name": "SGD/CNY" }, "zh": { "name": "新元/人民币" }, "price": "5.4885", "change": "-0.38%" },
        { "en": { "name": "2Y UST" }, "zh": { "name": "2年期美国国债" }, "price": "3.60%", "change": "-0.59%" },
        { "en": { "name": "10Y UST" }, "zh": { "name": "10年期美国国债" }, "price": "4.23%", "change": "-0.44%" },
        { "en": { "name": "Brent" }, "zh": { "name": "布伦特原油" }, "price": "65.51", "change": "-1.18%" },
        { "en": { "name": "Gold" }, "zh": { "name": "黄金" }, "price": "5,089.63", "change": "+2.14%" },
        { "en": { "name": "Silver" }, "zh": { "name": "白银" }, "price": "110.22", "change": "+7.04%" },
    ]

def generate_report():
    with open('report_template.html', 'r', encoding='utf-8') as f:
        html_template = f.read()

    # 注入动态数据
    now = datetime.now()
    last_updated = now.strftime("%B %d, %Y %H:%M:%S")
    market_data = get_market_data()

    # 替换模板中的占位符
    html_content = html_template.replace("January 26, 2026", last_updated)
    
    # 注意：这是一个简化的示例。在实际应用中，您需要一个更强大的模板引擎
    # (如 Jinja2) 来动态生成表格等复杂内容。
    # 这里我们只替换更新时间。

    return html_content

def send_email(html_content):
    msg = MIMEMultipart('alternative')
    msg['Subject'] = f"每日财务报告 - {datetime.now().strftime('%Y-%m-%d')}"
    msg['From'] = EMAIL_SENDER
    msg['To'] = EMAIL_RECEIVER

    part = MIMEText(html_content, 'html')
    msg.attach(part)

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_SENDER, EMAIL_PASSWORD)
            server.sendmail(EMAIL_SENDER, EMAIL_RECEIVER, msg.as_string())
        print("邮件发送成功！")
    except Exception as e:
        print(f"邮件发送失败: {e}")

if __name__ == "__main__":
    report_html = generate_report()
    send_email(report_html)
