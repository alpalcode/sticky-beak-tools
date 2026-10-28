let pdfText = "";

document
.getElementById("generateButton")
.addEventListener("click", generateCapex);

async function generateCapex(){

    const pdf =
        document.getElementById("pdfFile")
        .files[0];

    if(!pdf){

        alert("Select CAPEX PDF first");

        return;
    }

    document.getElementById("status")
    .innerHTML =
    "Reading PDF...";

    await readPDF(pdf);

    createCapexWorkbook();
}

async function readPDF(file){

    const bytes =
        await file.arrayBuffer();

    const pdfDoc =
        await pdfjsLib
        .getDocument({
            data:bytes
        }).promise;

    pdfText = "";

    for(
        let p=1;
        p<=pdfDoc.numPages;
        p++
    ){

        const page =
            await pdfDoc.getPage(p);

        const content =
            await page.getTextContent();

        const text =
            content.items
            .map(item=>item.str)
            .join(" ");

        pdfText += text + "\n";
    }
}

function createCapexWorkbook(){

    const rows=[];

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
        pdfText.split("\n");

    let count=1;

    lines.forEach(line=>{

        if(
            line.length > 20 &&
            /\d{1,3},\d{3}/.test(line)
        ){

            rows.push([

                "CAPEX-" +
                String(count)
                .padStart(4,"0"),

                line.substring(0,120),

                "",

                "",

                "CAPEX",

                "Forward Planning",

                "",

                ""

            ]);

            count++;
        }

    });

    const wb =
        XLSX.utils.book_new();

    const ws =
        XLSX.utils.aoa_to_sheet(rows);

    XLSX.utils.book_append_sheet(
        wb,
        ws,
        "CAPEX"
    );

    XLSX.writeFile(
        wb,
        "CAPEX_Formatted.xlsx"
    );

    document.getElementById("status")
    .innerHTML =
    "CAPEX spreadsheet downloaded";
}
