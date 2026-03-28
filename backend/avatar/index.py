"""
Загрузка аватара пользователя в S3 и сохранение ссылки в БД.
POST / — загрузить аватар (base64 изображение)
"""
import json
import os
import base64
import uuid
import psycopg2
import boto3

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 'public')
CDN_BASE = f"https://cdn.poehali.dev/projects/{os.environ.get('AWS_ACCESS_KEY_ID', '')}/bucket"


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def get_s3():
    return boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )


def cors_headers():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

    user_id = str(user[0])
    body = json.loads(event.get('body') or '{}')
    image_data = body.get('image')
    content_type = body.get('content_type', 'image/jpeg')

    if not image_data:
        cur.close(); conn.close()
        return {'statusCode': 400, 'headers': cors_headers(), 'body': json.dumps({'error': 'Нет изображения'})}

    ext_map = {'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp'}
    ext = ext_map.get(content_type, 'jpg')
    file_key = f"avatars/{user_id}/{uuid.uuid4()}.{ext}"

    image_bytes = base64.b64decode(image_data)
    s3 = get_s3()
    s3.put_object(Bucket='files', Key=file_key, Body=image_bytes, ContentType=content_type)

    avatar_url = f"{CDN_BASE}/files/{file_key}"

    cur.execute(f"UPDATE {SCHEMA}.users SET avatar_url=%s, updated_at=NOW() WHERE id=%s", (avatar_url, user_id))
    cur.execute(
        f"INSERT INTO {SCHEMA}.avatars (user_id, url, is_active) VALUES (%s, %s, TRUE)",
        (user_id, avatar_url)
    )
    conn.commit()
    cur.close(); conn.close()

    return {
        'statusCode': 200,
        'headers': cors_headers(),
        'body': json.dumps({'avatar_url': avatar_url})
    }
