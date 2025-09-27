# # app.py
# import os
# import base64
# import json
# import shutil
# from io import BytesIO
#
# from flask import Flask, render_template, request, send_file, jsonify
# from werkzeug.utils import secure_filename
# from dotenv import load_dotenv
#
# # Optional docx/template libs
# from docxtpl import DocxTemplate, InlineImage
# from docx.shared import Mm
#
# # Image / OCR libs
# from PIL import Image
# import pytesseract
# from pdf2image import convert_from_path
#
# # NLP
# import spacy
#
# # HTTP requests for Vision REST fallback & optional geocode
# import requests
#
# # Try to import Document AI client (optional)
# try:
#     from google.cloud import documentai_v1 as documentai
#     DOCUMENTAI_AVAILABLE = True
# except Exception:
#     DOCUMENTAI_AVAILABLE = False
#
# load_dotenv()  # load .env if present
#
# # -----------------------
# # Config (from env)
# # -----------------------
# UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'uploads')
# TEMPLATE_FILE = os.getenv('TEMPLATE_FILE', 'template.docx')
# OUTPUT_DOCX = os.getenv('OUTPUT_DOCX', 'output.docx')
# OUTPUT_PDF = os.getenv('OUTPUT_PDF', 'output.pdf')
#
# MAPS_KEY = os.getenv('GOOGLE_MAPS_KEY')          # maps JS key (for frontend)
# VISION_API_KEY = os.getenv('VISION_API_KEY')     # optional (REST fallback)
# DOCAI_PROJECT = os.getenv('DOCUMENTAI_PROJECT_ID')
# DOCAI_LOCATION = os.getenv('DOCUMENTAI_LOCATION')  # e.g. "us"
# DOCAI_PROCESSOR = os.getenv('DOCUMENTAI_PROCESSOR_ID')
#
# # Flask app
# app = Flask(__name__)
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
#
# # Ensure upload folder exists
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)
#
# # Load spaCy model (may take some memory/time)
# try:
#     nlp = spacy.load("en_core_web_sm")
# except Exception:
#     # If model not installed, fallback to blank model to avoid crash
#     import spacy.util
#     nlp = spacy.blank("en")
#
# # -----------------------
# # Helper: Vision REST OCR (fallback)
# # -----------------------
# def vision_ocr_rest(image_bytes, api_key):
#     """
#     Call Google Vision REST API (text detection) with an API key.
#     image_bytes: raw bytes of the image
#     Returns: extracted text (string)
#     """
#     if not api_key:
#         return ""
#
#     url = f"https://vision.googleapis.com/v1/images:annotate?key={api_key}"
#     b64 = base64.b64encode(image_bytes).decode('utf-8')
#     payload = {
#         "requests": [
#             {
#                 "image": {"content": b64},
#                 "features": [{"type": "DOCUMENT_TEXT_DETECTION", "maxResults": 1}]
#             }
#         ]
#     }
#     resp = requests.post(url, json=payload, timeout=60)
#     if resp.status_code != 200:
#         return ""
#     j = resp.json()
#     try:
#         return j['responses'][0].get('fullTextAnnotation', {}).get('text', '')
#     except Exception:
#         return ""
#
# # -----------------------
# # Helper: Document AI (PDF & structured) — uses google-cloud-documentai client
# # -----------------------
# def document_ai_process(file_path):
#     """
#     Process a PDF (or image) using Document AI client if configured.
#     Requires GOOGLE_APPLICATION_CREDENTIALS env to point to a service account JSON.
#     Returns extracted text or '' on failure.
#     """
#     if not DOCUMENTAI_AVAILABLE or not DOCAI_PROJECT or not DOCAI_LOCATION or not DOCAI_PROCESSOR:
#         return ""
#
#     client = documentai.DocumentProcessorServiceClient()
#     name = client.processor_path(DOCAI_PROJECT, DOCAI_LOCATION, DOCAI_PROCESSOR)
#
#     with open(file_path, "rb") as f:
#         doc_content = f.read()
#
#     # mime type inference
#     mime_type = "application/pdf" if file_path.lower().endswith(".pdf") else "image/png"
#
#     raw_doc = documentai.RawDocument(content=doc_content, mime_type=mime_type)
#     request = documentai.ProcessRequest(name=name, raw_document=raw_doc)
#
#     try:
#         result = client.process_document(request=request)
#         # Document AI returns a Document proto - combine text
#         return result.document.text or ""
#     except Exception as e:
#         print("Document AI error:", e)
#         return ""
#
# # -----------------------
# # Helper: local pytesseract fallback OCR for images
# # -----------------------
# def local_tesseract_ocr(image_path):
#     try:
#         img = Image.open(image_path)
#         return pytesseract.image_to_string(img)
#     except Exception as e:
#         print("Tesseract OCR error:", e)
#         return ""
#
# # -----------------------
# # Route: Dashboard (pass maps key)
# # -----------------------
# @app.route('/')
# def dashboard():
#     # Inject MAPS_KEY for the frontend accident_map canvas
#     return render_template('dashboard.html', maps_key=MAPS_KEY or "")
#
# # -----------------------
# # Route: Accident Map (separate page)
# # -----------------------
# @app.route('/accident_map')
# def accident_map():
#     return render_template('accident_map.html', maps_key=MAPS_KEY or "")
#
# # -----------------------
# # Route: Upload files
# # -----------------------
# @app.route('/upload', methods=['POST'])
# def upload_files():
#     files = request.files.getlist("file")
#     saved = []
#     for f in files:
#         fn = secure_filename(f.filename)
#         outp = os.path.join(app.config['UPLOAD_FOLDER'], fn)
#         f.save(outp)
#         saved.append(fn)
#     return jsonify({"uploaded": saved})
#
# # -----------------------
# # Route: Process files (OCR -> NLP -> template)
# # -----------------------
# @app.route('/process_files', methods=['GET', 'POST'])
# def process_files():
#     if request.method == "GET":
#         return "Send POST request with files", 200
#
#     context = {}
#     aggregated_text = ""
#
#     files = os.listdir(app.config['UPLOAD_FOLDER'])
#     total_files = len(files)
#
#     for idx, fname in enumerate(files, 1):
#         path = os.path.join(app.config['UPLOAD_FOLDER'], fname)
#         ext = fname.split('.')[-1].lower()
#
#         print(f"[INFO] ({idx}/{total_files}) Starting processing file: {fname}", flush=True)
#
#         try:
#             if ext == "pdf":
#                 print(f"[INFO] Processing {fname} with Document AI...", flush=True)
#                 text = document_ai_process(path)
#                 print(f"[INFO] Document AI completed: {fname}, text length: {len(text)}", flush=True)
#             elif ext in ('png', 'jpg', 'jpeg'):
#                 print(f"[INFO] Processing {fname} with Vision AI...", flush=True)
#                 with open(path, "rb") as f:
#                     img_bytes = f.read()
#                 text = vision_ocr_rest(img_bytes, VISION_API_KEY)
#                 print(f"[INFO] Vision AI completed: {fname}, text length: {len(text)}", flush=True)
#             else:
#                 print(f"[INFO] Skipping unsupported file: {fname}", flush=True)
#                 continue
#
#             aggregated_text += "\n" + text
#             print(f"[INFO] Finished processing file: {fname}", flush=True)
#
#         except Exception as e:
#             print(f"[ERROR] Processing failed for {fname}: {e}", flush=True)
#             return jsonify({"status": "error", "file": fname, "details": str(e)}), 500
#
#     # NLP extraction using spaCy
#     doc = nlp(aggregated_text)
#     context['Name'] = next((ent.text for ent in doc.ents if ent.label_ == "PERSON"), "NA")
#     context['Date'] = next((ent.text for ent in doc.ents if ent.label_ == "DATE"), "NA")
#     context['Amount'] = next((ent.text for ent in doc.ents if ent.label_ == "MONEY"), "NA")
#     context['Location'] = next((ent.text for ent in doc.ents if ent.label_ in ["GPE", "LOC", "FAC", "ADDRESS"]), "NA")
#
#     # Insert first image into DOCX template
#     docx_tpl = DocxTemplate(TEMPLATE_FILE)
#     first_image = None
#     for fname in files:
#         if fname.split('.')[-1].lower() in ('png', 'jpg', 'jpeg'):
#             first_image = os.path.join(app.config['UPLOAD_FOLDER'], fname)
#             break
#
#     if first_image:
#         try:
#             context['AccidentImage'] = InlineImage(docx_tpl, first_image, width=Mm(100))
#         except Exception as e:
#             print("[ERROR] InlineImage error:", e, flush=True)
#             context['AccidentImage'] = ""
#
#     # Render and save DOCX
#     try:
#         docx_tpl.render(context)
#         docx_tpl.save(OUTPUT_DOCX)
#         print(f"[INFO] DOCX saved: {OUTPUT_DOCX}", flush=True)
#     except Exception as e:
#         print(f"[ERROR] Docx render/save error: {e}", flush=True)
#         return jsonify({"status": "error", "error": "docx_failed", "details": str(e)}), 500
#
#     # Optional DOCX -> PDF conversion
#     try:
#         from docx2pdf import convert
#         convert(OUTPUT_DOCX, OUTPUT_PDF)
#         print(f"[INFO] PDF saved: {OUTPUT_PDF}", flush=True)
#     except Exception:
#         pass
#
#     return jsonify({"status": "success", "context": context})
#
# # -----------------------
# # Preview / Download routes
# # -----------------------
# @app.route('/preview_doc')
# def preview_doc():
#     if os.path.exists(OUTPUT_PDF):
#         return send_file(OUTPUT_PDF)
#     elif os.path.exists(OUTPUT_DOCX):
#         return send_file(OUTPUT_DOCX)
#     else:
#         return "No document available", 404
#
# @app.route('/download_doc')
# def download_doc():
#     return send_file(OUTPUT_DOCX, as_attachment=True)
#
# # -----------------------
# # (Optional) Geocode endpoint (server-side) using Maps Geocoding API
# # -----------------------
# @app.route('/geocode', methods=['POST'])
# def geocode():
#     data = request.json or {}
#     address = data.get('address', '') or data.get('q', '')
#     if not address or not MAPS_KEY:
#         return jsonify({"error": "missing address or MAPS_KEY not configured"}), 400
#
#     url = "https://maps.googleapis.com/maps/api/geocode/json"
#     resp = requests.get(url, params={"address": address, "key": MAPS_KEY}, timeout=15)
#     return jsonify(resp.json())
#
# # -----------------------
# # Run app
# # -----------------------
# if __name__ == "__main__":
#     # Optionally set debug=False in production
#     app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)), debug=True)


