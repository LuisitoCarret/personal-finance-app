import pytest
from app.validators.validations_user import validate_dict,validation_fields_register,validation_login

def valid_register_data():
    data = {
    "first_name":"Test",
    "last_name":"Unit",
    "email":"test@gmail.com",
    "username":"testunit",
    "password":"firstTes1."
   }
    return data 

def valid_login():
    data ={
        "username":"Marcus",
        "password":"Passw0rd."
    }
    return data

def test_validate_dict_no_errors():
    valid_data = valid_register_data()
    errors = validate_dict(valid_data)
    assert errors == {}

@pytest.mark.parametrize("bad_value",["is a test",[],21312,True,None])
def test_validate_dict_errors(bad_value):
    errors = validate_dict(bad_value)
    assert "data" in errors

def test_validate_fields_register_no_errors():
  data = valid_register_data()
  errors = validation_fields_register(data)
  assert errors == {}

@pytest.mark.parametrize("field",["first_name","last_name","email","username","password"])
def test_validate_fields_register_missing_field_errors(field):
    valid_data = valid_register_data()
    valid_data.pop(field)
    errors = validation_fields_register(valid_data)
    assert field in errors

@pytest.mark.parametrize("field,value_error",[
   ("first_name",123),
   ("last_name",None),
   ("email",None),
   ("username",21323),
   ("password",123),
])
def test_validate_type_fields_errors(field,value_error):
    data = valid_register_data()
    data[field] = value_error
    errors = validation_fields_register(data)
    assert field in errors

@pytest.mark.parametrize("value_error",["testemailgmail.com","testemail@gmial.com","testemail@gmail","@gmail.com"])
def test_validation_type_email_errors(value_error):
    data = valid_register_data()
    data["email"] = value_error
    errors = validation_fields_register(data)
    assert "email" in errors

@pytest.mark.parametrize("value_error,expected_error",[
("kasdfhjl123tyAWPP.","The Password only accepted maximun 16 caracters"),
("rtwewetr","The Password must have one number"),
("12323213","The Password must have one capital letter"),
("ValidP1ss","The Password must have one sign of puntuation")])
def test_validation_length_password_errors(value_error,expected_error):
    data = valid_register_data()
    data["password"] = value_error
    errors = validation_fields_register(data)
    assert "password" in errors
    assert errors["password"] == expected_error

@pytest.mark.parametrize("field",["username","password"])
def test_validation_login_missing_field_error(field):
    data = valid_login()
    data.pop(field)
    errors = validation_login(data)
    assert field in errors

@pytest.mark.parametrize("field,value_error",[
    ("username",2737373),
    ("password",398922)
])
def test_validation_login_type_field_errors(field,value_error):
    data = valid_login()
    data[field] = value_error
    errors = validation_login(data)
    assert field in errors

def test_validation_login_no_errors():
    data = valid_login()
    errors = validation_login(data)
    assert errors == {}