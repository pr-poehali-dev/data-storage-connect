import json
import os
import jwt
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: User data storage - CRUD operations for user data
    Args: event - dict with httpMethod, body, headers, params
          context - object with request_id
    Returns: HTTP response with user data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    auth_header = event.get('headers', {}).get('X-Auth-Token')
    
    if not auth_header:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'No token provided'})
        }
    
    jwt_secret = os.environ.get('JWT_SECRET', 'dev-secret-key')
    
    try:
        payload = jwt.decode(auth_header, jwt_secret, algorithms=['HS256'])
        user_id = payload.get('user_id')
    except:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid token'})
        }
    
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters', {})
            data_id = params.get('id')
            
            if data_id:
                cursor.execute(
                    "SELECT id, key, value, created_at, updated_at FROM user_data WHERE id = %s AND user_id = %s",
                    (data_id, user_id)
                )
                data = cursor.fetchone()
                
                if not data:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Data not found'})
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'id': data['id'],
                        'key': data['key'],
                        'value': data['value'],
                        'created_at': data['created_at'].isoformat(),
                        'updated_at': data['updated_at'].isoformat()
                    })
                }
            else:
                cursor.execute(
                    "SELECT id, key, value, created_at, updated_at FROM user_data WHERE user_id = %s ORDER BY created_at DESC",
                    (user_id,)
                )
                data_list = cursor.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'data': [
                            {
                                'id': item['id'],
                                'key': item['key'],
                                'value': item['value'],
                                'created_at': item['created_at'].isoformat(),
                                'updated_at': item['updated_at'].isoformat()
                            }
                            for item in data_list
                        ]
                    })
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            key = body_data.get('key')
            value = body_data.get('value')
            
            if not key or value is None:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing key or value'})
                }
            
            cursor.execute(
                "INSERT INTO user_data (user_id, key, value) VALUES (%s, %s, %s) RETURNING id, key, value, created_at, updated_at",
                (user_id, key, json.dumps(value) if isinstance(value, dict) else str(value))
            )
            new_data = cursor.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'id': new_data['id'],
                    'key': new_data['key'],
                    'value': new_data['value'],
                    'created_at': new_data['created_at'].isoformat(),
                    'updated_at': new_data['updated_at'].isoformat()
                })
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            data_id = body_data.get('id')
            value = body_data.get('value')
            
            if not data_id or value is None:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing id or value'})
                }
            
            cursor.execute(
                "UPDATE user_data SET value = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s AND user_id = %s RETURNING id, key, value, created_at, updated_at",
                (json.dumps(value) if isinstance(value, dict) else str(value), data_id, user_id)
            )
            updated_data = cursor.fetchone()
            conn.commit()
            
            if not updated_data:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Data not found'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'id': updated_data['id'],
                    'key': updated_data['key'],
                    'value': updated_data['value'],
                    'created_at': updated_data['created_at'].isoformat(),
                    'updated_at': updated_data['updated_at'].isoformat()
                })
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cursor.close()
        conn.close()
