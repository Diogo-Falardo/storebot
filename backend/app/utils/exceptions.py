from fastapi import HTTPException
# uncontrolled error
def ERROR(e: str):
    if e is not None:
        raise HTTPException(
            status_code=404,
            detail=f"Unknow Error: {e}!"
        )
    else:
        raise HTTPException(
            status_code=404,
            detail="Code Error: variable 'e' was not passed"
        )
    
def THROW_ERROR(msg: str, _status_code: int):
    if not msg or not _status_code:
        raise ValueError(f"BAD CODE ALERT! missing variables")
        
    raise HTTPException(
            status_code=_status_code,
            detail=msg
        )
