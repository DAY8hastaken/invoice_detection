# OCR Service (Khmer OCR)
#
# This module is a placeholder for the Khmer OCR integration.
# It will be implemented once the Khmer OCR solution is ready.
#
# Planned flow:
#   1. Receive uploaded receipt image from POST /api/receipts/upload/
#   2. Run Khmer OCR to extract text from the image
#   3. Parse extracted text into structured fields (merchant, amount, date, items, etc.)
#   4. Return structured receipt data to be saved in the database
#
# TODO:
#   - Choose Khmer OCR engine (Tesseract with khm traineddata, PaddleOCR, custom model, etc.)
#   - Implement text extraction
#   - Implement receipt field parsing
#   - Add confidence scoring
