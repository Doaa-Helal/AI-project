# Summarization-model

This repository contains a Jupyter notebook that demonstrates how to use various natural language processing (NLP) techniques to extract text from PDFs, clean the extracted text, generate embeddings, perform semantic chunking, and generate summaries. The notebook leverages libraries such as `pdfplumber`, `sentence-transformers`, and `transformers`.

Requirements
------------

-   Python 3.12.5 or higher
-   pdfplumber
-   re
-   pandas
-   sentence-transformers
-   transformers
-   torch

Installation
------------

To install the required packages, run:

bash

```
pip install pdfplumber pandas sentence-transformers transformers torch
```

Notebook Overview
-----------------

1.  Importing Libraries: Import necessary libraries for PDF extraction, text processing, and summarization.

    Python

    ```
    import pdfplumber
    import re
    import pandas
    from sentence_transformers import SentenceTransformer, util
    from transformers import pipeline
    import torch
    ```

2.  Extracting Data from PDF: Define a function to extract text and tables from a PDF.

    Python

    ```
    def extract_data(pdf_path):
        with pdfplumber.open(pdf_path) as pdf:
            text = ""
            for page in pdf.pages:
                text += page.extract_text()
                tables = page.extract_tables()
            return text, tables
    ```

3.  Cleaning Extracted Text: Define a function to clean the extracted text by removing URLs and extra whitespace.

    Python

    ```
    def clean_text(text):
        if text is not None:
            text = re.sub(r"https?:\S+|www\.\S+", " ", text)
            text = re.sub(r"\s+", " ", text).strip()
        return text
    ```

4.  Generating Embeddings: Use the `sentence-transformers` library to generate embeddings for sentences.

    Python

    ```
    embedding_model = SentenceTransformer('sentence-transformers/all-roberta-large-v1')
    sentences = ["This is an example sentence", "Each sentence is converted"]
    embeddings = embedding_model.encode(sentences)
    print(embeddings)
    ```

5.  Semantic Chunking: Define a function to split text into semantically coherent chunks based on cosine similarity of embeddings.

    Python

    ```
    def semantic_chunking(text, max_chunk_len=1000, min_chunk_len=400, simi_threshold=0.7):
        text_list = text.split(". ")
        embeddings = embedding_model.encode(text_list, convert_to_tensor=True)
        total_parts = []
        current_part = text_list[0]
        for i in range(1, len(text_list)):
            similarity = util.pytorch_cos_sim(embeddings[i], embeddings[i - 1])
            current_len = len(current_part.split())
            if similarity < simi_threshold or current_len + len(text_list[i].split()) > max_chunk_len:
                if current_len >= min_chunk_len:
                    total_parts.append(current_part.strip())
                    current_part = text_list[i]
                else:
                    current_part = current_part + ". " + text_list[i]
            else:
                current_part = current_part + ". " + text_list[i]
            if len(current_part.split()) >= min_chunk_len:
                total_parts.append(current_part.strip())
                current_part = text_list[i]
        return total_parts
    ```

6.  Generating Summaries: Use the `transformers` library to generate summaries for the text chunks.

    Python

    ```
    summarizer_en = pipeline("summarization", model="facebook/bart-large-cnn")

    def get_summarization(summarizer, chunks, min_chunk_len=30, max_len=130, min_len=30):
        summarizations = []
        if isinstance(chunks, str):
            chunks = [chunks]
        for chunk in chunks:
            if len(chunk.split()) > min_chunk_len:
                try:
                    summary = summarizer(chunk, max_length=max_len, min_length=min_len, do_sample=False)[0]["summary_text"]
                    summarizations.append(summary)
                except Exception as e:
                    print(f"Error while summarizing {e}")
                    summarizations.append(chunk)
            else:
                summarizations.append(chunk)
        return summarizations
    ```

7.  Combining All Steps: Define a function to extract data, perform semantic chunking, clean the text, generate summaries, and save the final summarization to a text file.

    Python

    ```
    def get_final_summarization(file_path, output_path):
        all_data = extract_data(file_path)[0]
        chunks = semantic_chunking(all_data, max_chunk_len=50, min_chunk_len=20, simi_threshold=0.7)
        cleaned_chunks = [clean_text(chunk) for chunk in chunks]
        summarization = get_summarization(summarizer_en, cleaned_chunks, 20, 150, 20)
        final_text = "/n/n".join(summarization)
        generate_txt(final_text, output_path)
        print(f"Summarization completed!, saved to : {output_path}")
        return final_text
    ```

Usage
-----

To use the notebook, follow these steps:

1.  Clone the repository:

    bash

    ```
    git clone https://github.com/Collabry-mans/Summarization-model.git
    ```

2.  Navigate to the repository directory:

    bash

    ```
    cd Summarization-model
    ```

3.  Open the notebook in Jupyter:

    bash

    ```
    jupyter notebook summarization_model.ipynb
    ```

4.  Run the cells sequentially to execute the code.

Example
-------

You can use the `get_final_summarization` function to summarize a PDF file and save the summary to a text file:

Python

```
get_final_summarization("path_to_pdf_file.pdf", "./summary.txt")
```


Helper Resourses:
-----
https://huggingface.co/facebook/bart-large-cnn

### <i>Python Documentation:</i>
1.
    [str.center()](https://docs.python.org/3/library/stdtypes.html#str.center)

    [str.ljust()](https://docs.python.org/3/library/stdtypes.html#str.ljust)

    [str.rjust()](https://docs.python.org/3/library/stdtypes.html#str.rjust)

### <i>Explains how to align and format strings in Python.</i>

2. [File Handling in Python
Python File I/O](https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files)



3. [Text Wrapping and Formatting
Text Wrapping in Python](https://docs.python.org/3/library/textwrap.html)

License
-------

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Collabry-mans/Summarization-model/blob/main/LICENSE) file for details.

* * * * *

This README was generated programmatically to provide a comprehensive guide for users of the summarization model notebook.