from sqlalchemy.orm import Session
from datetime import datetime, timezone
# services: user
from app.services import user_service
# schemas: user
from app.models.schemas.user_schema import userOut, userBase
# utils: exceptions
from app.utils.exceptions import THROW_ERROR


def create_profile(username: str, sender_id: int, db: Session):

    user = user_service.sProfile(sender_id,db)
    if user:
        THROW_ERROR("Profile already created!", 400)
    elif user_service.sUsername(username, db):
        THROW_ERROR("Username already in use!", 400)

    return user_service.ins_profile(username, sender_id, db)

    

def update_user(payload: dict, sender_id: int, db: Session):

    if not payload:
        THROW_ERROR("Changes havent been made!", 400)

    user = user_service.sProfile(sender_id, db)

    for c, v in payload.items():
        if c == "username":
            if v == user.username:
                pass
            elif user_service.sUsername(v, db):
                THROW_ERROR("Username already in use!", 400)
            else:
                user.username = v
        elif c == "country":
            if v == user.country:
                pass
            else:
                user.country = v
        elif c == "bio":
            if v == user.bio:
                pass
            else:
                user.bio = v

    user.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh

    return user






            
            



        
