REQUIRED_FIELDS = ['user_id','amount','description','type','category']
FIELDS_CATEGORY =['Food','Personal','Others','Utilities','Transportation']

def validate_transaction_id(transaction_id):
    errors = []
    if not isinstance(transaction_id, int):
       errors.append("Invalid Id must be int")
    elif transaction_id <=0:
       errors.append("Id must be greater than 0")

    return errors

def validate_dict(data):
    errors=[]
    if not isinstance(data,dict):
       errors.append("Invalid data type.Expected a dictionary")

    return errors

def validate_fields(data):
    errors=[]
    for field in REQUIRED_FIELDS:
        if field not in data:
          errors.append(f"Missing field {field}")
        else:
           if field == 'user_id':
               if not isinstance(data['user_id'],int):
                 errors.append("Id must be int")
               elif data['user_id'] <= 0:
                 errors.append("Id must be greater than 0")
           elif field == 'amount':
               if not isinstance(data['amount'],(int,float)):
                 errors.append("Field amount must be int or decimal")
               elif data['amount'] <= 0:
                 errors.append("Invalid field amount.Must be greater than 0")
               else:
                  parts = str(data['amount']).split(".")
                  integers = parts[0].replace("-","")
                  decimals = parts[1] if len(parts) > 1 else ""

                  if len(integers) > 10 or len(decimals) > 2:
                     errors.append('Invalid field amount.Maximum of 10 integer digits and 2 decimals expected') 
           elif field == 'description':
               if not isinstance(data['description'],str):
                 errors.append('Invalid field description.Must be string')
           elif field == 'type':
               if data['type'] != 'income' and data['type'] != 'expense':
                 errors.append('Type must be one of: income, expense')
           elif field == 'category':
               if data['category'] not in FIELDS_CATEGORY:
                 errors.append('Category must be one of: Food,Personal,Others,Utilities,Transportation')

    return errors