# New code
# ========================================================================================================

import os
import base64
from io import BytesIO
from concurrent.futures import ThreadPoolExecutor

from flask import Flask, render_template, request, send_file, jsonify
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

# DOCX handling
from docxtpl import DocxTemplate, InlineImage
from docx.shared import Mm

# Image / OCR libs
from PIL import Image
import pytesseract
from pdf2image import convert_from_path

# NLP
import spacy

# HTTP requests for Vision fallback
import requests

# Try to import Document AI client (optional)
try:
    from google.cloud import documentai_v1 as documentai
    DOCUMENTAI_AVAILABLE = True
except Exception:
    DOCUMENTAI_AVAILABLE = False

load_dotenv()  # load .env if present

# -----------------------
# Config (from env)
# -----------------------
UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'uploads')
TEMPLATE_FILE = os.getenv('TEMPLATE_FILE', 'template.docx')
OUTPUT_DOCX = os.getenv('OUTPUT_DOCX', 'output.docx')
OUTPUT_PDF = os.getenv('OUTPUT_PDF', 'output.pdf')

MAPS_KEY = os.getenv('GOOGLE_MAPS_KEY')
VISION_API_KEY = os.getenv('VISION_API_KEY')
DOCAI_PROJECT = os.getenv('DOCUMENTAI_PROJECT_ID')
DOCAI_LOCATION = os.getenv('DOCUMENTAI_LOCATION')
DOCAI_PROCESSOR = os.getenv('DOCUMENTAI_PROCESSOR_ID')

