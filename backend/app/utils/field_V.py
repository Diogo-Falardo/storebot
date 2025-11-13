"field validators file"
import re
from typing import Optional
# external libs
from email_validator import validate_email, EmailNotValidError
# utils: exceptions
from app.utils.exceptions import THROW_ERROR

# email
def vEmail(value: Optional[str]) -> str:
    if value is None:
        THROW_ERROR("Email cannot be blank.", 400)
    if not isinstance(value, str):
        THROW_ERROR("Email is not in correct format", 400)

    email = value.strip()
    if not email:
        THROW_ERROR("Email cannot be blank.", 400)
    
    try: 
        email = validate_email(email, check_deliverability=True)
        return email.normalized
    except EmailNotValidError as e:
        THROW_ERROR(f"Invalid email: {str(e)}", 400)
# password
def vPassword(value: Optional[str])-> str:
    if value is None:
        THROW_ERROR("Password cannot be blank.", 400)
    if not isinstance(value, str):
        THROW_ERROR("Password is not in the correct format", 400)

    password = value.strip()
    if not password:
        THROW_ERROR("Password cannot be blank.", 400)
 
    if len(password) < 6:
        THROW_ERROR("Password is to short!", 400)
    if len(password) > 128:
        THROW_ERROR("Password is to long!", 400)
    
    password_pattern = r"^(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).{6,}$"
    if not re.match(password_pattern, password):
        THROW_ERROR("Passowrd need at least 6 characters, 1 letter upercase, 1 lowercase and 1 simbol!", 400)

    return password


    
        