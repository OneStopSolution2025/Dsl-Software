import os
import re
import json
import subprocess
from datetime import datetime
from flask import Flask, render_template, request, send_file, jsonify
from werkzeug.utils import secure_filename
from docxtpl import DocxTemplate, InlineImage
from docx.shared import Mm
import google.generativeai as genai
from google.cloud import documentai_v1 as documentai
import requests


class InsuranceDataExtractor:
    def __init__(self):
        # Configure Google Gemini
        self.gemini_api_key = os.getenv('GEMINI_API_KEY', "AIzaSyBkeRYU1dIsLok1EipErzmAg2NDYxYtyHs")
        if self.gemini_api_key:
            genai.configure(api_key=self.gemini_api_key)
            self.model = genai.GenerativeModel('gemini-2.5-flash-lite')
        else:
            self.model = None
            print("Warning: GEMINI_API_KEY not set, falling back to regex only")
        
        # Define extraction patterns for insurance documents
        self.patterns = {
            'claim_number': [
                r'claim\s*(?:no|number)[\s:]*([A-Z0-9\-\/]+)',
                r'claim[\s#]*([A-Z0-9\-\/]{8,})',
                r'ref(?:erence)?\s*(?:no|number)[\s:]*([A-Z0-9\-\/]+)'
            ],
            'policy_number': [
                r'policy\s*(?:no|number)[\s:]*([A-Z0-9\-\/]+)',
                r'certificate\s*(?:no|number)[\s:]*([A-Z0-9\-\/]+)'
            ],
            'nric': [
                r'(?:nric|ic)\s*(?:no|number)[\s:]*(\d{6}-\d{2}-\d{4})',
                r'(?:nric|ic)[\s:]*(\d{12})',
                r'\b(\d{6}-\d{2}-\d{4})\b'
            ],
            'phone': [
                r'(?:tel|phone|contact)[\s:]*(\+?6?0?\d{1,2}[-\s]?\d{7,8})',
                r'\b(\+60\d{1,2}-?\d{7,8})\b',
                r'\b(0\d{1,2}-?\d{7,8})\b'
            ],
            'email': [
                r'\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b'
            ],
            'vehicle_reg': [
                r'(?:registration|reg)[\s:]*([A-Z]{1,3}\s?\d{1,4}\s?[A-Z]?)',
                r'vehicle[\s\w]*(?:no|number)[\s:]*([A-Z]{1,3}\s?\d{1,4}\s?[A-Z]?)',
                r'\b([A-Z]{2,3}\s?\d{1,4}\s?[A-Z]?)\b'
            ],
            'date': [
                r'\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})\b',
                r'\b(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})\b'
            ],
            'amount': [
                r'(?:rm|ringgit)[\s$]*(\d+(?:,\d{3})*(?:\.\d{2})?)',
                r'\b(\d+(?:,\d{3})*(?:\.\d{2})?)(?:\s*ringgit|\s*rm)\b'
            ]
        }

    def extract_with_gemini(self, text):
        """Use Gemini AI for intelligent data extraction"""
        if not self.model:
            return {}
        
        prompt = f"""
        You are an expert at extracting structured data from Malaysian insurance documents. 
        Extract the following information from this text and return it as JSON:

        Required fields:
        - claim_number: Insurance claim reference number
        - policy_number: Policy or certificate number  
        - insured_name: Name of the insured person/policyholder
        - participant_driver: Name of the driver (may be same as insured)
        - nric_number: Malaysian NRIC/IC number (format: XXXXXX-XX-XXXX)
        - accident_date: Date of the accident
        - accident_time: Time of the accident
        - accident_location: Location where accident occurred
        - vehicle_registration: Vehicle registration number
        - vehicle_make_model: Make and model of vehicle
        - vehicle_color: Color of the vehicle
        - vehicle_year: Year of manufacture
        - engine_number: Engine number
        - chassis_number: Chassis number
        - third_party_name: Name of third party involved
        - third_party_nric: Third party NRIC number
        - third_party_vehicle: Third party vehicle details
        - third_party_vehicle_reg: Third party vehicle registration
        - police_report_number: Police report reference
        - police_station: Police station where report was made
        - police_findings: Police investigation findings
        - investigating_officer: Name and ID of investigating officer
        - injuries: Description of injuries sustained
        - damage_amount: Amount of damages claimed
        - contact_number: Phone number
        - email_address: Email address
        - period_of_cover: Insurance coverage period (from and to dates)
        - insured_address: Address of insured person
        - third_party_address: Address of third party
        - third_party_contact: Third party contact number
        - witness_name: Name of witness (if any)
        - witness_contact: Witness contact details
        - hospital_name: Name of hospital for treatment
        - medical_fees: Medical treatment costs
        - vehicle_owner: Registered owner of vehicle
        - third_party_solicitor: Third party's legal representative
        - damage_description: Description of vehicle damages
        - weather_condition: Weather at time of accident
        - road_condition: Condition of road surface
        - negligence_finding: Who was found negligent
        - compound_amount: Police compound/fine amount

        If any information is not found, use null for that field.
        Return only valid JSON format.

        Text to analyze:
        {text[:4000]}  # Limit text to avoid token limits
        """
        
        try:
            response = self.model.generate_content(prompt)
            # Clean the response to extract just JSON
            response_text = response.text.strip()
            
            # Remove markdown formatting if present
            if response_text.startswith('```json'):
                response_text = response_text[7:-3]
            elif response_text.startswith('```'):
                response_text = response_text[3:-3]
            
            # Parse JSON
            extracted_data = json.loads(response_text)
            return extracted_data
        
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
            print(f"Raw response: {response_text}")
            return {}
        except Exception as e:
            print(f"Gemini extraction error: {e}")
            return {}

    def extract_data(self, text):
        """Extract structured data using both Gemini AI and regex fallback"""
        # First try Gemini AI extraction
        gemini_data = self.extract_with_gemini(text)
        
        # Fallback to regex extraction
        regex_data = {}
        text_lower = text.lower()
        
        # Extract using regex patterns
        for field, patterns in self.patterns.items():
            for pattern in patterns:
                matches = re.finditer(pattern, text_lower, re.IGNORECASE | re.MULTILINE)
                for match in matches:
                    if field not in regex_data:
                        regex_data[field] = []
                    value = match.group(1).strip()
                    if value and value not in regex_data[field]:
                        regex_data[field].append(value)
        
        # Merge Gemini and regex results, preferring Gemini when available
        final_data = {}
        
        # Start with regex data
        for key, values in regex_data.items():
            final_data[key] = values
        
        # Override with Gemini data where available
        for key, value in gemini_data.items():
            if value and value != "null" and value is not None:
                # Convert single values to lists for consistency with regex results
                if isinstance(value, str):
                    final_data[key] = [value]
                else:
                    final_data[key] = [str(value)]
        
        return final_data
    
    def map_to_template(self, extracted_data):
        """Map extracted data to template variables with comprehensive field mapping"""
        template_data = {}
        
        # Helper function to get first item from list or default
        def get_first(key, default=""):
            return extracted_data.get(key, [default])[0] if extracted_data.get(key) else default
        
        # Helper function to format date
        def format_date(date_str):
            if not date_str or date_str == "":
                return datetime.now().strftime("%d/%m/%Y")
            return date_str
        
        # Core document fields
        template_data['Date'] = format_date(get_first('accident_date'))
        template_data['ClaimNumber'] = get_first('claim_number')
        template_data['PolicyNo'] = get_first('policy_number')
        template_data['YourRef'] = get_first('your_ref', '')
        template_data['OurRef'] = get_first('our_ref', 'WITHOUT PREJUDICE')
        
        # Period of cover - split if available
        period_of_cover = get_first('period_of_cover')
        if period_of_cover and 'to' in period_of_cover.lower():
            periods = period_of_cover.split(' to ')
            template_data['PeriodOfCover'] = f"From: {periods[0].strip()} to {periods[1].strip()}" if len(periods) > 1 else period_of_cover
        else:
            template_data['PeriodOfCover'] = period_of_cover or 'To be confirmed'
        
        # Participant/Insured information
        insured_name = get_first('insured_name', 'To be confirmed')
        template_data['InsuredName'] = insured_name
        template_data['ParticipantDriver'] = get_first('participant_driver', insured_name)
        template_data['NRICNO'] = get_first('nric_number', get_first('nric'))
        template_data['ContactNumber'] = get_first('contact_number', get_first('phone'))
        template_data['EmailAddress'] = get_first('email_address', get_first('email'))
        template_data['InsuredAddress'] = get_first('insured_address', 'To be confirmed')
        template_data['Age'] = get_first('age', 'To be confirmed')
        template_data['MaritalStatus'] = get_first('marital_status', 'To be confirmed')
        template_data['Occupation'] = get_first('occupation', 'To be confirmed')
        template_data['Employer'] = get_first('employer', 'To be confirmed')
        
        # Driver details (often same as insured)
        template_data['DriverAge'] = get_first('driver_age', template_data['Age'])
        template_data['DriverNRIC'] = get_first('driver_nric', template_data['NRICNO'])
        template_data['DriverMaritalStatus'] = get_first('driver_marital_status', template_data['MaritalStatus'])
        template_data['DriverAddress'] = get_first('driver_address', template_data['InsuredAddress'])
        template_data['DriverContact'] = get_first('driver_contact', template_data['ContactNumber'])
        template_data['DriverOccupation'] = get_first('driver_occupation', template_data['Occupation'])
        template_data['DriverEmployer'] = get_first('driver_employer', template_data['Employer'])
        template_data['DrivingLicenseNo'] = get_first('driving_license_no', 'To be confirmed')
        template_data['DrivingLicenseClass'] = get_first('driving_license_class', 'To be confirmed')
        template_data['DrivingLicenseValidity'] = get_first('driving_license_validity', 'To be confirmed')
        template_data['DrivingExperience'] = get_first('driving_experience', 'To be confirmed')
        template_data['DrivingEndorsement'] = get_first('driving_endorsement', 'None')
        template_data['CrossClaim'] = get_first('cross_claim', 'To be confirmed')
        
        # Accident details
        template_data['AccidentDate'] = template_data['Date']
        template_data['AccidentTime'] = get_first('accident_time', 'To be confirmed')
        template_data['Location'] = get_first('accident_location', 'To be determined')
        template_data['AccidentLocation'] = template_data['Location']
        
        # Vehicle information
        template_data['VehicleRegistration'] = get_first('vehicle_registration', get_first('vehicle_reg'))
        template_data['VehicleMakeModel'] = get_first('vehicle_make_model', 'To be confirmed')
        template_data['VehicleColor'] = get_first('vehicle_color', 'To be confirmed')
        template_data['VehicleYear'] = get_first('vehicle_year', 'To be confirmed')
        template_data['EngineNumber'] = get_first('engine_number', 'To be confirmed')
        template_data['ChassisNumber'] = get_first('chassis_number', 'To be confirmed')
        template_data['VehicleOwner'] = get_first('vehicle_owner', insured_name)
        template_data['AssemblyType'] = get_first('assembly_type', 'To be confirmed')
        template_data['CubicCapacity'] = get_first('cubic_capacity', 'To be confirmed')
        template_data['RegistrationDate'] = get_first('registration_date', 'To be confirmed')
        template_data['RegistrationCardNo'] = get_first('registration_card_no', 'To be confirmed')
        template_data['VehicleUsage'] = get_first('vehicle_usage', 'Private')
        
        # Third party information
        template_data['ThirdPartyName'] = get_first('third_party_name', 'To be identified')
        template_data['ThirdPartyNRIC'] = get_first('third_party_nric', 'To be identified')
        template_data['ThirdPartyVehicle'] = get_first('third_party_vehicle', 'To be identified')
        template_data['ThirdPartyVehicleReg'] = get_first('third_party_vehicle_reg', 'To be identified')
        template_data['ThirdPartyAddress'] = get_first('third_party_address', 'To be identified')
        template_data['ThirdPartyContact'] = get_first('third_party_contact', 'To be identified')
        template_data['ThirdPartyAge'] = get_first('third_party_age', 'To be identified')
        template_data['ThirdPartyMaritalStatus'] = get_first('third_party_marital_status', 'To be identified')
        template_data['ThirdPartyOccupation'] = get_first('third_party_occupation', 'To be identified')
        template_data['ThirdPartyEmployer'] = get_first('third_party_employer', 'To be identified')
        template_data['ThirdPartyIncome'] = get_first('third_party_income', 'To be identified')
        template_data['ThirdPartyLicense'] = get_first('third_party_license', 'To be identified')
        template_data['ThirdPartyLicenseValidity'] = get_first('third_party_license_validity', 'To be identified')
        template_data['ThirdPartyLicenseClass'] = get_first('third_party_license_class', 'To be identified')
        template_data['ThirdPartyVehicleOwner'] = get_first('third_party_vehicle_owner', 'To be identified')
        template_data['ThirdPartyVehicleType'] = get_first('third_party_vehicle_type', 'To be identified')
        template_data['ThirdPartyVehicleDetails'] = get_first('third_party_vehicle_details', 'To be identified')
        template_data['ThirdPartyInsurer'] = get_first('third_party_insurer', 'To be identified')
        template_data['ThirdPartyPolicyNo'] = get_first('third_party_policy_no', 'To be identified')
        template_data['ThirdPartyCoveragePeriod'] = get_first('third_party_coverage_period', 'To be identified')
        
        # Solicitor information
        template_data['ThirdPartySolicitor'] = get_first('third_party_solicitor', 'To be identified')
        template_data['SolicitorAddress'] = get_first('solicitor_address', 'To be identified')
        template_data['SolicitorPhone'] = get_first('solicitor_phone', 'To be identified')
        template_data['SolicitorRef'] = get_first('solicitor_ref', 'To be identified')
        
        # Police and legal information
        template_data['PoliceReport'] = get_first('police_report_number', 'To be obtained')
        template_data['PoliceStation'] = get_first('police_station', 'To be confirmed')
        template_data['PoliceFindings'] = get_first('police_findings', 'Investigation ongoing')
        template_data['InvestigatingOfficer'] = get_first('investigating_officer', 'To be confirmed')
        template_data['CompoundAmount'] = get_first('compound_amount', 'To be confirmed')
        template_data['NegligenceFindings'] = get_first('negligence_finding', 'To be determined')
        template_data['ReportLodgedBy'] = get_first('report_lodged_by', 'Participant Driver')
        template_data['ReportDateTime'] = get_first('report_date_time', 'To be confirmed')
        
        # Medical and injury information
        template_data['Injuries'] = get_first('injuries', 'To be assessed')
        template_data['ThirdPartyInjuries'] = get_first('third_party_injuries', 'To be assessed')
        template_data['HospitalName'] = get_first('hospital_name', 'To be confirmed')
        template_data['MedicalFees'] = get_first('medical_fees', 'To be assessed')
        template_data['Hospitalization'] = get_first('hospitalization', 'To be confirmed')
        template_data['ThirdPartyHospitalization'] = get_first('third_party_hospitalization', 'To be assessed')
        template_data['AdmissionDate'] = get_first('admission_date', 'To be confirmed')
        template_data['DischargeDate'] = get_first('discharge_date', 'To be confirmed')
        template_data['MedicalLeave'] = get_first('medical_leave', 'To be confirmed')
        template_data['PaymentMode'] = get_first('payment_mode', 'To be confirmed')
        template_data['MedicalFollowUp'] = get_first('medical_follow_up', 'To be confirmed')
        template_data['TraditionalTreatment'] = get_first('traditional_treatment', 'None')
        template_data['DisablementPeriod'] = get_first('disablement_period', 'To be assessed')
        template_data['OtherMedicalBenefit'] = get_first('other_medical_benefit', 'None')
        template_data['PresentComplaints'] = get_first('present_complaints', 'To be assessed')
        template_data['WorkResumeDate'] = get_first('work_resume_date', 'To be confirmed')
        
        # Damage information
        template_data['DamageAmount'] = get_first('damage_amount', get_first('amount', 'To be assessed'))
        template_data['DamageDescription'] = get_first('damage_description', 'To be assessed')
        
        # Environmental and site conditions
        template_data['WeatherCondition'] = get_first('weather_condition', 'To be confirmed')
        template_data['RoadCondition'] = get_first('road_condition', 'To be confirmed')
        template_data['TypeOfRoad'] = get_first('type_of_road', 'To be confirmed')
        template_data['Gradient'] = get_first('gradient', 'Level')
        template_data['CentralDemarcation'] = get_first('central_demarcation', 'To be confirmed')
        template_data['RoadView'] = get_first('road_view', 'To be confirmed')
        template_data['Visibility'] = get_first('visibility', 'To be confirmed')
        template_data['SurroundingArea'] = get_first('surrounding_area', 'To be confirmed')
        template_data['SpeedLimit'] = get_first('speed_limit', 'To be confirmed')
        template_data['LightingFacilities'] = get_first('lighting_facilities', 'To be confirmed')
        
        # Witness information
        template_data['WitnessName'] = get_first('witness_name', 'No independent witness located')
        template_data['WitnessAge'] = get_first('witness_age', 'N/A')
        template_data['WitnessNRIC'] = get_first('witness_nric', 'N/A')
        template_data['WitnessMaritalStatus'] = get_first('witness_marital_status', 'N/A')
        template_data['WitnessAddress'] = get_first('witness_address', 'N/A')
        template_data['WitnessContact'] = get_first('witness_contact', 'N/A')
        template_data['Witnesses'] = template_data['WitnessName']
        
        # Report metadata
        template_data['ReportType'] = 'INTERIM / FINAL REPORT - THIRD PARTY BODILY INJURY CLAIM'
        template_data['DateOfInstruction'] = template_data['Date']
        template_data['InvestigationRemarks'] = get_first('investigation_remarks', 'Investigation completed as per instructions')
        template_data['ConclusionRemarks'] = get_first('conclusion_remarks', 'Having completed the assignment as required, we submit the above for your kind attention.')
        
        # Image placeholders - will be populated if images are available
        template_data['AccidentImage'] = ""
        template_data['ParticipantPhoto'] = ""
        template_data['ParticipantNRICFront'] = ""
        template_data['ParticipantNRICRear'] = ""
        template_data['ParticipantLicenseFront'] = ""
        template_data['ParticipantLicenseRear'] = ""
        template_data['VehicleDamagePhoto1'] = ""
        template_data['VehicleDamagePhoto2'] = ""
        template_data['VehicleDamagePhoto3'] = ""
        template_data['VehicleDamagePhoto4'] = ""
        template_data['ThirdPartyPhoto'] = ""
        template_data['ThirdPartyNRICFront'] = ""
        template_data['ThirdPartyNRICRear'] = ""
        template_data['ThirdPartyInjuryPhoto1'] = ""
        template_data['ThirdPartyInjuryPhoto2'] = ""
        template_data['AccidentSitePhoto1'] = ""
        template_data['AccidentSitePhoto2'] = ""
        template_data['AccidentSitePhoto3'] = ""
        template_data['AccidentSitePhoto4'] = ""
        
        # Clean up any None values
        for key, value in template_data.items():
            if value is None or value == 'None':
                template_data[key] = 'To be confirmed'
            elif value == '':
                # Keep empty strings for reference fields that might be intentionally blank
                if key not in ['YourRef', 'OurRef']:
                    template_data[key] = 'To be confirmed'
        
        return template_data

