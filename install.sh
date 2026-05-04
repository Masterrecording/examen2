#nest new examen2
#cd examen2

# Módulos
nest g module auth
nest g controller auth
nest g service auth

nest g module users
nest g controller users
nest g service users

nest g module products
nest g module orders

nest g guard auth
nest g guard roles

# Dependencias
npm install @nestjs/typeorm typeorm mysql2
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install bcrypt
npm install class-validator class-transformer
npm install @nestjs/swagger swagger-ui-express

npm i -D @types/bcrypt
