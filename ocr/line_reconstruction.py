def reconstruct_sentences(df, line_gap=12):
    sentences = []
    current_words = []
    current_top = None
    current_alignment = None

    for _, row in df.iterrows():
        text = row["text"].strip()
        top = row["top"]
        alignment = row["alignment"]

        if current_top is None:
            current_words = [text]
            current_top = top
            current_alignment = alignment
            continue

        # Same visual line
        if abs(top - current_top) <= line_gap and alignment == current_alignment:
            current_words.append(text)
        else:
            sentences.append({
                "top": current_top,
                "alignment": current_alignment,
                "text": " ".join(current_words)
            })
            current_words = [text]
            current_top = top
            current_alignment = alignment

    if current_words:
        sentences.append({
            "top": current_top,
            "alignment": current_alignment,
            "text": " ".join(current_words)
        })

    return sentences
