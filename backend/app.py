from flask import Flask, request, jsonify, session, send_from_directory, redirect, url_for
from flask_mysqldb import MySQL
import MySQLdb.cursors
import re
import os
from passlib.hash import bcrypt 
from flask_cors import CORS
from functools import wraps
from flask_mail import Mail, Message
import random
import string
import math
import locale
from payos import PaymentData, ItemData, PayOS
from dotenv import load_dotenv

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

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'ngodangtranhoan@gmail.com'  # Thay bằng địa chỉ email của bạn
app.config['MAIL_PASSWORD'] = 'pezj jetj ohwj cnnr'     # Thay bằng App Password
app.config['MAIL_DEFAULT_SENDER'] = ('PetGuardian', 'your-email@gmail.com')
app.config['MAIL_DEBUG'] = True  # Bật debug cho Flask-Mail

mail = Mail(app)

# Load environment variables from .env file
load_dotenv()

# Khởi tạo PayOS SDK
payos = PayOS(
    client_id=os.environ.get('PAYOS_CLIENT_ID'),
    api_key=os.environ.get('PAYOS_API_KEY'),
    checksum_key=os.environ.get('PAYOS_CHECKSUM_KEY')
)

# Thiết lập locale cho Việt Nam
locale.setlocale(locale.LC_ALL, 'vi_VN.UTF-8')

# === Hàm helper ===

def send_verification_email(to_email, verification_code):
    try:
        msg = Message("Pet Guardian - Mã xác thực",
                      sender=app.config['MAIL_DEFAULT_SENDER'],
                      recipients=[to_email])
        msg.body = f"Mã xác thực của bạn là: {verification_code}"
        mail.send(msg)
        print("Verification email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")

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

def format_currency(amount):
  """Định dạng số tiền thành VND."""
  amount = math.floor(amount / 1000) * 1000
  return locale.currency(amount, grouping=True, symbol=True)

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        role_id = data.get('role_id')
        
        # Kiểm tra dữ liệu đầu vào
        if not username or not password or not email:
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
                cursor.execute('INSERT INTO accounts (username, password, email, role_id) VALUES (%s, %s, %s, %s)', (username, hashed_pass, email, role_id))
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
                session['role_id'] = account['role_id']
                return jsonify({'message': 'Đăng nhập thành công', 'role_id': account['role_id']}), 200
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
    
@app.route('/api/pets/<int:pet_id>/allergies', methods=['POST'])
@login_required
def add_pet_allergy(pet_id):
    try:
        allergy = request.form.get('allergy')
        cause = request.form.get('cause')
        symptoms = request.form.get('symptoms')

        if not allergy or not cause or not symptoms:
            return jsonify({'message': 'Vui lòng điền đầy đủ thông tin'}), 400

        with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
            cursor.execute('INSERT INTO pet_allergies (pet_id, user_id, allergy, cause, symptoms) VALUES (%s, %s, %s, %s, %s)',
                           (pet_id, session['id'], allergy, cause, symptoms))
            mysql.connection.commit()

            # Lấy lại thông tin thú cưng (bao gồm cả dị ứng mới)
            cursor.execute('SELECT * FROM pets WHERE id = %s AND user_id = %s', (pet_id, session['id']))
            pet = cursor.fetchone()
            if not pet:
                return jsonify({'message': 'Không tìm thấy thú cưng'}), 404
            cursor.execute('SELECT * FROM pet_allergies WHERE pet_id = %s', (pet_id,))
            pet['allergies'] = cursor.fetchall()

        return jsonify(pet), 201
    except Exception as e:
        print(f"Lỗi thêm dị ứng: {e}")
        return jsonify({'message': 'Đã có lỗi xảy ra'}), 500


