import re
import string

FIELDS_USER = ['first_name','last_name','email','username','password']
FIELDS_LOGIN = ['username','password']
EMAIL_REGEX = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

def validate_dict(data):
    errors={}
    if not isinstance(data,dict):
       errors["data"] = "Invalid data type.Expected JSON body"

    return errors

def validation_fields_register(data):
   errors = {}

   for field in FIELDS_USER:
      if not field in data:
         errors[field] = f"The field {field} is required"
         continue

      if field == 'first_name':
         if not isinstance(data[field],str):
            errors["first_name"] = "The field First Name must be string"
      if field == 'last_name':
         if not isinstance(data[field],str):
            errors["last_name"] = "The field Last Name must be string"
      if field == 'email':
         if not isinstance(data[field],str):
            errors["email"] = "The field Email must be string"
         elif not re.match(EMAIL_REGEX,data[field]):
            errors["email"] = "The field Email must have format of email"
      if field == 'username':
         if not isinstance(data[field],str):
            errors["username"] = "The field Username must be string"
      if field == 'password':
         if not isinstance(data[field],str):
            errors["password"] = "The field Password must be string"

         password = data[field].strip()

         has_number = False
         has_sign = False
         has_capital_letter = False

         for caracter in password:
            if caracter.isdigit():
               has_number = True
            elif caracter.isupper():
               has_capital_letter = True
            elif caracter in string.punctuation:
               has_sign = True

         if not has_number:
            errors["password"] = "The Password must have one number"
         elif not has_capital_letter:
            errors["password"] = "The Password must have one capital letter"
         elif not has_sign:
            errors["password"] = "The Password must have one sign of puntuation"

         if len(password) > 16:
            errors["message"] = "The Password only accepted maximun 16 caracters"

   return errors

def validation_login(data):
   errors = {}

   for field in FIELDS_LOGIN:
      if not field in data:
         errors[field] = f"The field {field} is required"
         continue

      if field == 'username':
         if not isinstance(data[field],str):
            errors["username"] = "The field username must be string"

      if field == 'password':
         if not isinstance(data[field],str):
            errors["password"] = "The field password must be string"

   return errors