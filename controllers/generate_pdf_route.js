const global = require('./global');
const { appdata } = require("../models/data");
const helper = require('./helpers');
const { PDFDocument, StandardFonts } = require('pdf-lib');
const { readFile } = require('fs/promises');

const {
    userModel,
    patientModel,
    requestModel,
    hematologyModel,
    urinalysisModel,
    fecalysisModel,
    chemistryModel,
    serologyModel,
    // Use this model to look for the corresponding test
    // Note: Can't query specific values of tests, use other
    // Models to query a specific category
    allTestModel
} = appdata;

function add(router) {
    router.post('/generate-pdf-hematology', async (req, res) => {
        const [{
            hemo,
            hema,
            rbc,
            wbc,
            neut,
            lymp,
            mono,
            eosi,
            baso,
            pltc
        }] = req.body;

            console.log('Received data:', req.body);  // Log the received data

            try {
                const pdfDoc = await PDFDocument.load(await readFile('HematologyTemplate.pdf'));
                const form = pdfDoc.getForm();
                const fields = form.getFields();
        
                // Define the Times New Roman font
                const timesNewRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
                console.log(fields.map(field => field.getName())); 
                // Loop through each form field and set its appearance stream to use Times New Roman font and font size 13
                fields.forEach(field => {
                    field.defaultUpdateAppearances(timesNewRoman, '/TiRo 13 Tf 0 g');
                });

                // Set values for specific fields by their names
            form.getTextField('Hemoglobin').setText(hemo);
                form.getTextField('Hematocrit').setText(hema);
                form.getTextField('RBC Count').setText(rbc);
                form.getTextField('WBC Count').setText(wbc);
                form.getTextField('Neutrophil').setText(neut);
                form.getTextField('Lymphocyte').setText(lymp);
                form.getTextField('Eosinophil').setText(eosi);
                form.getTextField('Basophil').setText(baso);
                form.getTextField('Monocyte').setText(mono);
                form.getTextField('Platelet Count').setText(pltc);

        
                // Flatten the form to make fields non-editable and set appearances
                form.flatten();
        
                // Save the filled and flattened PDF
                const pdfBytes = await pdfDoc.save();
        
                // Set response to download the generated PDF
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `inline; filename=Result_test.pdf`);
                res.send(Buffer.from(pdfBytes));
        
                console.log('PDF generated successfully');  // Log successful generation
            } catch (error) {
                console.log('Error generating PDF:', error);  // Log any errors
                res.status(500).send('Error generating PDF');
            }
    });
    router.post('/generate-pdf-clinical-microscopy', async (req, res) => {
        const [{
            clr,
            trans, 
            ph,
            spgrav,
            sug,
            pro,
            pus,
            rbc,
            bac,
            epi,
            muc,
            cons,
            ovapar,
            fat,
            bile,
            veg,
            meat,
            eryth,
            yeast
        }] = req.body;

        console.log('Received data:', req.body);  // Log the received data

        try {
            const pdfDoc = await PDFDocument.load(await readFile('ClinicalMicroscopyTemplate.pdf'));
            const form = pdfDoc.getForm();
            const fields = form.getFields();
        
            // Define the Times New Roman font
            const timesNewRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
            console.log(fields.map(field => field.getName())); 
            // Loop through each form field and set its appearance stream to use Times New Roman font and font size 13
            fields.forEach(field => {
                field.defaultUpdateAppearances(timesNewRoman, '/TiRo 13 Tf 0 g');
            });
        
            // Set values for specific fields by their names
            if (trans || ph || spgrav) {
                form.getTextField('Color_Urinal').setText(clr);
                form.getTextField('Pus_Urinal').setText(pus);
                form.getTextField('RBC_Urinal').setText(rbc);
                form.getTextField('Bacteria_Urinal').setText(bac);
                form.getTextField('Transparency').setText(trans);
                form.getTextField('pH').setText(ph);
                form.getTextField('Specific_Gravity').setText(spgrav);
                form.getTextField('Sugar').setText(sug);
                form.getTextField('Protein').setText(pro);
                form.getTextField('Epithelial_Cells').setText(epi);
                form.getTextField('Mucus_Thread').setText(muc);
            } else if (cons || ovapar || bile || veg || meat || eryth || yeast) {
                form.getTextField('Color_Fecal').setText(clr);
                form.getTextField('Pus_Fecal').setText(pus);
                form.getTextField('RBC_Fecal').setText(rbc);
                form.getTextField('Bacteria_Fecal').setText(bac);
                form.getTextField('Consistency').setText(cons);
                form.getTextField('Ova').setText(ovapar);
                form.getTextField('Fat_Globule').setText(fat);
                form.getTextField('Bile_Crystal').setText(bile);
                form.getTextField('Vegetable_Fiber').setText(veg);
                form.getTextField('Meat_Fiber').setText(meat);
                form.getTextField('Pus_Cells').setText(pus);
                form.getTextField('Erythrocyte').setText(eryth);
                form.getTextField('Yeast_Cells').setText(yeast);
            }

        
                // Flatten the form to make fields non-editable and set appearances
                form.flatten();
        
                // Save the filled and flattened PDF
                const pdfBytes = await pdfDoc.save();
        
                // Set response to download the generated PDF
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `inline; filename=Result_test.pdf`);
                res.send(Buffer.from(pdfBytes));
        
                console.log('PDF generated successfully');  // Log successful generation
            } catch (error) {
                console.log('Error generating PDF:', error);  // Log any errors
                res.status(500).send('Error generating PDF');
            }
    });
    router.post('/generate-pdf-chemistry', async (req, res) => {
        const [{
            fbs,
            crt,
            uric,
            chol,
            tri,
            hdl,
            ldl,
            vldl,
            bun,
            sgpt,
            sgot,
            hba1c
        }] = req.body;

            console.log('Received data:', req.body);  // Log the received data

            try {
                const pdfDoc = await PDFDocument.load(await readFile('ChemistryTemplate.pdf'));
                const form = pdfDoc.getForm();
                const fields = form.getFields();
        
                // Define the Times New Roman font
                const timesNewRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
                console.log(fields.map(field => field.getName())); 
                // Loop through each form field and set its appearance stream to use Times New Roman font and font size 13
                fields.forEach(field => {
                    field.defaultUpdateAppearances(timesNewRoman, '/TiRo 13 Tf 0 g');
                });

                // Set values for specific fields by their names
                form.getTextField('Glucose').setText(fbs);
                form.getTextField('Creatinine').setText(crt);
                form.getTextField('Uric_Acid').setText(uric);
                form.getTextField('Cholesterol_Total').setText(chol);
                form.getTextField('Triglycerides').setText(tri);
                form.getTextField('Cholesterol_HDL').setText(hdl);
                form.getTextField('Cholesterol_LDL').setText(ldl);
                form.getTextField('VLDL').setText(vldl);
                form.getTextField('BUN').setText(bun);
                form.getTextField('SGPT').setText(sgpt);
                form.getTextField('SGOT').setText(sgot);
                form.getTextField('HBA1C').setText(hba1c);
        
                // Flatten the form to make fields non-editable and set appearances
                form.flatten();
        
                // Save the filled and flattened PDF
                const pdfBytes = await pdfDoc.save();
        
                // Set response to download the generated PDF
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `inline; filename=Result_test.pdf`);
                res.send(Buffer.from(pdfBytes));
        
                console.log('PDF generated successfully');  // Log successful generation
            } catch (error) {
                console.log('Error generating PDF:', error);  // Log any errors
                res.status(500).send('Error generating PDF');
            }
    });
    router.post('/generate-pdf-serology', async (req, res) => {
        const [{
            hbsag,
            rprvdrl,
            preg,
            dengN,
            dengD
        }] = req.body;

            console.log('Received data:', req.body);  // Log the received data

            try {
                const pdfDoc = await PDFDocument.load(await readFile('SerologyTemplate.pdf'));
                const form = pdfDoc.getForm();
                const fields = form.getFields();
        
                // Define the Times New Roman font
                const timesNewRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
                console.log(fields.map(field => field.getName())); 
                // Loop through each form field and set its appearance stream to use Times New Roman font and font size 13
                fields.forEach(field => {
                    field.defaultUpdateAppearances(timesNewRoman, '/TiRo 13 Tf 0 g');
                });
                // Set values for specific fields by their names
                form.getTextField('HbsAg').setText(hbsag);
                form.getTextField('RPR').setText(rprvdrl);
                form.getTextField('Serum').setText(preg);
                form.getTextField('NS1').setText(dengN);
                form.getTextField('Duo').setText(dengD);

        
                // Flatten the form to make fields non-editable and set appearances
                form.flatten();
        
                // Save the filled and flattened PDF
                const pdfBytes = await pdfDoc.save();
        
                // Set response to download the generated PDF
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `inline; filename=Result_test.pdf`);
                res.send(Buffer.from(pdfBytes));
        
                console.log('PDF generated successfully');  // Log successful generation
            } catch (error) {
                console.log('Error generating PDF:', error);  // Log any errors
                res.status(500).send('Error generating PDF');
            }
    });
}

module.exports.add = add;