# Initialize extractor
extractor = InsuranceDataExtractor()

# Your existing Flask app setup...
app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', './uploads')
TEMPLATE_FILE = os.getenv('TEMPLATE_FILE', './template.docx')
OUTPUT_DOCX = os.getenv('OUTPUT_DOCX', './output.docx')
OUTPUT_PDF = os.getenv('OUTPUT_PDF', './output.pdf')
MAPS_KEY = os.getenv('GOOGLE_MAPS_KEY') 

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def document_ai_process(file_path):
    """Process PDF with Document AI"""
    try:
        DOCAI_PROJECT = os.getenv('DOCUMENTAI_PROJECT_ID')
        DOCAI_LOCATION = os.getenv('DOCUMENTAI_LOCATION', 'us')
        DOCAI_PROCESSOR = os.getenv('DOCUMENTAI_PROCESSOR_ID')
        
        if not all([DOCAI_PROJECT, DOCAI_LOCATION, DOCAI_PROCESSOR]):
            return ""
        
        client = documentai.DocumentProcessorServiceClient()
        name = client.processor_path(DOCAI_PROJECT, DOCAI_LOCATION, DOCAI_PROCESSOR)
        
        with open(file_path, "rb") as f:
            doc_content = f.read()
        
        mime_type = "application/pdf" if file_path.lower().endswith(".pdf") else "image/png"
        raw_doc = documentai.RawDocument(content=doc_content, mime_type=mime_type)
        request = documentai.ProcessRequest(name=name, raw_document=raw_doc)
        
        result = client.process_document(request=request)
        return result.document.text or ""
    except Exception as e:
        print(f"Document AI error: {e}")
        return ""