@app.route('/api/pets/<int:pet_id>/allergies/<int:allergy_id>', methods=['DELETE'])
@login_required
def delete_pet_allergy(pet_id, allergy_id):
    try:
        with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
            cursor.execute('DELETE FROM pet_allergies WHERE id = %s AND pet_id = %s AND user_id = %s', (allergy_id, pet_id, session['id']))
            mysql.connection.commit()

            # Lấy lại thông tin thú cưng (bao gồm cả danh sách dị ứng đã cập nhật)
            cursor.execute('SELECT * FROM pets WHERE id = %s AND user_id = %s', (pet_id, session['id']))
            pet = cursor.fetchone()
            if not pet:
                return jsonify({'message': 'Không tìm thấy thú cưng'}), 404
            cursor.execute('SELECT * FROM pet_allergies WHERE pet_id = %s', (pet_id,))
            pet['allergies'] = cursor.fetchall()

        return jsonify(pet), 200
    except Exception as e:
        print(f"Lỗi xóa dị ứng: {e}")
        return jsonify({'message': 'Đã có lỗi xảy ra'}), 500

@app.route('/api/forgot_password', methods=['POST'])
def forgot_password():
    try:
        data = request.get_json()
        email = data.get('email')

        if not email:
            return jsonify({'message': 'Vui lòng nhập địa chỉ email'}), 400

        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM accounts WHERE email = %s', (email,))
        account = cursor.fetchone()

        if account:
            verification_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6)) # Tạo mã xác thực ngẫu nhiên
            session['verification_code'] = verification_code # Lưu mã xác thực vào session
            session['email_to_reset'] = email # Lưu email vào session

            send_verification_email(email, verification_code) # Gửi email xác thực

            return jsonify({'message': 'Mã xác thực đã được gửi đến email của bạn'}), 200
        else:
            return jsonify({'message': 'Email không tồn tại'}), 404

    except Exception as e:
        print(f"Lỗi gửi mã xác thực: {e}")
        return jsonify({'message': 'Đã có lỗi xảy ra'}), 500

@app.route('/api/change_password', methods=['POST'])
def change_password():
    try:
        data = request.get_json()
        email = data.get('email')
        verification_code = data.get('verificationCode')
        new_password = data.get('newPassword')

        if not email or not verification_code or not new_password:
            return jsonify({'message': 'Vui lòng điền đầy đủ thông tin'}), 400

        if verification_code != session.get('verification_code') or email != session.get('email_to_reset'):
            return jsonify({'message': 'Mã xác thực không đúng'}), 400

        hashed_pass = hash_password(new_password)

        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('UPDATE accounts SET password = %s WHERE email = %s', (hashed_pass, email))
        mysql.connection.commit()

        return jsonify({'message': 'Đổi mật khẩu thành công'}), 200

    except Exception as e:
        print(f"Lỗi đổi mật khẩu: {e}")
        return jsonify({'message': 'Đã có lỗi xảy ra'}), 500

# === API endpoints cho products ===

@app.route('/api/products', methods=['GET'])
@login_required
def get_products():
    # Lấy danh sách tất cả sản phẩm (cho user)
    try:
        with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
            cursor.execute('SELECT p.*, c.username AS customer_name FROM products p JOIN accounts c ON p.customer_id = c.id') # Lấy thêm tên customer
            products = cursor.fetchall()

            for product in products:
                # Lấy danh sách hình ảnh của sản phẩm
                cursor.execute('SELECT image_url FROM product_images WHERE product_id = %s', (product['id'],))
                # Trả về mảng các chuỗi đường dẫn hình ảnh
                product['images'] = [row['image_url'] for row in cursor.fetchall()]
                product['price'] = format_currency(product['price'])
        return jsonify(products)
    except Exception as e:
        print(f"Lỗi lấy danh sách sản phẩm: {e}")
        return jsonify({'message': 'Đã có lỗi xảy ra'}), 500

@app.route('/api/products/<int:product_id>', methods=['GET'])
@login_required
def get_product(product_id):
    try:
        with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
            # Lấy thông tin sản phẩm
            cursor.execute('SELECT p.*, c.username AS customer_name, c.email AS customer_email FROM products p JOIN accounts c ON p.customer_id = c.id WHERE p.id = %s', (product_id,))
            product = cursor.fetchone()
            if not product:
                return jsonify({'message': 'Không tìm thấy sản phẩm'}), 404

            # Tăng lượt xem
            cursor.execute('UPDATE products SET views = views + 1 WHERE id = %s', (product_id,))
            mysql.connection.commit()

            # Lấy danh sách hình ảnh của sản phẩm
            cursor.execute('SELECT image_url, is_main FROM product_images WHERE product_id = %s', (product_id,))
            product['images'] = cursor.fetchall()
            product['price'] = format_currency(product['price'])

        return jsonify(product)
    except Exception as e:
        print(f"Lỗi lấy thông tin sản phẩm: {e}")
        return jsonify({'message': 'Đã có lỗi xảy ra'}), 500

