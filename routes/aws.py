# # text recognition
# import cv2
# import pytesseract
# import boto3
# import PyPDF2
# from PyPDF2 import PdfFileReader
# import fitz

# def get_table_csv_results(file_name, userId):

#     with open(file_name, 'rb') as file:
#         img_test = file.read()
#         bytes_test = bytearray(img_test)
#         print('Image loaded', file_name)

#     # process using image bytes
#     # get the results
#     client = boto3.client('textract')
#     response = client.analyze_document(Document={'Bytes': bytes_test}, FeatureTypes=['TABLES'])

#     # Get the text blocks
#     blocks=response['Blocks']
#     pprint(blocks)

#     blocks_map = {}
#     table_blocks = []
#     for block in blocks:
#         blocks_map[block['Id']] = block
#         if block['BlockType'] == "TABLE":
#             table_blocks.append(block)

#     if len(table_blocks) <= 0:
#         return "<b> NO Table FOUND </b>"

#     csv = ''
#     for index, table in enumerate(table_blocks):
#         csv = ''
#         csv += generate_table_csv(table, blocks_map, index +1)
#         # csv += '\n\n'
#         table_csv = csv
#         output_file1=(file_name.split('.')[0]+'_Table_' + str(index +1) +".csv")
#         output_file = "/srv/www/lms/lmsserver/src/public/results/"+userId+"/"+os.path.basename(output_file1)
#         with open(output_file, "wt") as fout:
#             fout.write(table_csv)

    
#     # output_file = '/home/shra1/mywork/ocrAPI/node-express-server-rest-api/downloads/'+(output_file1.split('le/')[1])

#     # replace content
    

#     return csv

# pdf_file_path = '1.pdf'
# userId='63473'
# extracted_text = get_table_csv_results(pdf_file_path,userId)
# print(extracted_text)
# text recognition

import cv2
import pytesseract
import boto3
import PyPDF2
from PyPDF2 import PdfFileReader
import os
import fitz
import re
def extract_text_from_pdf(file_path):
    print('file_path' ,file_path)
    text = ""
    str_data =""
    text_result =""
    try:
        with fitz.open(file_path) as pdf:
            for page_num in range(pdf.page_count):
                page = pdf.load_page(page_num)
                text += page.get_text()
                str_data= re.sub(r'(\r\n|\n|\r)', '', text)
                text_result = str_data.replace('&', 'and')
                print('text_result' ,text_result)
    except Exception as e:
        print(f"An error occurred: {e}")

    return text_result

def split_pdf_by_pages(file_path, output_folder):
    my_list =[]
    my_set = set()
    try:
        with fitz.open(file_path) as pdf:
            for page_num in range(pdf.page_count):
                output_file_path = os.path.join(output_folder, f"page_{page_num + 1}.pdf")
                pdf_writer = fitz.open()
                pdf_writer.insert_pdf(pdf, from_page=page_num, to_page=page_num)
                pdf_writer.save(output_file_path)
                extracted_text = extract_text_from_pdf(output_file_path)
                my_list.append(extracted_text)
                print('my_list' ,my_list)
                pdf_writer.close()
            print("sjdlfdl",my_list)
    except Exception as e:
        print(f"An error occurred: {e}")

pdf_file_path = '1149_Application_Form.pdf'
output = 'C:/Users/info/OneDrive/Desktop/MU-Updated/updated_attestationServer/public/upload'
split_pdf_by_pages(pdf_file_path, output)