@app.route('/')
def dashboard():
    return render_template('dashboard.html', maps_key=MAPS_KEY)

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

@app.route('/process_files', methods=['POST', 'GET'])
def process_files():
    """Enhanced processing with better data extraction"""
    try:
        aggregated_text = ""
        files = os.listdir(app.config['UPLOAD_FOLDER'])
        
        if not files:
            return jsonify({"status": "error", "message": "No files to process"}), 400
        
        # Process all files and aggregate text
        for fname in files:
            path = os.path.join(app.config['UPLOAD_FOLDER'], fname)
            ext = fname.split('.')[-1].lower()
            
            print(f"Processing {fname}...")
            
            if ext == "pdf":
                text = document_ai_process(path)
            elif ext in ('png', 'jpg', 'jpeg'):
                # Use your existing vision OCR function
                with open(path, "rb") as f:
                    img_bytes = f.read()
                text = vision_ocr_rest(img_bytes, os.getenv('VISION_API_KEY'))
            else:
                continue
            
            if text:
                aggregated_text += f"\n--- Content from {fname} ---\n{text}\n"
        
        if not aggregated_text.strip():
            return jsonify({"status": "error", "message": "No text extracted from files"}), 400
        
        # Extract structured data
        extracted_data = extractor.extract_data(aggregated_text)
        print(f"Extracted data: {json.dumps(extracted_data, indent=2)}")
        
        # Map to template format
        template_data = extractor.map_to_template(extracted_data)
        print(f"Template data: {json.dumps(template_data, indent=2)}")
        
        # Load and render template
        if not os.path.exists(TEMPLATE_FILE):
            return jsonify({"status": "error", "message": "Template file not found"}), 400
        
        doc_template = DocxTemplate(TEMPLATE_FILE)
        
        # Add first image if available
        image_files = [f for f in files if f.split('.')[-1].lower() in ('png', 'jpg', 'jpeg')]
        if image_files:
            try:
                first_image_path = os.path.join(app.config['UPLOAD_FOLDER'], image_files[0])
                template_data['AccidentImage'] = InlineImage(doc_template, first_image_path, width=Mm(100))
            except Exception as e:
                print(f"Error adding image: {e}")
                template_data['AccidentImage'] = ""
        else:
            template_data['AccidentImage'] = ""
        
        # Render template
        doc_template.render(template_data)
        doc_template.save(OUTPUT_DOCX)
        
        print(f"Document saved: {OUTPUT_DOCX}")
        
        return jsonify({
            "status": "success", 
            "extracted_data": extracted_data,
            "template_data": template_data,
            "message": f"Processed {len(files)} files successfully"
        })
        
    except Exception as e:
        print(f"Processing error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)}), 500

def convert_docx_to_pdf_linux(docx_path, pdf_path):
    """
    Convert DOCX to PDF on Linux using multiple fallback methods
    """
    try:
        # Method 1: Try LibreOffice (most reliable on Linux)
        cmd = ['libreoffice', '--headless', '--convert-to', 'pdf', '--outdir', 
               os.path.dirname(pdf_path), docx_path]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        
        # LibreOffice creates PDF with same name as DOCX
        expected_pdf = docx_path.replace('.docx', '.pdf')
        if os.path.exists(expected_pdf) and expected_pdf != pdf_path:
            os.rename(expected_pdf, pdf_path)
        
        if os.path.exists(pdf_path):
            print(f"PDF converted successfully with LibreOffice: {pdf_path}")
            return True
        
    except subprocess.TimeoutExpired:
        print("LibreOffice conversion timed out")
    except FileNotFoundError:
        print("LibreOffice not found, trying alternative methods...")
    except Exception as e:
        print(f"LibreOffice conversion error: {e}")
    
    try:
        # Method 2: Try unoconv (if available)
        cmd = ['unoconv', '-f', 'pdf', '-o', pdf_path, docx_path]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        
        if os.path.exists(pdf_path):
            print(f"PDF converted successfully with unoconv: {pdf_path}")
            return True
        
    except FileNotFoundError:
        print("unoconv not found")
    except Exception as e:
        print(f"unoconv conversion error: {e}")
    
    try:
        # Method 3: Try pandoc (limited formatting support)
        cmd = ['pandoc', docx_path, '-o', pdf_path]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        
        if os.path.exists(pdf_path):
            print(f"PDF converted successfully with pandoc: {pdf_path}")
            return True
        
    except FileNotFoundError:
        print("pandoc not found")
    except Exception as e:
        print(f"pandoc conversion error: {e}")
    
    print("All PDF conversion methods failed")
    return False

@app.route('/preview_doc')
def preview_doc():
    return send_file(OUTPUT_DOCX)
    if os.path.exists(OUTPUT_PDF):
        return send_file(OUTPUT_PDF)
    elif os.path.exists(OUTPUT_DOCX):
        return send_file(OUTPUT_DOCX)
    else:
        return jsonify({"error": "No document available"}), 404

@app.route('/download_doc')
def download_doc():
    if os.path.exists(OUTPUT_DOCX):
        return send_file(OUTPUT_DOCX, as_attachment=True)
    else:
        return jsonify({"error": "No document available"}), 404

# Add your vision_ocr_rest function here (from your original code)
def vision_ocr_rest(image_bytes, api_key):
    """Your existing OCR implementation"""
    # Placeholder - implement your existing OCR function
    pass

@app.route('/geocode', methods=['POST'])
def geocode():
    data = request.json or {}
    address = data.get('address', '') or data.get('q', '')
    if not address or not MAPS_KEY:
        return jsonify({"error": "missing address or MAPS_KEY not configured"}), 400

    url = "https://maps.googleapis.com/maps/api/geocode/json"
    resp = requests.get(url, params={"address": address, "key": MAPS_KEY}, timeout=15)
    return jsonify(resp.json())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)), debug=True)