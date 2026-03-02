const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const csv = require("csv-parser");
const { Readable } = require("stream");

const parseFile = async (file) => {
  const mimetype = file.mimetype;

  if (mimetype === "application/pdf") {
    const data = await pdfParse(file.buffer);
    return data.text;
  }

  if (
    mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  }

  if (mimetype === "text/csv") {
    return new Promise((resolve, reject) => {
      let text = "";

      const stream = Readable.from(file.buffer.toString());

      stream
        .pipe(csv())
        .on("data", (row) => {
          text += Object.values(row).join(" ") + "\n";
        })
        .on("end", () => resolve(text))
        .on("error", reject);
    });
  }

  throw new Error("Unsupported file type");
};

module.exports = parseFile;