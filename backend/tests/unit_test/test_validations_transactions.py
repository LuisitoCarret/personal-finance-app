import pytest

from app.validators.validations_transac import validate_transaction_id, validate_dict,validate_fields,validate_year,validate_pages,validate_date

def valid_transaction():
    data = {
        "id": 5,
        "amount":200,
        "description":"Buy a book",
        "category":"Personal"
    }
    return data

def test_validate_id_no_errors():
    data = valid_transaction()
    transac_id = data["id"]
    errors = validate_transaction_id(transac_id)
    assert errors == {}

@pytest.mark.parametrize("id_bad_value",[-2,0])
def test_validate_id_errors(id_bad_value):
    data = valid_transaction()
    data["id"] = id_bad_value
    errors = validate_transaction_id(data["id"])
    assert "transaction_id" in errors

def test_validate_dict_no_errors():
    data = valid_transaction()
    errors = validate_dict(data)
    assert errors == {}

@pytest.mark.parametrize("bad_value",["is a test",[],21312,True,None])
def test_validate_dict_errors(bad_value):
    errors = validate_dict(bad_value)
    assert "data" in errors

@pytest.mark.parametrize("field",["amount","description","category"])
def test_validate_field_missing_field_errors(field):
    data = valid_transaction()
    data.pop(field)
    errors = validate_fields(data)
    assert field in errors

@pytest.mark.parametrize("value_error,expected_error",[
    ("hello","Field amount must be integer or decimal"),
    (-23,"Invalid field amount.Must be greater than 0"),
    (0,"Invalid field amount.Must be greater than 0"),
    (12345678901.12,"Invalid field amount.Maximum of 10 integer digits and 2 decimals expected"),
    (1234.123,"Invalid field amount.Maximum of 10 integer digits and 2 decimals expected")
])
def test_validate_field_amount_errors(value_error,expected_error):
    data = valid_transaction()
    data["amount"] = value_error
    errors = validate_fields(data)
    assert "amount" in errors
    assert errors["amount"] == expected_error

@pytest.mark.parametrize("bad_value",[34342,True,None])
def test_validate_field_description_errors(bad_value):
    data = valid_transaction()
    data["description"] = bad_value
    errors = validate_fields(data)
    assert "description" in errors

@pytest.mark.parametrize("category",["School","Work","Family"])
def test_validate_field_category_errors(category):
    data = valid_transaction()
    data["category"] = category
    errors = validate_fields(data)
    assert "category" in errors

@pytest.mark.parametrize("valid_date", ["2026-11","1999-01","2030-12"])
def test_validate_date_no_errors(valid_date):
    data = validate_date(valid_date)
    assert data is True

@pytest.mark.parametrize("invalid_date",["",None,"2026/11","11-2026","2026-13","2026-00","26-11","2026-11-05","text","2026-1"])
def test_validate_date_errors(invalid_date):
    data = validate_date(invalid_date)
    assert data is False

@pytest.mark.parametrize("valid_year", ["2026","2025"])
def test_validate_year_no_errors(valid_year):
    data = validate_year(valid_year)
    assert data is True

@pytest.mark.parametrize("invalid_year",["",None,"text","11-2026","20a","20265"])
def test_validate_date_errors(invalid_year):
    data = validate_year(invalid_year)
    assert data is False

@pytest.mark.parametrize("valid_page,valid_per_page",[(1,10),(5,40)])
def test_validate_page__no_errors(valid_page,valid_per_page):
    errors = validate_pages(valid_page,valid_per_page)
    assert errors == {}

@pytest.mark.parametrize("invalid_page,invalid_per_page",[(0,0),(-2,100)])
def test_validate_page_errors(invalid_page,invalid_per_page):
    errors = validate_pages(invalid_page,invalid_per_page)
    assert "pages" in errors
    assert "per_page" in errors

def test_validate_pages_errors():
    errors = validate_pages(pages=0,per_page=-4)
    assert "pages" in errors
    assert "per_page" in errors
    assert errors["pages"] == "The page must be greater than 0"
    assert errors["per_page"] == "The per_page must be greater than 0"