# Poppler fallback path (Windows)
DEFAULT_POPPLER_PATH = r"C:\poppler-24.02.0\bin"

# Flask app
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except Exception:
    nlp = spacy.blank("en")

# -----------------------
# Helpers
# -----------------------
def vision_ocr_rest(image_bytes, api_key):
    """Google Vision API OCR (REST)."""
    if not api_key:
        return ""
    url = f"https://vision.googleapis.com/v1/images:annotate?key={api_key}"
    b64 = base64.b64encode(image_bytes).decode('utf-8')
    payload = {
        "requests": [{
            "image": {"content": b64},
            "features": [{"type": "DOCUMENT_TEXT_DETECTION", "maxResults": 1}]
        }]
    }
    resp = requests.post(url, json=payload, timeout=60)
    if resp.status_code != 200:
        return ""
    try:
        return resp.json()['responses'][0].get('fullTextAnnotation', {}).get('text', '')
    except Exception:
        return ""

def document_ai_process(file_path):
    """Process PDF/image using Document AI (if configured)."""
    if not DOCUMENTAI_AVAILABLE or not DOCAI_PROJECT or not DOCAI_LOCATION or not DOCAI_PROCESSOR:
        return ""
    client = documentai.DocumentProcessorServiceClient()
    name = client.processor_path(DOCAI_PROJECT, DOCAI_LOCATION, DOCAI_PROCESSOR)
    with open(file_path, "rb") as f:
        doc_content = f.read()
    mime_type = "application/pdf" if file_path.lower().endswith(".pdf") else "image/png"
    raw_doc = documentai.RawDocument(content=doc_content, mime_type=mime_type)
    request = documentai.ProcessRequest(name=name, raw_document=raw_doc)
    try:
        result = client.process_document(request=request)
        return result.document.text or ""
    except Exception as e:
        print("Document AI error:", e, flush=True)
        return ""

