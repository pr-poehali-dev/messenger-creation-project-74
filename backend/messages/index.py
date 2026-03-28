"""
Сообщения: отправка, получение чатов и истории переписки.
GET /?action=chats — список чатов пользователя
GET /?action=history&with_user_id=<id> — история переписки
POST / {"action":"send",...} — отправить сообщение
"""
import json
import os
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 'public')


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def cors_headers():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
    }


def get_user_by_token(cur, token: str):
    cur.execute(
        f"SELECT u.id, u.username, u.display_name, u.avatar_url FROM {SCHEMA}.sessions s JOIN {SCHEMA}.users u ON u.id = s.user_id WHERE s.token=%s AND s.expires_at > NOW()",
        (token,)
    )
    return cur.fetchone()


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers(), 'body': ''}

    token = event.get('headers', {}).get('X-Auth-Token') or ''
    conn = get_conn()
    cur = conn.cursor()

    user = get_user_by_token(cur, token)
    if not user:
        cur.close(); conn.close()
        return {'statusCode': 401, 'headers': cors_headers(), 'body': json.dumps({'error': 'Не авторизован'})}

    user_id = str(user[0])
    method = event.get('httpMethod', 'GET')

    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        action = params.get('action', 'chats')

        if action == 'chats':
            result = get_chats(cur, user_id)
        elif action == 'history':
            with_user_id = params.get('with_user_id', '')
            result = get_history(cur, user_id, with_user_id)
        else:
            result = {'error': 'Неизвестное действие'}

        cur.close(); conn.close()
        return {'statusCode': 200, 'headers': cors_headers(), 'body': json.dumps(result, default=str)}

    elif method == 'POST':
        body = json.loads(event.get('body') or '{}')
        action = body.get('action')

        if action == 'send':
            result = send_message(cur, conn, user_id, body)
        elif action == 'read':
            result = mark_read(cur, conn, user_id, body)
        else:
            result = {'error': 'Неизвестное действие'}

        cur.close(); conn.close()
        return {'statusCode': 200, 'headers': cors_headers(), 'body': json.dumps(result, default=str)}

    cur.close(); conn.close()
    return {'statusCode': 405, 'headers': cors_headers(), 'body': json.dumps({'error': 'Метод не поддерживается'})}


def get_chats(cur, user_id: str) -> dict:
    cur.execute(f"""
        SELECT DISTINCT
            u.id, u.username, u.display_name, u.avatar_url, u.is_online,
            (SELECT text FROM {SCHEMA}.messages m2
             WHERE (m2.sender_id = %s AND m2.recipient_id = u.id)
                OR (m2.sender_id = u.id AND m2.recipient_id = %s)
             ORDER BY m2.created_at DESC LIMIT 1) AS last_msg,
            (SELECT created_at FROM {SCHEMA}.messages m3
             WHERE (m3.sender_id = %s AND m3.recipient_id = u.id)
                OR (m3.sender_id = u.id AND m3.recipient_id = %s)
             ORDER BY m3.created_at DESC LIMIT 1) AS last_time,
            (SELECT COUNT(*) FROM {SCHEMA}.messages m4
             WHERE m4.sender_id = u.id AND m4.recipient_id = %s AND m4.is_read = FALSE) AS unread
        FROM {SCHEMA}.messages m
        JOIN {SCHEMA}.users u ON (
            (m.sender_id = %s AND m.recipient_id = u.id) OR
            (m.recipient_id = %s AND m.sender_id = u.id)
        )
        WHERE m.group_id IS NULL
        ORDER BY last_time DESC NULLS LAST
    """, (user_id, user_id, user_id, user_id, user_id, user_id, user_id))

    rows = cur.fetchall()
    chats = [
        {
            'user_id': str(r[0]),
            'username': r[1],
            'display_name': r[2],
            'avatar_url': r[3],
            'is_online': r[4],
            'last_message': r[5],
            'last_time': r[6],
            'unread': int(r[7]),
        }
        for r in rows
    ]
    return {'chats': chats}


def get_history(cur, user_id: str, with_user_id: str) -> dict:
    cur.execute(f"""
        SELECT id, sender_id, recipient_id, text, is_read, is_encrypted, created_at
        FROM {SCHEMA}.messages
        WHERE group_id IS NULL
          AND (
            (sender_id = %s AND recipient_id = %s) OR
            (sender_id = %s AND recipient_id = %s)
          )
        ORDER BY created_at ASC
        LIMIT 100
    """, (user_id, with_user_id, with_user_id, user_id))

    rows = cur.fetchall()
    messages = [
        {
            'id': str(r[0]),
            'sender_id': str(r[1]),
            'recipient_id': str(r[2]),
            'text': r[3],
            'is_read': r[4],
            'is_encrypted': r[5],
            'created_at': r[6],
        }
        for r in rows
    ]
    return {'messages': messages}


def send_message(cur, conn, sender_id: str, body: dict) -> dict:
    recipient_id = body.get('recipient_id')
    text = (body.get('text') or '').strip()

    if not recipient_id or not text:
        return {'error': 'Укажите получателя и текст сообщения'}

    cur.execute(
        f"INSERT INTO {SCHEMA}.messages (sender_id, recipient_id, text, is_encrypted) VALUES (%s, %s, %s, TRUE) RETURNING id, created_at",
        (sender_id, recipient_id, text)
    )
    row = cur.fetchone()
    conn.commit()

    return {'message': {'id': str(row[0]), 'sender_id': sender_id, 'recipient_id': recipient_id, 'text': text, 'created_at': row[1]}}


def mark_read(cur, conn, user_id: str, body: dict) -> dict:
    from_user_id = body.get('from_user_id')
    cur.execute(
        f"UPDATE {SCHEMA}.messages SET is_read=TRUE WHERE recipient_id=%s AND sender_id=%s AND is_read=FALSE",
        (user_id, from_user_id)
    )
    conn.commit()
    return {'ok': True}