@app.route('/api/products/my', methods=['GET'])
@login_required
def get_my_products():
    # Lấy danh sách sản phẩm của customer hiện tại
    try:
        if session['role_id'] != 3:  # Chỉ customer mới được phép truy cập
            return jsonify({'message': 'Bạn không có quyền truy cập'}), 403

        with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
            cursor.execute('SELECT * FROM products WHERE customer_id = %s', (session['id'],))
            products = cursor.fetchall()

            for product in products:
            # Lấy danh sách hình ảnh của sản phẩm
                cursor.execute('SELECT image_url FROM product_images WHERE product_id = %s', (product['id'],))
                # Trả về mảng các chuỗi đường dẫn hình ảnh
                product['images'] = [row['image_url'] for row in cursor.fetchall()] 
                product['price'] = format_currency(product['price'])

        return jsonify(products)
    except Exception as e:
        print(f"Lỗi lấy danh sách sản phẩm của customer: {e}")
        return jsonify({'message': 'Đã có lỗi xảy ra'}), 500

@app.route('/api/products', methods=['POST'])
@login_required
def add_product():
    try:
        if session['role_id'] not in (2, 3):  # Chỉ customer và admin mới được phép thêm sản phẩm
            return jsonify({'message': 'Bạn không có quyền thêm sản phẩm'}), 403

        name = request.form.get('name')
        description = request.form.get('description')
        price = request.form.get('price')
        images = request.files.getlist('images[]')
        quantity = request.form.get('quantity')

        if not name or not description or not price or not images or not quantity:
            return jsonify({'message': 'Vui lòng điền đầy đủ thông tin'}), 400

        # Lưu các hình ảnh vào thư mục uploads
        UPLOAD_PATH = os.path.abspath('../frontend/public/uploads')
        filenames = []
        for image in images:
            if not allowed_file(image.filename):
                return jsonify({'message': 'Định dạng ảnh không được phép'}), 400
            filename = image.filename
            image.save(os.path.join(UPLOAD_PATH, filename))
            filenames.append(filename)

        with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
            cursor.execute('INSERT INTO products (customer_id, name, description, price, quantity) VALUES (%s, %s, %s, %s, %s)',
                           (session['id'], name, description, price, quantity))
            product_id = cursor.lastrowid

            # Thêm thông tin hình ảnh vào bảng product_images
            if filenames:
                for i, filename in enumerate(filenames):
                    is_main = i == 0  # Hình ảnh đầu tiên là hình ảnh chính
                    cursor.execute('INSERT INTO product_images (product_id, image_url, is_main) VALUES (%s, %s, %s)', (product_id, filename, is_main))

            mysql.connection.commit()
        return jsonify({'message': 'Thêm sản phẩm thành công'}), 201
    except Exception as e:
        print(f"Lỗi thêm sản phẩm: {e}")
        return jsonify({'message': 'Đã có lỗi xảy ra'}), 500

