"field validators file"
import re
from pydantic import HttpUrl
from typing import Optional
from decimal import Decimal
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
# id
def vID(id: Optional[int]) -> int:
    if id is None:
        THROW_ERROR("Invalid ID", 400)

    try:
        id = int(id)
    except:
        THROW_ERROR("Invalid ID", 400)
    
    if id <= 0:
        THROW_ERROR("Invalid ID", 400)

    return id
# url
def vUrl(url: str, title: Optional[str] = "url") -> HttpUrl:
    try:
        return HttpUrl(url)
    except Exception:
        THROW_ERROR(f"Invalid {title}!", 400)
# username
def vUsername(value: Optional[str]) -> str:
    if value is None:
        THROW_ERROR("Username cannot be blank.", 400)
    if not isinstance(value, str):
        THROW_ERROR("Username is not in correct format", 400)
    
    username = value.strip()
    if not username:
        THROW_ERROR("Username cannot be blank.", 400)

    if len(username) > 20:
        THROW_ERROR("Username is to long!", 400)
    if len(username) <= 2:
        THROW_ERROR("Username is to short!", 400)

    username_pattern = r'^[A-Za-z0-9_ ]+$'
    if not re.match(username_pattern, username):
        THROW_ERROR("Username must contain only letters, numbers, underscores and spaces!", 400)

    return username

"generals"

normal_text = re.compile(r"^[0-9A-Za-zÀ-ÖØ-öø-ÿ\s.,!?@#%&()\-_/]*$")

# string
def vString(value: Optional[str], title: Optional[str] = "text",
   minlen: Optional[int] = 1,         
   maxlen: Optional[int] = 20         
) -> str:
    if value is None:
        THROW_ERROR(f"{title} cannot be blank!", 400)
    if not isinstance(value, str):
        THROW_ERROR(f"{title} is not in correct format!", 400)

    string = value.strip()
    if not string:
        THROW_ERROR(f"{title} cannot be blank!", 400)

    if len(string) < minlen:
        THROW_ERROR(f"Minimum characters {minlen}!", 400)
    if len(string) > maxlen:
        THROW_ERROR(f"Too many characters {maxlen}", 400)

    if not re.match(normal_text, string):
        THROW_ERROR(f"Invalid {string}!", 400)

    return string

# numbers
def vInt(integer: Optional[int], title: Optional[str] = "number",
    minNumber: Optional[int] = 0,
    maxNumber: Optional[int] = 1000000,     
) -> int:
    if integer is None:
        THROW_ERROR(f"{title} cannot be blank!", 400)
    if not isinstance(integer, int):
        THROW_ERROR(f"{title} is not in correct format!", 400)

    if not (minNumber <= integer <= maxNumber):
        THROW_ERROR(f"{title} must be between {minNumber} and {maxNumber}!", 400)

    return integer

def vDecimal(decimal = Optional[Decimal], title: Optional[str] = "number",
    minNumber: Decimal = Decimal("0"),
    maxNumber: Decimal = Decimal("1000000"),  
) -> Decimal:
    
    if decimal is None:
        THROW_ERROR(f"{title} cannot be blank!", 400)
    try:
        decimal = Decimal(str(decimal))
    except:
        THROW_ERROR(f"{title} is not in correct format!", 400)

    if not (minNumber <= decimal <= maxNumber):
        THROW_ERROR(f"{title} must be between {minNumber} and {maxNumber}!", 400)

    return decimal




    


    


    


    
        