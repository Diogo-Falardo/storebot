from sqlalchemy.orm import Session
from datetime import datetime, timezone
# system: security
from app.system.system import create_password_hash, verify_password_hash, generate_access_token
# services
from app.services import auth_service
# schemas: auth
from app.models.schemas.auth_schema import authBasePlus
# utils: exceptions
from app.utils.exceptions import THROW_ERROR


# register controller
def register(payload: authBasePlus, db: Session):

    if auth_service.aEmail(payload.email, db):
        THROW_ERROR("Email already in use.", 400)

    password = create_password_hash(payload.password)

    new_AuthUser = authBasePlus(
        email = payload.email.lower(),
        password = password
    )

    return auth_service.ins_UserAuth(new_AuthUser, db)

# login controller
def login(payload: authBasePlus ,db: Session):

    user = auth_service.aEmail(payload.email,db)
    if not user :
        THROW_ERROR("Email account was not found!", 400)
    else:
        if not verify_password_hash(payload.password, user.hash_password):
            THROW_ERROR("Icorrect Password!", 401)

        access_token = generate_access_token(
            subject= str(user.id),
            minutes=15,
        )

        refresh_token = generate_access_token(
            subject= str(user.id),
            minutes=60*24*30,
            scope="refresh",
        )

        user.last_login = datetime.now(timezone.utc)
        db.commit()

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type":"bearer"
        }

    

    
    