@app.route('/api/products/<int:product_id>', methods=['PUT'])
@login_required
def update_product(product_id):
    # Cập nhật thông tin sản phẩm (cho customer và admin)
    try:
        # 1. Kiểm tra phân quyền: Chỉ customer và admin mới được phép sửa sản phẩm
        if session['role_id'] not in (2, 3):  
            return jsonify({'message': 'Bạn không có quyền sửa sản phẩm'}), 403

        # 2. Lấy dữ liệu từ request
        name = request.form.get('name')
        description = request.form.get('description')
        price = request.form.get('price')
        images = request.files.getlist('images[]') # Lấy danh sách hình ảnh
        quantity = request.form.get('quantity')

        # 3. Kiểm tra dữ liệu đầu vào
        if not name or not description or not price or not quantity:
            return jsonify({'message': 'Vui lòng điền đầy đủ thông tin'}), 400

        with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
            # 4. Kiểm tra quyền sở hữu sản phẩm: Chỉ cho phép sửa sản phẩm của chính mình hoặc nếu là admin
            cursor.execute('SELECT customer_id FROM products WHERE id = %s', (product_id,))
            product = cursor.fetchone()
            if not product or (product['customer_id'] != session['id'] and session['role_id'] != 2):
                return jsonify({'message': 'Bạn không có quyền sửa sản phẩm này'}), 403

            # 5. Cập nhật thông tin sản phẩm trong database
            update_fields = []
            update_values = []
            if name:
                update_fields.append('name = %s')
                update_values.append(name)
            if description:
                update_fields.append('description = %s')
                update_values.append(description)
            if price:
                update_fields.append('price = %s')
                update_values.append(price)
            if quantity:
                update_fields.append('quantity = %s')
                update_values.append(quantity)

            if update_fields:
                query = f"UPDATE products SET {', '.join(update_fields)} WHERE id = %s"
                update_values.append(product_id)
                cursor.execute(query, tuple(update_values))

            # 6. Xử lý hình ảnh: Xóa hình ảnh cũ (nếu có) và thêm hình ảnh mới
            if images:
                cursor.execute('DELETE FROM product_images WHERE product_id = %s', (product_id,))
                UPLOAD_PATH = os.path.abspath('../frontend/public/uploads')
                filenames = []
                for image in images:
                    if not allowed_file(image.filename):
                        return jsonify({'message': 'Định dạng ảnh không được phép'}), 400
                    filename = image.filename
                    image.save(os.path.join(UPLOAD_PATH, filename))
                    filenames.append(filename)
                
                if filenames:
                    for i, filename in enumerate(filenames):
                        is_main = i == 0  # Hình ảnh đầu tiên là hình ảnh chính
                        cursor.execute('INSERT INTO product_images (product_id, image_url, is_main) VALUES (%s, %s, %s)', (product_id, filename, is_main))

            mysql.connection.commit()

        return jsonify({'message': 'Cập nhật sản phẩm thành công'}), 200
    except Exception as e:
        print(f"Lỗi cập nhật sản phẩm: {e}")
        return jsonify({'message': 'Đã có lỗi xảy ra'}), 500

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
@login_required
def delete_product(product_id):
    # Xóa sản phẩm (cho customer và admin)
    try:
        # 1. Kiểm tra phân quyền: Chỉ customer và admin mới được phép xóa sản phẩm
        if session['role_id'] not in (2, 3):  
            return jsonify({'message': 'Bạn không có quyền xóa sản phẩm'}), 403

        with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
            # 2. Kiểm tra quyền sở hữu sản phẩm: Chỉ cho phép xóa sản phẩm của chính mình hoặc nếu là admin
            cursor.execute('SELECT customer_id FROM products WHERE id = %s', (product_id,))
            product = cursor.fetchone()
            if not product or (product['customer_id'] != session['id'] and session['role_id'] != 2):
                return jsonify({'message': 'Bạn không có quyền xóa sản phẩm này'}), 403

            # Xóa các giao dịch liên quan đến sản phẩm
            cursor.execute('DELETE FROM transactions WHERE product_id = %s', (product_id,))

            # 3. Xóa sản phẩm trong database
            cursor.execute('DELETE FROM products WHERE id = %s', (product_id,))
            mysql.connection.commit()

        return jsonify({'message': 'Xóa sản phẩm thành công'}), 200
    except Exception as e:
        print(f"Lỗi xóa sản phẩm: {e}")
        return jsonify({'message': 'Đã có lỗi xảy ra'}), 500

@app.route('/api/cart', methods=['GET'])
@login_required
def get_cart():
    try:
        with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
            cursor.execute('SELECT c.id AS cart_item_id, c.quantity, p.*  FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = %s', (session['id'],))
            cart_items = cursor.fetchall()
            for item in cart_items:
                cursor.execute('SELECT image_url FROM product_images WHERE product_id = %s', (item['id'],))
                item['images'] = [row['image_url'] for row in cursor.fetchall()]
        return jsonify(cart_items), 200
    except Exception as e:
        print(f"Lỗi lấy giỏ hàng: {e}")
        return jsonify({'message': 'Đã có lỗi xảy ra'}), 500

