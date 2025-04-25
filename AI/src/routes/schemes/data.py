from pydantic import BaseModel
from typing import Optional

class processRequest(BaseModel):
    file_id:str
    chunk_size:Optional[int]=100
    overlap:Optional[int]=20
    do_rest:Optional[int]=0
    
