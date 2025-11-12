from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session
from datetime import datetime,timezone
# system: db, security
from app.system.db import db
from app.system.system import create_password_hash, verify_password_hash, generate_access_token, verify_token
# models, schemas: auth
from app.models.auth_model import Auth
from app.models.schemas import *
# service: auth
from app.services import auth_service
# utils: exceptions
from app.utils.exceptions import THROW_ERROR



