from ocr.detection.chat_parser import parse_chat_sentence_wise

IMAGE_PATH = "data/raw_images/chat2.jpeg"

chat = parse_chat_sentence_wise(IMAGE_PATH)

print("\n===== CLEAN CHAT OUTPUT =====\n")

print("OTHER USER:")
for msg in chat["sender"]:
    print("-", msg)

print("\nYOU:")
for msg in chat["you"]:
    print("-", msg)
