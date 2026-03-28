"""
Поиск пользователей по нику или имени.
GET /?q=<query> — поиск по username или display_name
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
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
    }


def get_user_by_token(cur, token: str):
    cur.execute(
        f"SELECT u.id FROM {SCHEMA}.sessions s JOIN {SCHEMA}.users u ON u.id = s.user_id WHERE s.token=%s AND s.expires_at > NOW()",
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

    current_user_id = str(user[0])
    params = event.get('queryStringParameters') or {}
    query = (params.get('q') or '').strip()

    if len(query) < 2:
        cur.close(); conn.close()
        return {'statusCode': 200, 'headers': cors_headers(), 'body': json.dumps({'users': []})}

    search = f'%{query}%'
    cur.execute(
        f"""SELECT id, username, display_name, avatar_url, is_online
            FROM {SCHEMA}.users
            WHERE (username ILIKE %s OR display_name ILIKE %s)
              AND id != %s
            LIMIT 20""",
        (search, search, current_user_id)
    )
    rows = cur.fetchall()
    cur.close(); conn.close()

    users = [
        {
            'id': str(r[0]),
            'username': r[1],
            'display_name': r[2],
            'avatar_url': r[3],
            'is_online': r[4],
        }
        for r in rows
    ]
    return {'statusCode': 200, 'headers': cors_headers(), 'body': json.dumps({'users': users})}