@app.route('/api/cart/add', methods=['POST'])
@login_required
def add_to_cart():
    try:
        data = request.get_json()
        product_id = data.get('product_id')
        quantity = data.get('quantity', 1)

        if not product_id:
            return jsonify({'message': 'Vui lòng cung cấp product_id'}), 400

        # Kiểm tra số lượng sản phẩm
        with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
            cursor.execute('SELECT quantity FROM products WHERE id = %s', (product_id,))
            product = cursor.fetchone()
            if not product:
                return jsonify({'message': 'Không tìm thấy sản phẩm'}), 404
            if product['quantity'] < quantity:
                return jsonify({'message': 'Số lượng sản phẩm không đủ'}), 400

        # Thêm sản phẩm vào bảng cart
        with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
            # Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
            cursor.execute('SELECT * FROM cart WHERE user_id = %s AND product_id = %s', (session['id'], product_id))
            existing_item = cursor.fetchone()

            if existing_item:
                # Nếu đã có, cập nhật số lượng
                new_quantity = existing_item['quantity'] + quantity
                cursor.execute('UPDATE cart SET quantity = %s WHERE id = %s', (new_quantity, existing_item['id']))
            else:
                # Nếu chưa có, thêm mới
                cursor.execute('INSERT INTO cart (user_id, product_id, quantity) VALUES (%s, %s, %s)', (session['id'], product_id, quantity))
            mysql.connection.commit()

        # Lấy giỏ hàng mới từ bảng cart
        with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
            cursor.execute('SELECT c.id AS cart_item_id, c.quantity, p.*  FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = %s', (session['id'],))
            cart_items = cursor.fetchall()
            for item in cart_items:
                cursor.execute('SELECT image_url FROM product_images WHERE product_id = %s', (item['id'],))
                item['images'] = [row['image_url'] for row in cursor.fetchall()]

        return jsonify({'message': 'Thêm sản phẩm vào giỏ hàng thành công', 'cart': cart_items}), 200 # Trả về giỏ hàng mới
    except Exception as e:
        print(f"Lỗi thêm sản phẩm vào giỏ hàng: {e}")
        return jsonify({'message': 'Đã có lỗi xảy ra'}), 500

@app.route('/api/cart/remove/<int:cart_item_id>', methods=['DELETE'])  # Sửa product_id thành cart_item_id
@login_required
def remove_from_cart(cart_item_id):
    try:
        # Xóa sản phẩm khỏi bảng cart
        with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
            cursor.execute('DELETE FROM cart WHERE id = %s AND user_id = %s', (cart_item_id, session['id'])) # Sử dụng cart_item_id để xóa
            mysql.connection.commit()

        return jsonify({'message': 'Xóa sản phẩm khỏi giỏ hàng thành công'}), 200
    except Exception as e:
        print(f"Lỗi xóa sản phẩm khỏi giỏ hàng: {e}")
        return jsonify({'message': 'Đã có lỗi xảy ra'}), 500

@app.route('/api/cart/update', methods=['PUT'])
@login_required
def update_cart():
    try:
        data = request.get_json()
        cart_item_id = data.get('cart_item_id') # Sử dụng cart_item_id
        quantity = data.get('quantity')

        if not cart_item_id or not quantity:
            return jsonify({'message': 'Vui lòng cung cấp cart_item_id và quantity'}), 400

        # Kiểm tra số lượng sản phẩm
        with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
            cursor.execute('SELECT p.quantity FROM products p JOIN cart c ON p.id = c.product_id WHERE c.id = %s', (cart_item_id,))
            product = cursor.fetchone()
            if not product:
                return jsonify({'message': 'Không tìm thấy sản phẩm'}), 404
            if product['quantity'] < quantity:
                return jsonify({'message': 'Số lượng sản phẩm không đủ'}), 400

        # Cập nhật số lượng trong bảng cart
        with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
            cursor.execute('UPDATE cart SET quantity = %s WHERE user_id = %s AND id = %s', (quantity, session['id'], cart_item_id))
            mysql.connection.commit()

        return jsonify({'message': 'Cập nhật giỏ hàng thành công'}), 200
    except Exception as e:
        print(f"Lỗi cập nhật giỏ hàng: {e}")
        return jsonify({'message': 'Đã có lỗi xảy ra'}), 500

