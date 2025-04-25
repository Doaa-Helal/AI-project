from fastapi import FastAPI,APIRouter,Depends,UploadFile,status
from fastapi.responses import JSONResponse
from helpers.config import get_settings,Settings
from models.enum import ResponseSignal
from controllers import DataController,ProjectController,ProcessController,BaseController
from .schemes.data import processRequest
from Summarization import summarization
import aiofiles
import logging
import os

logger=logging.getLogger("uvicorn.error")

data_router=APIRouter(
    prefix="/summarization/v1/data",
    tags=["api_v1","data"]
)
summarization=summarization()

@data_router.post("/upload/{project_id}")
async def upload_data(project_id:str,file:UploadFile,app_settings:Settings=Depends(get_settings)):
    data_controller=DataController()
    is_valid,signal=data_controller.validate_uploaded_file(file=file)

    if not is_valid:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"signal":ResponseSignal.FILE_UPLOADED_FAILED.value}
        )
    else:
        project_dir_path=ProjectController().get_project_path(project_id=project_id)
        file_path,file_id=data_controller.generate_unique_filepath(original_file_name=file.filename,project_id=project_id)

        try:
            async with aiofiles.open(file_path,"wb") as f:
                while chunk := await file.read(app_settings.FILE_DEFAULT_CHUNK_SIZE):
                    await f.write(chunk)

        except Exception as e:
            logger.error(f"Error while uploading file: {str(e)}")
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={"signal":ResponseSignal.FILE_UPLOADED_FAILED.value})
        

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"signal":ResponseSignal.FILE_UPLOADED_SUCCESS.value,
                     "file_id":file_id,
                     "project_dir":project_dir_path,
                     "file_path":file_path
                  }
        )
    

@data_router.post("/process/{project_id}")
async def process_endpoint(project_id:str,process_request:processRequest):
    file_id=process_request.file_id
    chunk_size=process_request.chunk_size
    overlap_size=process_request.overlap

    prosess_controller=ProcessController(project_id=project_id)
    file_content=prosess_controller.get_file_content(file_id=file_id)
    file_chunks=prosess_controller.process_file_content(file_content=file_content,file_id=file_id,chunk_size=chunk_size,overlap=overlap_size)

    project_path=prosess_controller.project_path
    out_path=os.path.join(project_path,"summary.txt")
    if file_chunks is None or len(file_chunks)==0:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "signal":ResponseSignal.PROCESSING_FAILD.value
            }
        )
    else:
        summary=summarization.get_final_summarization(file_chunks,output_path=out_path)
        return summary