### SmartSummarizeAI
 This repo provides an end to end project that offers AI summarization to pdfs,txt files, it utils using advanced chunking techniques, and fine tuning pretrained (facebook/bart) for summarization

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

```
pip install -r requirements 
```

### To use this project 
---

```
cd src 

uvicorn app:app
```
then use this website 

[SmartSummarizeAI](https://smartsummarizeai.vercel.app/)
