from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
# system: db, security
from app.system.db import db
from app.system.system import validate_auth_token
# schemas: user
from app.models.schemas.user_schema import userBase, userUpdate, userOut
# controler: user
from app.controllers import user_controller


router = APIRouter(prefix="/user", tags=["user"])

@router.post("/create", response_model=userOut, name="createUserProfile")
def create_profile(
    payload: userBase,
    sender_id = Depends(validate_auth_token),
    db: Session = Depends(db)
):
    return user_controller.create_profile(payload.username, sender_id, db)

@router.patch("/", response_model=userOut, name="updateUser")
def user(
    payload: userUpdate,
    sender_id = Depends(validate_auth_token),
    db: Session = Depends(db)
):
    data = payload.model_dump(exclude_unset=True)

    return user_controller.update_user(data,sender_id,db)

    



