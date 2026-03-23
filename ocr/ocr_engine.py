import cv2
import pytesseract
import pandas as pd

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


def extract_text_with_positions(image_path):
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    image_width = img.shape[1]

    df = pytesseract.image_to_data(
        gray,
        output_type=pytesseract.Output.DATAFRAME,
        config="--oem 3 --psm 6"
    )

    df = df.dropna(subset=["text"])
    df = df[df["text"].str.strip() != ""]

    # Alignment detection
    df["alignment"] = df["left"].apply(
        lambda x: "sender" if x < image_width / 2 else "you"
    )

    # Sort top → bottom
    df = df.sort_values(by=["top", "left"])

    return df
