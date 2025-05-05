FROM python:3.10


ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    git \
    curl \
    poppler-utils \
    libpoppler-cpp-dev \
    libmupdf-dev \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    fonts-dejavu \
    locales \
    && locale-gen en_US.UTF-8 \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip

COPY ./src/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./src .


EXPOSE 8000


CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
