import psycopg2
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Define your database connection parameters
conn_params = {
    'database': 'bookingdb',
    'user': 'postgres',
    'password': 'root',
    'host': 'host.docker.internal',
    'port': '5432'
}

def fetch_all_packages():
    try:
        conn = psycopg2.connect(**conn_params)
        cur = conn.cursor()

        cur.execute('SELECT * FROM packageschema.package;')  # Adjust SQL query as needed
        rows = cur.fetchall()

        # Convert rows to JSON format
        package_data = [{'packageid': row[0], 'name': row[1], 'detail': row[2], 'price': row[3], 'online': row[4], 'postid': row[5]} for row in rows]

        cur.close()
        conn.close()

        return package_data
    except psycopg2.Error as e:
        print("Error fetching data from PostgreSQL:", e)
        return []

def fetch_package_by_id(package_id):
    try:
        conn = psycopg2.connect(**conn_params)
        cur = conn.cursor()

        cur.execute('SELECT * FROM packageschema.package WHERE packageid = %s;', (package_id,))
        row = cur.fetchone()

        cur.close()
        conn.close()

        if row:
            package_data = {'packageid': row[0], 'name': row[1], 'detail': row[2], 'price': row[3], 'online': row[4], 'postid': row[5]}
            return package_data
        else:
            return {'error': 'Package not found'}
    except psycopg2.Error as e:
        print("Error fetching data from PostgreSQL:", e)
        return {'error': 'Failed to fetch data from database'}
    
def create_new_package(name, detail, price, online, postid):
    try:
        conn = psycopg2.connect(**conn_params)
        cur = conn.cursor()

        post_id = request.args.get('postid')

        # Use the extracted post ID in your SQL query
        cur.execute('SELECT EXISTS(SELECT 1 FROM postschema.post WHERE postid = %s);', (post_id,))
        post_exists = cur.fetchone()[0]

        if not post_exists:
            return {'error': 'Post ID does not exist'}
        
        cur.execute('INSERT INTO packageschema.package (name, detail, price, online, postid) VALUES (%s, %s, %s, %s, %s) RETURNING packageid;', 
                    (name, detail, price, online, postid))
        new_package_id = cur.fetchone()[0]  # Get the ID of the newly inserted package

        conn.commit()
        cur.close()
        conn.close()

        return {'packageid': new_package_id, 'message': 'Package created successfully'}
    except psycopg2.Error as e:
        print("Error creating new package in PostgreSQL:", e)
        return {'error': 'Failed to create new package in database'}
    
def delete_package_by_id(package_id):
    try:
        conn = psycopg2.connect(**conn_params)
        cur = conn.cursor()

        # Execute the DELETE query
        cur.execute('DELETE FROM packageschema.package WHERE packageid = %s;', (package_id,))
        
        # Commit the transaction
        conn.commit()
        
        cur.close()
        conn.close()

        return {'message': 'Package deleted successfully'}
    except psycopg2.Error as e:
        print("Error deleting package from PostgreSQL:", e)
        return {'error': 'Failed to delete package from database'}
    
def update_package_by_id(package_id, updated_data):
    try:
        conn = psycopg2.connect(**conn_params)
        cur = conn.cursor()

        # Execute the UPDATE query with the updated data
        cur.execute('UPDATE packageschema.package SET name = %s, detail = %s, price = %s, online = %s, postid = %s WHERE packageid = %s;', 
                    (updated_data['name'], updated_data['detail'], updated_data['price'], updated_data['online'], updated_data['postid'], package_id))
        
        # Commit the transaction
        conn.commit()
        
        cur.close()
        conn.close()

        return {'message': 'Package updated successfully'}
    except psycopg2.Error as e:
        print("Error updating package in PostgreSQL:", e)
        return {'error': 'Failed to update package in database'}

@app.route('/packages', methods=['GET'])
def get_packages():
    package_data = fetch_all_packages()
    return jsonify(package_data)

@app.route('/packages/<int:package_id>', methods=['GET'])
def get_package_by_id(package_id):
    package_data = fetch_package_by_id(package_id)
    return jsonify(package_data)

@app.route('/packages', methods=['POST'])
def create_package():
    data = request.json
    name = data.get('name')
    detail = data.get('detail')
    price = data.get('price')
    online = data.get('online')
    postid = data.get('postid')
    result = create_new_package(name, detail, price, online, postid)
    return jsonify(result)

@app.route('/packages/<int:package_id>', methods=['DELETE'])
def delete_package(package_id):
    # Call the delete_package_by_id function with the package ID
    result = delete_package_by_id(package_id)
    return jsonify(result)

@app.route('/packages/<int:package_id>', methods=['PUT'])
def update_package(package_id):
    # Extract the updated data from the request body
    updated_data = request.json
    
    # Call the update_package_by_id function with the package ID and updated data
    result = update_package_by_id(package_id, updated_data)
    return jsonify(result)

if __name__ == '__main__':
    app.run(host = '0.0.0.0', port =  5000, debug = True)
