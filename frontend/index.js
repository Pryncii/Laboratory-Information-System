const express = require('express');
const path = require('path');
const { PDFDocument, StandardFonts } = require('pdf-lib');
const { readFile } = require('fs/promises');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Serve the HTML file at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/generate-pdf', async (req, res) => {
    const {
        firstName,
        lastName,
        glucose,
        creatinine,
        uricAcid,
        cholesterolTotal,
        cholesterolHDL,
        cholesterolLDL,
        triglyceride
    } = req.body;

    console.log('Received data:', req.body);  // Log the received data

    try {
        const pdfDoc = await PDFDocument.load(await readFile('Testing.pdf'));
        const form = pdfDoc.getForm();
        const fields = form.getFields();

        // Define the Times New Roman font
        const timesNewRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);

        // Loop through each form field and set its appearance stream to use Times New Roman font and font size 13
        fields.forEach(field => {
            field.defaultUpdateAppearances(timesNewRoman, '/TiRo 13 Tf 0 g');
        });

        // Set values for specific fields by their names
        form.getTextField('Glucose').setText(glucose);
        form.getTextField('Creatinine').setText(creatinine);
        form.getTextField('Uric Acid').setText(uricAcid);
        form.getTextField('Cholesterol Total').setText(cholesterolTotal);
        form.getTextField('Cholesterol HDL').setText(cholesterolHDL);
        form.getTextField('Cholesterol LDL').setText(cholesterolLDL);
        form.getTextField('Triglyceride').setText(triglyceride);

        // Flatten the form to make fields non-editable and set appearances
        form.flatten();

        // Save the filled and flattened PDF
        const pdfBytes = await pdfDoc.save();

        // Set response to download the generated PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=Result_${lastName}.pdf`);
        res.send(Buffer.from(pdfBytes));

        console.log('PDF generated successfully');  // Log successful generation
    } catch (error) {
        console.log('Error generating PDF:', error);  // Log any errors
        res.status(500).send('Error generating PDF');
    }
});

// Change the port number here
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