def local_tesseract_ocr(image_path):
    """Fallback OCR using local Tesseract."""
    try:
        img = Image.open(image_path)
        return pytesseract.image_to_string(img)
    except Exception as e:
        print("Tesseract OCR error:", e, flush=True)
        return ""

def safe_convert_from_path(pdf_path):
    """PDF -> image conversion with Poppler fallback."""
    try:
        return convert_from_path(pdf_path)  # if Poppler in PATH
    except Exception as e:
        print(f"[WARN] convert_from_path failed without poppler_path: {e}", flush=True)
        try:
            return convert_from_path(pdf_path, poppler_path=DEFAULT_POPPLER_PATH)
        except Exception as e2:
            print(f"[ERROR] convert_from_path failed even with poppler_path: {e2}", flush=True)
            return []

# -----------------------
# Main OCR function
# -----------------------
def process_one_file(fname):
    path = os.path.join(app.config['UPLOAD_FOLDER'], fname)
    ext = fname.split('.')[-1].lower()
    text = ""

    try:
        if ext == "pdf":
            print(f"[INFO] Processing {fname} with Document AI...", flush=True)
            text = document_ai_process(path)
            if not text:  # fallback
                print(f"[WARN] Document AI returned empty, using pdf2image + Tesseract for {fname}", flush=True)
                pages = safe_convert_from_path(path)
                for page in pages:
                    temp_img = BytesIO()
                    page.save(temp_img, format="PNG")
                    temp_img.seek(0)
                    text += pytesseract.image_to_string(Image.open(temp_img))
                print(f"[INFO] Fallback OCR text length: {len(text)}", flush=True)

        elif ext in ('png', 'jpg', 'jpeg'):
            print(f"[INFO] Processing {fname} with Vision API...", flush=True)
            with open(path, "rb") as f:
                img_bytes = f.read()
            text = vision_ocr_rest(img_bytes, VISION_API_KEY)
            if not text:  # fallback
                print(f"[WARN] Vision API returned empty, using Tesseract for {fname}", flush=True)
                text = local_tesseract_ocr(path)
            print(f"[INFO] Image OCR text length: {len(text)}", flush=True)

        else:
            print(f"[INFO] Skipping unsupported file: {fname}", flush=True)

    except Exception as e:
        print(f"[ERROR] Processing failed for {fname}: {e}", flush=True)

    return text

