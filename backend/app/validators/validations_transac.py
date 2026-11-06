from datetime import datetime

REQUIRED_FIELDS = ['amount','description','category']
FIELDS_CATEGORY =['Food','Personal','Others','Utilities','Transportation']

def validate_transaction_id(transaction_id):
    errors = {}

    if transaction_id <=0:
       errors["transaction_id"] = "ID must be greater than 0"

    return errors

def validate_dict(data):
    errors={}
    if not isinstance(data,dict):
       errors["data"] = "Invalid data type.Expected JSON body"

    return errors

def validate_fields(data):
    errors={}
    for field in REQUIRED_FIELDS:
        if field not in data:
          errors[field] = f"Missing field {field}"
        else:
           if field == 'amount':
               if not isinstance(data['amount'],(int,float)):
                 errors["amount"] = "Field amount must be integer or decimal"
               elif data['amount'] <= 0:
                 errors["amount"] = "Invalid field amount.Must be greater than 0"
               else:
                  parts = str(data['amount']).split(".")
                  integers = parts[0].replace("-","")
                  decimals = parts[1] if len(parts) > 1 else ""

                  if len(integers) > 10 or len(decimals) > 2:
                     errors["amount"] = "Invalid field amount.Maximum of 10 integer digits and 2 decimals expected"
           elif field == 'description':
               if not isinstance(data['description'],str):
                 errors["description"] = "Invalid field description.Must be string"
           elif field == 'category':
               if data['category'] not in FIELDS_CATEGORY:
                 errors["category"] = "Category must be one of: Food,Personal,Utilities,Transportation,Others"

    return errors

def validate_date(date_param):
   if not date_param:
      return False

   try:
      datetime.strptime(date_param,"%Y-%m")
      return True
   except ValueError:
      return False

def validate_year(year_param):
   if not year_param:
      return False

   try:
      datetime.strptime(year_param,"%Y")
      return True
   except ValueError:
      return False

def validate_pages(pages,per_page):
    errors={}
    if per_page <= 0:
         errors["per_page"] = "The per_page must be greater than 0"
    elif per_page > 50:
         errors["per_page"] = "The per_page limit must be less than 50"

    if pages <= 0:
       errors["pages"] = "The page must be greater than 0"

    return errors