import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Обработка Telegram webhook для CryptoBot
    Args: event с httpMethod, body, headers; context с request_id
    Returns: HTTP response с statusCode, headers, body
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'POST':
        body_str = event.get('body', '{}')
        update = json.loads(body_str)
        
        message = update.get('message', {})
        chat_id = message.get('chat', {}).get('id')
        text = message.get('text', '')
        user = message.get('from', {})
        
        telegram_id = user.get('id')
        username = user.get('username', '')
        first_name = user.get('first_name', '')
        last_name = user.get('last_name', '')
        
        if telegram_id:
            db_url = os.environ.get('DATABASE_URL')
            conn = psycopg2.connect(db_url)
            cur = conn.cursor()
            
            cur.execute(
                """INSERT INTO users (telegram_id, username, first_name, last_name, updated_at) 
                   VALUES (%s, %s, %s, %s, CURRENT_TIMESTAMP)
                   ON CONFLICT (telegram_id) 
                   DO UPDATE SET username = %s, first_name = %s, last_name = %s, updated_at = CURRENT_TIMESTAMP""",
                (telegram_id, username, first_name, last_name, username, first_name, last_name)
            )
            
            default_assets = [
                ('BTC', 'Bitcoin', 0.00234),
                ('ETH', 'Ethereum', 0.432),
                ('USDT', 'Tether', 1250.50),
                ('TON', 'Toncoin', 125.8)
            ]
            
            for symbol, name, balance in default_assets:
                cur.execute(
                    """INSERT INTO assets (user_id, symbol, name, balance, updated_at)
                       VALUES (%s, %s, %s, %s, CURRENT_TIMESTAMP)
                       ON CONFLICT (user_id, symbol)
                       DO UPDATE SET updated_at = CURRENT_TIMESTAMP""",
                    (telegram_id, symbol, name, balance)
                )
            
            conn.commit()
            cur.close()
            conn.close()
        
        bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
        
        if text == '/start':
            web_app_url = os.environ.get('WEB_APP_URL', 'https://your-app-url.com')
            response_text = "Добро пожаловать в CryptoBot! 🚀\n\nОткройте приложение для управления криптовалютами:"
            
            keyboard = {
                "inline_keyboard": [[{
                    "text": "🚀 Открыть CryptoBot",
                    "web_app": {"url": web_app_url}
                }]]
            }
            
            send_message(bot_token, chat_id, response_text, keyboard)
        
        elif text == '/balance':
            response_text = f"💰 Ваш баланс доступен в приложении"
            send_message(bot_token, chat_id, response_text)
        
        else:
            response_text = "Используйте команды:\n/start - Запустить бота\n/balance - Проверить баланс"
            send_message(bot_token, chat_id, response_text)
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'isBase64Encoded': False,
            'body': json.dumps({'status': 'ok'})
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }

def send_message(bot_token: str, chat_id: int, text: str, reply_markup: dict = None):
    import urllib.request
    import urllib.parse
    
    if not bot_token:
        return
    
    url = f'https://api.telegram.org/bot{bot_token}/sendMessage'
    
    data = {
        'chat_id': chat_id,
        'text': text
    }
    
    if reply_markup:
        data['reply_markup'] = reply_markup
    
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(data).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        
        urllib.request.urlopen(req)
    except Exception:
        pass