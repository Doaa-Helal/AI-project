from .BaseController import BaseController
from .ProjectController import ProjectController
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from models.enum import ProcessingEnum
import os

class ProcessController(BaseController):
    def __init__(self,project_id:str):
        super().__init__()
        self.project_id=project_id
        self.project_path=ProjectController().get_project_path(self.project_id)

    def get_file_extension(self,file_id):
        return os.path.splitext(file_id)[-1]
    
    def get_file_loader(self,file_id:str):
        file_ext=self.get_file_extension(file_id=file_id)
        file_path=os.path.join(self.project_path,file_id)

        if file_ext==ProcessingEnum.TXT.value:
            return TextLoader(file_path=file_path)
        if file_ext==ProcessingEnum.PDF.value:
            return PyMuPDFLoader(file_path=file_path)
        return None
    
    def get_file_content(self,file_id:str):
        loader=self.get_file_loader(file_id=file_id)
        return loader.load()
    
    def process_file_content(self,file_id:str,file_content:list,chunk_size:int=1000,overlap:int=20):
        text_splitter=RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=overlap,
            length_function=len
        )

        file_content_text=[
            record.page_content
            for record in file_content
        ]

        file_content_metadate=[
            record.metadata
            for record in file_content
        ]

        chunks=text_splitter.create_documents(
            file_content_text,
           
        )

        return file_content_text