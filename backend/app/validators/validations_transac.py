from datetime import datetime

REQUIRED_FIELDS = ['user_id','amount','description','category']
FIELDS_CATEGORY =['Food','Personal','Others','Utilities','Transportation']

def validate_transaction_id(transaction_id):
    errors = {}

    if transaction_id <=0:
       errors["message"] = "ID must be greater than 0"

    return errors

def validate_dict(data):
    errors={}
    if not isinstance(data,dict):
       errors["message"] = "Invalid data type.Expected JSON body"

    return errors

def validate_fields(data):
    errors={}
    for field in REQUIRED_FIELDS:
        if field not in data:
          errors["message"] = f"Missinf field {field}"
        else:
           if field == 'user_id':
               if data['user_id'] <= 0:
                 errors["message"] = "ID must be greater than 0"
           elif field == 'amount':
               if not isinstance(data['amount'],(int,float)):
                 errors["message"] = "Field amount must be integer or decimal"
               elif data['amount'] <= 0:
                 errors["message"] = "Invalid field amount.Must be greater than 0"
               else:
                  parts = str(data['amount']).split(".")
                  integers = parts[0].replace("-","")
                  decimals = parts[1] if len(parts) > 1 else ""

                  if len(integers) > 10 or len(decimals) > 2:
                     errors["message"] = "Invalid field amount.Maximum of 10 integer digits and 2 decimals expected"
           elif field == 'description':
               if not isinstance(data['description'],str):
                 errors["message"] = "Invalid field description.Must be string"
           elif field == 'category':
               if data['category'] not in FIELDS_CATEGORY:
                 errors["message"] = "Category must be one of: Food,Personal,Utilities,Transportation,Others"

    return errors

def validate_date(date_param):
   if not date_param:
      return False

   try:
      datetime.strptime(date_param,"%Y-%m")
      return True
   except ValueError:
      return False