# -----------------------
# Routes
# -----------------------
@app.route('/')
def dashboard():
    return render_template('dashboard.html', maps_key=MAPS_KEY or "")

@app.route('/accident_map')
def accident_map():
    return render_template('accident_map.html', maps_key=MAPS_KEY or "")

@app.route('/upload', methods=['POST'])
def upload_files():
    files = request.files.getlist("file")
    saved = []
    for f in files:
        fn = secure_filename(f.filename)
        outp = os.path.join(app.config['UPLOAD_FOLDER'], fn)
        f.save(outp)
        saved.append(fn)
    return jsonify({"uploaded": saved})

@app.route('/process_files', methods=['POST'])
def process_files():
    files = os.listdir(app.config['UPLOAD_FOLDER'])

    with ThreadPoolExecutor() as executor:
        texts = list(executor.map(process_one_file, files))

    aggregated_text = "\n".join(texts)
    print("[DEBUG] OCR aggregated text:", aggregated_text[:500], flush=True)

    # NLP extraction
    doc = nlp(aggregated_text)
    context = {
        'Name': next((ent.text for ent in doc.ents if ent.label_ == "PERSON"), "NA"),
        'Date': next((ent.text for ent in doc.ents if ent.label_ == "DATE"), "NA"),
        'Amount': next((ent.text for ent in doc.ents if ent.label_ == "MONEY"), "NA"),
        'Location': next((ent.text for ent in doc.ents if ent.label_ in ["GPE", "LOC", "FAC", "ADDRESS"]), "NA"),
    }

    # DOCX template
    docx_tpl = DocxTemplate(TEMPLATE_FILE)
    first_image = None
    for fname in files:
        if fname.split('.')[-1].lower() in ('png', 'jpg', 'jpeg'):
            first_image = os.path.join(app.config['UPLOAD_FOLDER'], fname)
            break
    if first_image:
        try:
            context['AccidentImage'] = InlineImage(docx_tpl, first_image, width=Mm(100))
        except Exception as e:
            print("[ERROR] InlineImage error:", e, flush=True)
            context['AccidentImage'] = ""

    try:
        docx_tpl.render(context)
        docx_tpl.save(OUTPUT_DOCX)
        print(f"[INFO] DOCX saved: {OUTPUT_DOCX}", flush=True)
    except Exception as e:
        print(f"[ERROR] Docx render/save error: {e}", flush=True)
        return jsonify({"status": "error", "error": "docx_failed", "details": str(e)}), 500

    # Try PDF export
    try:
        from docx2pdf import convert
        convert(OUTPUT_DOCX, OUTPUT_PDF)
        print(f"[INFO] PDF saved: {OUTPUT_PDF}", flush=True)
    except Exception:
        pass

    return jsonify({"status": "success", "context": context})

@app.route('/preview_doc')
def preview_doc():
    if os.path.exists(OUTPUT_PDF):
        return send_file(OUTPUT_PDF)
    elif os.path.exists(OUTPUT_DOCX):
        return send_file(OUTPUT_DOCX)
    else:
        return "No document available", 404

@app.route('/download_doc')
def download_doc():
    return send_file(OUTPUT_DOCX, as_attachment=True)

# -----------------------
# Run app
# -----------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)), debug=True)
