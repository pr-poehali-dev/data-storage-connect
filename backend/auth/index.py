import json
import os
import jwt
import bcrypt
from datetime import datetime, timedelta
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: JWT authentication - register, login, verify users
    Args: event - dict with httpMethod, body, headers
          context - object with request_id, function_name
    Returns: HTTP response with JWT token or user data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    db_url = os.environ.get('DATABASE_URL')
    jwt_secret = os.environ.get('JWT_SECRET', 'dev-secret-key')
    
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'register':
                name = body_data.get('name')
                email = body_data.get('email')
                password = body_data.get('password')
                
                if not all([name, email, password]):
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Missing required fields'})
                    }
                
                cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
                existing = cursor.fetchone()
                
                if existing:
                    return {
                        'statusCode': 409,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Email already exists'})
                    }
                
                password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                
                cursor.execute(
                    "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s) RETURNING id, name, email, created_at",
                    (name, email, password_hash)
                )
                user = cursor.fetchone()
                conn.commit()
                
                token = jwt.encode({
                    'user_id': user['id'],
                    'email': user['email'],
                    'exp': datetime.utcnow() + timedelta(days=7)
                }, jwt_secret, algorithm='HS256')
                
                return {
                    'statusCode': 201,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'token': token,
                        'user': {
                            'id': user['id'],
                            'name': user['name'],
                            'email': user['email'],
                            'created_at': user['created_at'].isoformat()
                        }
                    })
                }
            
            elif action == 'login':
                email = body_data.get('email')
                password = body_data.get('password')
                
                if not all([email, password]):
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Missing email or password'})
                    }
                
                cursor.execute("SELECT id, name, email, password_hash, created_at FROM users WHERE email = %s", (email,))
                user = cursor.fetchone()
                
                if not user or not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Invalid credentials'})
                    }
                
                token = jwt.encode({
                    'user_id': user['id'],
                    'email': user['email'],
                    'exp': datetime.utcnow() + timedelta(days=7)
                }, jwt_secret, algorithm='HS256')
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'token': token,
                        'user': {
                            'id': user['id'],
                            'name': user['name'],
                            'email': user['email'],
                            'created_at': user['created_at'].isoformat()
                        }
                    })
                }
        
        elif method == 'GET':
            auth_header = event.get('headers', {}).get('X-Auth-Token')
            
            if not auth_header:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'No token provided'})
                }
            
            try:
                payload = jwt.decode(auth_header, jwt_secret, algorithms=['HS256'])
                user_id = payload.get('user_id')
                
                cursor.execute("SELECT id, name, email, created_at FROM users WHERE id = %s", (user_id,))
                user = cursor.fetchone()
                
                if not user:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'User not found'})
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'user': {
                            'id': user['id'],
                            'name': user['name'],
                            'email': user['email'],
                            'created_at': user['created_at'].isoformat()
                        }
                    })
                }
            except jwt.ExpiredSignatureError:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Token expired'})
                }
            except jwt.InvalidTokenError:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid token'})
                }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cursor.close()
        conn.close()