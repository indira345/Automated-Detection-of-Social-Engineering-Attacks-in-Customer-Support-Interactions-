import re
from collections import defaultdict
from ocr.ocr_engine import extract_text_with_positions
from ocr.line_reconstruction import reconstruct_sentences


def is_noise(text):
    noise = [
        "type message",
        "@",
        "|",
        ">",
    ]
    return any(n in text.lower() for n in noise)


def clean_text(text):
    # remove timestamps completely
    text = re.sub(r"\b\d{1,2}[:.]\d{1,2}\b.*?(am|pm)?", "", text, flags=re.I)

    # remove junk symbols
    text = re.sub(r"[^a-zA-Z0-9@.\s]", "", text)

    return text.strip()


def parse_chat_sentence_wise(image_path):
    df = extract_text_with_positions(image_path)
    sentences = reconstruct_sentences(df)

    # 🔥 THIS IS THE KEY LINE 🔥
    sentences = sorted(sentences, key=lambda x: x["top"])

    grouped = defaultdict(list)

    for item in sentences:
        text = item["text"]

        if not text or is_noise(text):
            continue

        text = clean_text(text)
        if not text:
            continue

        grouped[item["alignment"]].append(text)

    return grouped