@app.route('/api/cart/checkout', methods=['POST'])
@login_required
def checkout():
    domain = request.host_url  # Lấy domain từ request
    try:
        with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
            cursor.execute('SELECT * FROM cart WHERE user_id = %s', (session['id'],))
            cart_items = cursor.fetchall()
            print(f"cart_items: {cart_items}")
            if not cart_items:
                return jsonify({'message': 'Giỏ hàng trống'}), 400

            # Tính toán tổng tiền và kiểm tra số lượng sản phẩm
            total_amount = 0
            for item in cart_items:
                cursor.execute('SELECT * FROM products WHERE id = %s', (item['product_id'],))
                product = cursor.fetchone()
                if not product:
                    return jsonify({'message': f'Không tìm thấy sản phẩm có id {item["product_id"]}'}), 404
                if product['quantity'] < item['quantity']:
                    return jsonify({'message': f'Số lượng sản phẩm {product["name"]} không đủ'}), 400
                total_amount += product['price'] * item['quantity']
            print(f"total_amount: {total_amount}")
        # Tạo liên kết thanh toán PayOS
        payment_data = PaymentData(
            orderCode=random.randint(1000, 99999),
            amount=int(total_amount),
            description='Đơn hàng Pet Guardian',
            cancelUrl=f"{domain}cart",  # Chuyển hướng về trang giỏ hàng nếu hủy thanh toán
            returnUrl=f"{domain}api/payment/return"  # Chuyển hướng sau khi thanh toán thành công
        )
        print(f"orderCode: {random.randint(1000, 99999)}")
        print(f"amount: {int(total_amount)}")
        print(f"description: {'Đơn hàng Pet Guardian'}")
        print(f"cancelUrl: {f'{domain}cart'}")
        print(f"returnUrl: {f'{domain}api/payment/return'}")
        payos_payment = payos.createPaymentLink(payment_data)  # Tạo liên kết thanh toán
        print(f"payos_payment: {payos_payment.to_json()}")
        print(payos_payment)  # In ra response từ PayOS

        return jsonify(payos_payment.to_json()), 200  # Trả về JSON chứa checkout_url
    except Exception as e:
        print(f"Lỗi thanh toán: {e}")
        return jsonify({'message': 'Đã có lỗi xảy ra'}), 500

@app.route('/api/payment/return', methods=['GET'])
@login_required
def payment_return():
    try:
        payment_id = request.args.get('payment_id')

        # Lấy thông tin thanh toán từ PayOS
        payment = payos.get_payment(payment_id)

        if payment.state == 'completed':
            # Xử lý thanh toán thành công
            with mysql.connection.cursor(MySQLdb.cursors.DictCursor) as cursor:
                for item in payment.items:
                    # Tạo bản ghi giao dịch
                    cursor.execute('INSERT INTO transactions (user_id, product_id, quantity, amount, status, transaction_date) VALUES (%s, %s, %s, %s, %s, NOW())',
                                   (session['id'], item.id, item.quantity, item.amount, 'completed'))

                    # Cập nhật số lượng sản phẩm
                    cursor.execute('UPDATE products SET quantity = quantity - %s, sales = sales + %s WHERE id = %s', (item.quantity, item.quantity, item.id))

                # Xóa giỏ hàng trong database
                cursor.execute('DELETE FROM cart WHERE user_id = %s', (session['id'],)) 
                mysql.connection.commit()

            return jsonify({'message': 'Thanh toán thành công'}), 200
        else:
            # Xử lý thanh toán thất bại
            return jsonify({'message': 'Thanh toán thất bại'}), 400
    except Exception as e:
        print(f"Lỗi xử lý kết quả thanh toán: {e}")
        return jsonify({'message': 'Đã có lỗi xảy ra'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)