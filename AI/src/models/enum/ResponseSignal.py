from enum import Enum

class ResponseSignal(Enum):
    FILE_VALIDATED_SUCCESS="file_validate_successfully"
    FILE_TYPE_NOT_SUPPORTED="file_type_not_supported"
    FILE_SIZE_EXCEEDED="file_size_exceeded"
    FILE_UPLOADED_SUCCESS="file_uploaded_success"
    FILE_UPLOADED_FAILED="file_uploaded_failed"

    PROCESSING_FAILD="processing_faild"
    PROCESSING_SUCCESS="prosessing_success"

