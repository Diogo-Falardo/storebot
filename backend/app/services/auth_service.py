from sqlalchemy.orm import Session
# models: user
from app.models.auth_model import Auth
# utils: exceptions
from app.utils.exceptions import THROW_ERROR

def aUser(auth_UID: int, db: Session):
    user = db.query(Auth).filter(Auth.id == auth_UID).first()
    if not user:
        THROW_ERROR("Invalid user for authentication!", 400)
    
    return user