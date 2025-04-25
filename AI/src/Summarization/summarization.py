from sentence_transformers import SentenceTransformer, util
from transformers import pipeline
import aiofiles
import pdfplumber
import torch
import re

class summarization:
  
    
    def clean_text(self,text):
        if text is not None:
            text=re.sub(r"https?:\S+|www\.\S+"," ",text)
            text=re.sub(r"\s+"," ",text).strip()
        return text
    
    def semantic_chunking(self,text, threshold=0.6, max_words=800, min_words=20):
        sentences = text
        embedding_model = SentenceTransformer('sentence-transformers/all-roberta-large-v1')
        embeddings = embedding_model.encode(sentences, convert_to_tensor=True)
        chunks = []
        current_chunk = sentences[0]

        for i in range(1, len(sentences)):
            similarity = util.pytorch_cos_sim(embeddings[i], embeddings[i - 1])
            current_word_count = len(current_chunk.split())

            if similarity < threshold or current_word_count + len(sentences[i].split()) > max_words:
                if current_word_count >= min_words:
                    chunks.append(current_chunk.strip())
                    current_chunk = sentences[i]
                else:
                    current_chunk += '. ' + sentences[i]
            else:
                current_chunk += '. ' + sentences[i]

        if len(current_chunk.split()) >= min_words:
            chunks.append(current_chunk.strip())

        return chunks

    def get_summarization(self,chunks,min_chunk_len=30,max_len=130,min_len=30):
        summarizations=[]
        summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
        if  isinstance(chunks,str):
            chunks=[chunks]

        for chunk in chunks:
            if len(chunk.split())>min_chunk_len:
                try:
                    summary=summarizer(chunk,max_length=max_len,min_length=min_len,do_sample=False)[0]["summary_text"]
                    summarizations.append(summary)
                except Exception as e:
                    print(f"Error while summarizing {e}")
                    summarizations.append(chunk)
            else:
                summarizations.append(chunk)
        return summarizations
    

    def generate_txt(self,summary_text, stored_path, language='en'):
        # Process the title
        title ="Your summary"
        body_text = summary_text  # Use the text as-is for English

        # Define A4 page parameters
        characters_per_line = 80  # Estimated characters per line for A4 paper
        effective_line_width = characters_per_line

        def align_line(line):
            return line.ljust(effective_line_width)

        # Center the title considering alignment
        centered_title = title.center(effective_line_width)

        # Format the body text with alignment
        formatted_body = ''
        for paragraph in body_text.split('\n'):  # Split text into paragraphs
            words = paragraph.split()  # Split paragraph into words
            line = ''
            for word in words:
                if len(line) + len(word) + 1 <= effective_line_width:
                    line += word + ' '  # Add word to the line
                else:
                    # Strip extra space and align the line
                    line = line.strip()
                    formatted_line = align_line(line)
                    formatted_body += formatted_line + '\n'  # Add the formatted line to the body
                    line = word + ' '  # Start a new line with the current word
            if line:
                line = line.strip()
                formatted_line = align_line(line)
                formatted_body += formatted_line + '\n'  # Add the last line of the paragraph
            formatted_body += '\n'  # Add an empty line between paragraphs

        # Write the title and body to a text file
        with open(stored_path, 'w', encoding='utf-8') as f:
            f.write(centered_title + '\n\n')  # Write the centered title
            f.write(formatted_body)  # Write the formatted body text


    def get_final_summarization(self,all_data,output_path):

        cleaned_chunks=[self.clean_text(chunk) for chunk in all_data]
        chunks=self.semantic_chunking(cleaned_chunks)
        summarization=self.get_summarization(cleaned_chunks,20,150,20)
        final_text="/n/n".join(summarization)
        
        self.generate_txt(final_text,output_path)
        print(f"Summarization completed!, saved to : {output_path}")

        return final_text