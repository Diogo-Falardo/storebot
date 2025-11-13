from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
# models: user
from app.models.auth_model import Auth
# utils: exceptions
from app.utils.exceptions import THROW_ERROR
# schemas: auth
from app.models.schemas.auth_schema import authBasePlus

def aUser(auth_UID: int, db: Session):
    user = db.query(Auth).filter(Auth.id == auth_UID).first()
    if not user:
        THROW_ERROR("Invalid user for authentication!", 400)
    
    return user

def aEmail(auth_email: str, db: Session):
    user = db.query(Auth).filter(Auth.email == auth_email).first()
    if user: return user
    else: return False

# inserts
def ins_UserAuth(user: authBasePlus, db: Session):
    try:
        new_UserAuth = Auth(
            email = user.email,
            hash_password = user.password
        )

        db.add(new_UserAuth)
        db.commit()
        db.refresh(new_UserAuth)

        return new_UserAuth
    except SQLAlchemyError:
        db.rollback()
        raise THROW_ERROR("Some error occurer!")
    

