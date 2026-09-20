import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export async function extractText(file) {
  // PDF
  if (file.mimetype === "application/pdf") {
    const parser = new PDFParse({
      data: file.buffer,
    });

    try {
      const result = await parser.getText();

      return result.text;
    } finally {
      await parser.destroy();
    }
  }

  // DOCX
  if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });

    return result.value;
  }

  // TXT or other text files
  if (file.mimetype === "text/plain") {
    return file.buffer.toString("utf8");
  }

  throw new Error(
    `Unsupported file type: ${file.mimetype}`
  );
}