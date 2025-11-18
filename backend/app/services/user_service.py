from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
# utils: exceptions
from app.utils.exceptions import THROW_ERROR
# models
from app.models.user_model import User

# search

def sProfile(sender_id: int, db: Session):
    user = db.query(User).filter(User.auth_id == sender_id).first()
    if user: return user
    else: return False


def sUsername(username: str, db: Session):
    user = db.query(User).filter(User.username == username).first()
    if user: return user
    else: return False


# insert

def ins_profile(username: str, sender_id: int, db: Session):

    try:
        new_profile = User(
            username = username,
            auth_id = sender_id
        )

        db.add(new_profile)
        db.commit()
        db.refresh(new_profile)

        return new_profile

    except Exception:
        db.rollback()
        THROW_ERROR("Error while creating profile", 500)
    

    


