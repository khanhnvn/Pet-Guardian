from flask import Flask, request, jsonify, session, send_from_directory, redirect, url_for
from flask_mysqldb import MySQL
import MySQLdb.cursors
import re
import os
from passlib.hash import bcrypt 
from flask_cors import CORS
from functools import wraps

app = Flask(__name__, static_folder='../frontend/public')
app.secret_key = 'your secret key' 

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '123456' 
app.config['MYSQL_DB'] = 'geeklogin'

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

CORS(app)

mysql = MySQL(app)

# === Hàm helper ===

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'loggedin' in session:
            return f(*args, **kwargs)
        return jsonify({'message': 'Bạn cần đăng nhập'}), 401
    return decorated_function

def hash_password(password):
    return bcrypt.hash(password)

def verify_password(password, hashed_password):
    return bcrypt.verify(password, hashed_password)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        user_type = data.get('user_type')
        
        # Kiểm tra dữ liệu đầu vào
        if not username or not password or not email or not user_type:
            return jsonify({'message': 'Vui lòng điền đầy đủ thông tin'}), 400
        if not re.match(r'[^@]+@[^@]+\.[^@]+', email):
            return jsonify({'message': 'Email không hợp lệ'}), 400
        if not re.match(r'[A-Za-z0-9]+', username):
            return jsonify({'message': 'Tên đăng nhập chỉ được chứa chữ cái và số'}), 400

        hashed_pass = hash_password(password)

        with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
            cursor.execute('SELECT * FROM accounts WHERE username = %s', (username,))
            account = cursor.fetchone()
            if account:
                return jsonify({'message': 'Tài khoản đã tồn tại'}), 409
            else:
                cursor.execute('INSERT INTO accounts (username, password, email, user_type) VALUES (%s, %s, %s, %s)', (username, hashed_pass, email, user_type))
                mysql.connection.commit()
                return jsonify({'message': 'Đăng ký thành công'}), 201
    except Exception as e:
        print(f"Lỗi đăng ký: {e}")
        return jsonify({'message': f'Đã có lỗi xảy ra: {str(e)}'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')  # Sử dụng email
        password = data.get('password')

        if not email or not password:
            return jsonify({'message': 'Vui lòng điền đầy đủ thông tin'}), 400

        with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
            cursor.execute('SELECT * FROM accounts WHERE email = %s', (email,))  # Sử dụng email
            account = cursor.fetchone()

            if account and verify_password(password, account['password']):
                # Đăng nhập thành công
                session['loggedin'] = True
                session['id'] = account['id']
                session['email'] = account['email']  # Sử dụng email
                return jsonify({'message': 'Đăng nhập thành công', 'user_type': account['user_type']}), 200
            else:
                # Sai email hoặc mật khẩu
                return jsonify({'message': 'Sai email hoặc mật khẩu'}), 401

    except Exception as e:
        print(f"Lỗi đăng nhập: {e}")
        return jsonify({'message': 'Đã có lỗi xảy ra'}), 500

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/api/pets', methods=['POST'])
@login_required
def add_pet():
    # Lấy dữ liệu từ form
    pet_name = request.form.get('pet_name')
    pet_type = request.form.get('pet_type')
    pet_age = request.form.get('pet_age')
    pet_birthday = request.form.get('pet_birthday')
    pet_gender = request.form.get('pet_gender')
    pet_color = request.form.get('pet_color')
    pet_image = request.files.get('pet_image')

    # Kiểm tra dữ liệu đầu vào
    if not pet_name or not pet_type or not pet_image:
        return jsonify({'message': 'Vui lòng điền đầy đủ thông tin'}), 400
    if not allowed_file(pet_image.filename):
        return jsonify({'message': 'Định dạng ảnh không được phép'}), 400

    # Lưu ảnh vào thư mục uploads
    UPLOAD_PATH = os.path.abspath('../frontend/public/uploads')
    filename = pet_image.filename
    pet_image.save(os.path.join(UPLOAD_PATH, filename))

    # Thêm thú cưng vào database
    user_id = session['id']
    try:
        with mysql.connection.cursor() as cursor:
            cursor.execute('INSERT INTO pets (user_id, pet_name, pet_type, pet_age, pet_birthday, pet_gender, pet_color, pet_image) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)',
                            (user_id, pet_name, pet_type, pet_age, pet_birthday, pet_gender, pet_color, filename))
            mysql.connection.commit()
        return jsonify({'message': 'Thêm thú cưng thành công'}), 201
    except Exception as e:
        print(f"Lỗi thêm thú cưng: {e}")
        return jsonify({'message': 'Đã có lỗi xảy ra'}), 500
    
@app.route('/api/pets', methods=['GET'])
@login_required
def get_pets():
    user_id = session['id']
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute('SELECT * FROM pets WHERE user_id = %s', (user_id,))
    pets = cursor.fetchall()
    return jsonify(pets)

@app.route('/api/pets/<int:pet_id>', methods=['DELETE'])
@login_required
def delete_pet(pet_id):
    try:
        with mysql.connection.cursor() as cursor:
            # Xóa thú cưng khỏi database
            cursor.execute('DELETE FROM pets WHERE id = %s AND user_id = %s', (pet_id, session['id']))
            mysql.connection.commit()
        return jsonify({'message': 'Xóa thú cưng thành công'}), 200
    except Exception as e:
        print(f"Lỗi xóa thú cưng: {e}")
        return jsonify({'message': 'Đã có lỗi xảy ra'}), 500

@app.route('/api/pets/<int:pet_id>', methods=['PATCH'])
@login_required
def update_pet(pet_id):
    try:
        data = request.get_json()
        pet_name = data.get('pet_name')
        pet_type = data.get('pet_type')
        pet_age = data.get('pet_age')
        pet_birthday = data.get('pet_birthday')
        pet_gender = data.get('pet_gender')
        pet_color = data.get('pet_color')

        with mysql.connection.cursor() as cursor:
            # Cập nhật thông tin thú cưng trong database
            query = "UPDATE pets SET pet_name = %s, pet_type = %s, pet_age = %s, pet_birthday = %s, pet_gender = %s, pet_color = %s WHERE id = %s AND user_id = %s"
            values = (pet_name, pet_type, pet_age, pet_birthday, pet_gender, pet_color, pet_id, session['id'])
            cursor.execute(query, values)
            mysql.connection.commit()
        return jsonify({'message': 'Cập nhật thú cưng thành công'}), 200
    except Exception as e:
        print(f"Lỗi cập nhật thú cưng: {e}")
        return jsonify({'message': 'Đã có lỗi xảy ra'}), 500

@app.route('/api/pets/<int:pet_id>', methods=['GET'])
@login_required
def get_pet_details(pet_id):
    try:
        with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
            # Lấy thông tin thú cưng
            cursor.execute('SELECT * FROM pets WHERE id = %s AND user_id = %s', (pet_id, session['id']))
            pet = cursor.fetchone()

            if not pet:
                return jsonify({'message': 'Không tìm thấy thú cưng'}), 404

            # Lấy thông tin cân nặng
            cursor.execute('SELECT * FROM pet_weight WHERE pet_id = %s', (pet_id,))
            pet['weights'] = cursor.fetchall()

            # Lấy thông tin vắc xin
            cursor.execute('SELECT * FROM pet_vaccines WHERE pet_id = %s', (pet_id,))
            pet['vaccines'] = cursor.fetchall()

            # Lấy thông tin thuốc
            cursor.execute('SELECT * FROM pet_medications WHERE pet_id = %s', (pet_id,))
            pet['medications'] = cursor.fetchall()

            # Lấy thông tin dị ứng
            cursor.execute('SELECT * FROM pet_allergies WHERE pet_id = %s', (pet_id,))
            pet['allergies'] = cursor.fetchall()

        return jsonify(pet)
    except Exception as e:
        print(f"Lỗi lấy thông tin chi tiết thú cưng: {e}")
        return jsonify({'message': 'Đã có lỗi xảy ra'}), 500

# === Route thêm cân nặng ===

@app.route('/api/pets/<int:pet_id>/weight', methods=['POST'])
@login_required
def add_pet_weight(pet_id):
    try:
        weight = request.form.get('weight')
        date_recorded = request.form.get('date_recorded')

        if not weight or not date_recorded:
            return jsonify({'message': 'Vui lòng điền đầy đủ thông tin'}), 400

        with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
            cursor.execute('INSERT INTO pet_weight (pet_id, user_id, weight, date_recorded) VALUES (%s, %s, %s, %s)',
                           (pet_id, session['id'], weight, date_recorded))
            mysql.connection.commit()

            # Lấy thông tin pet đã cập nhật
            cursor.execute('SELECT * FROM pets WHERE id = %s AND user_id = %s', (pet_id, session['id']))
            pet = cursor.fetchone()

            # Lấy thông tin cân nặng
            cursor.execute('SELECT * FROM pet_weight WHERE pet_id = %s', (pet_id,))
            pet['weights'] = cursor.fetchall()

        return jsonify(pet), 201
    except Exception as e:
        print(f"Lỗi thêm cân nặng cho thú cưng: {e}")
        return jsonify({'message': 'Đã có lỗi xảy ra'}), 500

# === Route xóa cân nặng ===

@app.route('/api/pets/<int:pet_id>/weight/<int:weight_id>', methods=['DELETE'])
@login_required
def delete_pet_weight(pet_id, weight_id):
    try:
        with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
            # Xóa bản ghi cân nặng
            cursor.execute('DELETE FROM pet_weight WHERE id = %s AND pet_id = %s AND user_id = %s', (weight_id, pet_id, session['id']))
            mysql.connection.commit()

            # Lấy thông tin pet đã cập nhật
            cursor.execute('SELECT * FROM pets WHERE id = %s AND user_id = %s', (pet_id, session['id']))
            pet = cursor.fetchone()

            # Lấy thông tin cân nặng
            cursor.execute('SELECT * FROM pet_weight WHERE pet_id = %s', (pet_id,))
            pet['weights'] = cursor.fetchall()

        return jsonify(pet), 200
    except Exception as e:
        print(f"Lỗi xóa cân nặng cho thú cưng: {e}")
        return jsonify({'message': 'Đã có lỗi xảy ra'}), 500
    
@app.route('/api/pets/<int:pet_id>/vaccines', methods=['POST'])
@login_required
def add_pet_vaccine(pet_id):
    try:
        vaccine_name = request.form.get('vaccine_name')
        dosage = request.form.get('dosage')
        date_administered = request.form.get('date_administered')

        if not vaccine_name or not dosage or not date_administered:
            return jsonify({'message': 'Vui lòng điền đầy đủ thông tin'}), 400

        with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
            cursor.execute('INSERT INTO pet_vaccines (pet_id, user_id, vaccine_name, dosage, date_administered) VALUES (%s, %s, %s, %s, %s)',
                           (pet_id, session['id'], vaccine_name, dosage, date_administered))
            mysql.connection.commit()

            # Lấy lại thông tin thú cưng (bao gồm cả vắc xin mới)
            cursor.execute('SELECT * FROM pets WHERE id = %s AND user_id = %s', (pet_id, session['id']))
            pet = cursor.fetchone()
            if not pet:
                return jsonify({'message': 'Không tìm thấy thú cưng'}), 404
            cursor.execute('SELECT * FROM pet_vaccines WHERE pet_id = %s', (pet_id,))
            pet['vaccines'] = cursor.fetchall()

        return jsonify(pet), 201
    except Exception as e:
        print(f"Lỗi thêm vắc xin: {e}")
        return jsonify({'message': 'Đã có lỗi xảy ra'}), 500


@app.route('/api/pets/<int:pet_id>/vaccines/<int:vaccine_id>', methods=['DELETE'])
@login_required
def delete_pet_vaccine(pet_id, vaccine_id):
    try:
        with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
            cursor.execute('DELETE FROM pet_vaccines WHERE id = %s AND pet_id = %s AND user_id = %s', (vaccine_id, pet_id, session['id']))
            mysql.connection.commit()

            # Lấy lại thông tin thú cưng (bao gồm cả danh sách vắc xin đã cập nhật)
            cursor.execute('SELECT * FROM pets WHERE id = %s AND user_id = %s', (pet_id, session['id']))
            pet = cursor.fetchone()
            if not pet:
                return jsonify({'message': 'Không tìm thấy thú cưng'}), 404
            cursor.execute('SELECT * FROM pet_vaccines WHERE pet_id = %s', (pet_id,))
            pet['vaccines'] = cursor.fetchall()

        return jsonify(pet), 200
    except Exception as e:
        print(f"Lỗi xóa vắc xin: {e}")
        return jsonify({'message': 'Đã có lỗi xảy ra'}), 500
    
@app.route('/api/pets/<int:pet_id>/medications', methods=['POST'])
@login_required
def add_pet_medication(pet_id):
    try:
        medication_name = request.form.get('medication_name')
        dosage = request.form.get('dosage')
        date_administered = request.form.get('date_administered')

        if not medication_name or not dosage or not date_administered:
            return jsonify({'message': 'Vui lòng điền đầy đủ thông tin'}), 400

        with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
            cursor.execute('INSERT INTO pet_medications (pet_id, user_id, medication_name, dosage, date_administered) VALUES (%s, %s, %s, %s, %s)',
                           (pet_id, session['id'], medication_name, dosage, date_administered))
            mysql.connection.commit()

            # Lấy lại thông tin thú cưng (bao gồm cả thuốc mới)
            cursor.execute('SELECT * FROM pets WHERE id = %s AND user_id = %s', (pet_id, session['id']))
            pet = cursor.fetchone()
            if not pet:
                return jsonify({'message': 'Không tìm thấy thú cưng'}), 404
            cursor.execute('SELECT * FROM pet_medications WHERE pet_id = %s', (pet_id,))
            pet['medications'] = cursor.fetchall()

        return jsonify(pet), 201
    except Exception as e:
        print(f"Lỗi thêm thuốc: {e}")
        return jsonify({'message': 'Đã có lỗi xảy ra'}), 500


@app.route('/api/pets/<int:pet_id>/medications/<int:medication_id>', methods=['DELETE'])
@login_required
def delete_pet_medication(pet_id, medication_id):
    try:
        with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
            cursor.execute('DELETE FROM pet_medications WHERE id = %s AND pet_id = %s AND user_id = %s', (medication_id, pet_id, session['id']))
            mysql.connection.commit()

            # Lấy lại thông tin thú cưng (bao gồm cả danh sách thuốc đã cập nhật)
            cursor.execute('SELECT * FROM pets WHERE id = %s AND user_id = %s', (pet_id, session['id']))
            pet = cursor.fetchone()
            if not pet:
                return jsonify({'message': 'Không tìm thấy thú cưng'}), 404
            cursor.execute('SELECT * FROM pet_medications WHERE pet_id = %s', (pet_id,))
            pet['medications'] = cursor.fetchall()

        return jsonify(pet), 200
    except Exception as e:
        print(f"Lỗi xóa thuốc: {e}")
        return jsonify({'message': 'Đã có lỗi xảy ra'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)