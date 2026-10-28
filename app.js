pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

document.addEventListener("DOMContentLoaded", () => {

    const button =
        document.getElementById("generateButton");

    button.addEventListener("click", generateSpreadsheet);

});

async function generateSpreadsheet() {

    const pdfFile =
        document.getElementById("pdfFile").files[0];

    const status =
        document.getElementById("status");

    if (!pdfFile) {

        alert("Please select a CAPEX PDF");

        return;
    }

    status.innerHTML = "Reading PDF...";

    try {

        const text =
            await extractPdfText(pdfFile);

        const workbook =
            createWorkbook(text);

        XLSX.writeFile(
            workbook,
            "CAPEX_Formatted.xlsx"
        );

        status.innerHTML =
            "✓ Spreadsheet generated successfully";

    } catch (error) {

        console.error(error);

        status.innerHTML =
            "Error processing PDF";

    }
}

async function extractPdfText(file) {

    const buffer =
        await file.arrayBuffer();

    const pdf =
        await pdfjsLib
            .getDocument({ data: buffer })
            .promise;

    let fullText = "";

    for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
    ) {

        const page =
            await pdf.getPage(pageNumber);

        const content =
            await page.getTextContent();

        const pageText =
            content.items
                .map(item => item.str)
                .join(" ");

        fullText += pageText + "\n";

    }

    return fullText;
}

function createWorkbook(text) {

    const rows = [];

    rows.push([
        "Project Code",
        "Name",
        "Project Lifespan",
        "Commencement Year",
        "Project Type (Financial)",
        "Current Phase",
        "Portfolio",
        "Program"
    ]);

    const lines =
        text.split("\n");

    let counter = 1;

    lines.forEach(line => {

        if (
            line.length > 25
        ) {

            rows.push([
                "CAPEX-" +
                    String(counter)
                    .padStart(4, "0"),

                line.substring(0, 150),

                "",
                "",
                "CAPEX",
                "Forward Planning",
                "",
                ""
            ]);

            counter++;

        }

    });

    const workbook =
        XLSX.utils.book_new();

    const worksheet =
        XLSX.utils.aoa_to_sheet(rows);

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "CAPEX Program"
    );

    return workbook;
}
