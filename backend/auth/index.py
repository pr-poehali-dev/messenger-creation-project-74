"""
Авторизация пользователей: регистрация и вход.
Принимает POST /register и POST /login.
"""
import json
import os
import hashlib
import secrets
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 'public')


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def hash_password(password: str, salt: str) -> str:
    return hashlib.sha256(f"{salt}{password}".encode()).hexdigest()


def cors_headers():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
    }


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers(), 'body': ''}

    body = json.loads(event.get('body') or '{}')
    action = body.get('action')

    if action == 'register':
        return register(body)
    elif action == 'login':
        return login(body)
    else:
        return {'statusCode': 400, 'headers': cors_headers(), 'body': json.dumps({'error': 'Неизвестное действие'})}


def register(body: dict) -> dict:
    username = (body.get('username') or '').strip()
    display_name = (body.get('display_name') or '').strip()
    email = (body.get('email') or '').strip().lower()
    password = body.get('password') or ''

    if not username or not email or not password or not display_name:
        return {'statusCode': 400, 'headers': cors_headers(), 'body': json.dumps({'error': 'Заполните все поля'})}

    if len(password) < 6:
        return {'statusCode': 400, 'headers': cors_headers(), 'body': json.dumps({'error': 'Пароль минимум 6 символов'})}

    salt = secrets.token_hex(16)
    password_hash = hash_password(password, salt)
    full_hash = f"{salt}:{password_hash}"
    token = secrets.token_hex(32)

    conn = get_conn()
    cur = conn.cursor()

    cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email=%s OR username=%s", (email, username))
    if cur.fetchone():
        cur.close(); conn.close()
        return {'statusCode': 409, 'headers': cors_headers(), 'body': json.dumps({'error': 'Email или имя пользователя уже заняты'})}

    cur.execute(
        f"INSERT INTO {SCHEMA}.users (username, display_name, email, password_hash) VALUES (%s, %s, %s, %s) RETURNING id",
        (username, display_name, email, full_hash)
    )
    user_id = str(cur.fetchone()[0])

    cur.execute(
        f"INSERT INTO {SCHEMA}.sessions (user_id, token) VALUES (%s, %s)",
        (user_id, token)
    )
    conn.commit()
    cur.close(); conn.close()

    return {
        'statusCode': 200,
        'headers': cors_headers(),
        'body': json.dumps({'token': token, 'user': {'id': user_id, 'username': username, 'display_name': display_name, 'email': email}})
    }


def login(body: dict) -> dict:
    email = (body.get('email') or '').strip().lower()
    password = body.get('password') or ''

    if not email or not password:
        return {'statusCode': 400, 'headers': cors_headers(), 'body': json.dumps({'error': 'Введите email и пароль'})}

    conn = get_conn()
    cur = conn.cursor()

    cur.execute(f"SELECT id, username, display_name, email, password_hash, avatar_url FROM {SCHEMA}.users WHERE email=%s", (email,))
    row = cur.fetchone()

    if not row:
        cur.close(); conn.close()
        return {'statusCode': 401, 'headers': cors_headers(), 'body': json.dumps({'error': 'Неверный email или пароль'})}

    user_id, username, display_name, user_email, stored_hash, avatar_url = row
    salt, pw_hash = stored_hash.split(':', 1)

    if hash_password(password, salt) != pw_hash:
        cur.close(); conn.close()
        return {'statusCode': 401, 'headers': cors_headers(), 'body': json.dumps({'error': 'Неверный email или пароль'})}

    token = secrets.token_hex(32)
    cur.execute(f"INSERT INTO {SCHEMA}.sessions (user_id, token) VALUES (%s, %s)", (str(user_id), token))
    conn.commit()
    cur.close(); conn.close()

    return {
        'statusCode': 200,
        'headers': cors_headers(),
        'body': json.dumps({'token': token, 'user': {'id': str(user_id), 'username': username, 'display_name': display_name, 'email': user_email, 'avatar_url': avatar_url}})
    }
