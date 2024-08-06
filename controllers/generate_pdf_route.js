const global = require('./global');
const { appdata } = require("../models/data");
const helper = require('./helpers');
const { PDFDocument, StandardFonts } = require('pdf-lib');
const { readFile } = require('fs/promises');
const nodemailer = require('nodemailer');

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
            name,
            age,
            sex,
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

            console.log('Received data:', req.body);  
            const dir = 'public/common/pdfTemplates/';

            try {
                const pdfDoc = await PDFDocument.load(await readFile(dir + 'HematologyTemplate.pdf'));
                const form = pdfDoc.getForm();
                const fields = form.getFields();
        
                // Define the Times New Roman font
                const timesNewRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
                const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
                console.log(fields.map(field => field.getName())); 

                const today = new Date();

                let month = today.getMonth() + 1;
                let day = today.getDate();
                let year = today.getFullYear();
                
                form.getTextField('Name').setText(name.toUpperCase());
                form.getTextField('Age/Sex').setText(age + "/" + sex);
                form.getTextField('Date').setText(month+ "/" + day + "/" + year);

                let lastName = JSON.stringify(global.userFname[0]);
                let firstName = JSON.stringify(global.userFname[1]);
                lastName = lastName.replace("\"", "").replace(",", "").replace("\"", "");
                firstName = firstName.replace("\"", "").replace(",", "").replace("\"", "");

                form.getTextField('Physician').setText(firstName + " " + lastName);
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

                fields.forEach(field => {
                    field.defaultUpdateAppearances(timesBold, '/F1 13 Tf 0 g');
                });

                form.getTextField('Age/Sex').updateAppearances(timesNewRoman);
                form.getTextField('Date').updateAppearances(timesNewRoman);
                form.getTextField('Physician').updateAppearances(timesNewRoman);
                
                form.getTextField('validator').setText(info[0].validator.toUpperCase());
                form.getTextField('validator').updateAppearances(timesNewRoman);
                form.getTextField('validator').defaultUpdateAppearances(timesBold);
                form.getTextField('validator-num').setText(info[0].prcnum);
                form.getTextField('validator-num').updateAppearances(timesNewRoman);
                form.getTextField('validator-num').defaultUpdateAppearances(timesBold);
                
        
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
            name,
            age,
            sex,
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

        console.log('Received data:', req.body);  
        const dir = 'public/common/pdfTemplates/';
        
        try {
            const pdfDoc = await PDFDocument.load(await readFile(dir + 'ClinicalMicroscopyTemplate.pdf'));
            const form = pdfDoc.getForm();
            const fields = form.getFields();
        
            // Define the Times New Roman font
            const timesNewRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
            const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
            console.log(fields.map(field => field.getName())); 

            const today = new Date();

            let month = today.getMonth() + 1;
            let day = today.getDate();
            let year = today.getFullYear();
            
            form.getTextField('Name').setText(name.toUpperCase());
            form.getTextField('AgeSex').setText(age + "/" + sex);
            form.getTextField('Date').setText(month+ "/" + day + "/" + year);

            let lastName = JSON.stringify(global.userFname[0]);
            let firstName = JSON.stringify(global.userFname[1]);
            lastName = lastName.replace("\"", "").replace(",", "").replace("\"", "");
            firstName = firstName.replace("\"", "").replace(",", "").replace("\"", "");

            form.getTextField('Physician').setText(firstName + " " + lastName);
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

            fields.forEach(field => {
                field.defaultUpdateAppearances(timesBold, '/F1 13 Tf 0 g');
            });

            form.getTextField('AgeSex').updateAppearances(timesNewRoman);
            form.getTextField('Date').updateAppearances(timesNewRoman);
            form.getTextField('Physician').updateAppearances(timesNewRoman);
            
                form.getTextField('validator').setText(info[0].validator.toUpperCase());
                form.getTextField('validator').updateAppearances(timesNewRoman);
                form.getTextField('validator').defaultUpdateAppearances(timesBold);
                form.getTextField('validator-num').setText(info[0].prcnum);
                form.getTextField('validator-num').updateAppearances(timesNewRoman);
                form.getTextField('validator-num').defaultUpdateAppearances(timesBold);
            
        
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
        const {
            result,
            parameter,
            unit,
            multUnit,
            info
        } = req.body;

            console.log('Received data:', req.body);  
            const dir = 'public/common/pdfTemplates/';

            try {
                const pdfDoc = await PDFDocument.load(await readFile(dir + 'ChemistryTemplate.pdf'));
                const form = pdfDoc.getForm();
                const fields = form.getFields();
        
                // Define the Times New Roman font
                const timesNewRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
                const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
                console.log(fields.map(field => field.getName())); 

                const today = new Date();

                let month = today.getMonth() + 1;
                let day = today.getDate();
                let year = today.getFullYear();
                
                form.getTextField('Name').setText(info[0].name.toUpperCase());
                form.getTextField('Name').defaultUpdateAppearances(timesBold);
                form.getTextField('Age/Sex').setText(info[0].age + "/" + info[0].sex);
                form.getTextField('Date').setText(month+ "/" + day + "/" + year);

                let lastName = JSON.stringify(global.userFname[0]);
                let firstName = JSON.stringify(global.userFname[1]);
                lastName = lastName.replace("\"", "").replace(",", "").replace("\"", "");
                firstName = firstName.replace("\"", "").replace(",", "").replace("\"", "");

                form.getTextField('Physician').setText(firstName + " " + lastName);

                // Set values for specific fields by their names
                parameter.forEach((paramObj, index) => {
                    const key = Object.keys(paramObj)[0];
                    const value = paramObj[key];
                    form.getTextField(`${key}`).setText(value);
                });

                result.forEach((paramObj, index) => {
                    const key = Object.keys(paramObj)[0];
                    const value = paramObj[key];
                    form.getTextField(`${key}`).setText(value);
                })

                unit.forEach((paramObj, index) => {
                    const key = Object.keys(paramObj)[0];
                    const value = paramObj[key];
                    form.getTextField(`${key}`).setText(value);
                })

                multUnit.forEach((paramObj, index) => {
                    const key = Object.keys(paramObj)[0];
                    const value = paramObj[key];
                    form.getTextField(`${key}`).setText(value);
                })
        
                fields.forEach(field => {
                    field.defaultUpdateAppearances(timesBold, '/F1 13 Tf 0 g');
                });

                form.getTextField('Age/Sex').updateAppearances(timesNewRoman);
                form.getTextField('Date').updateAppearances(timesNewRoman);
                form.getTextField('Physician').updateAppearances(timesNewRoman);
                
                form.getTextField('validator').setText(info[0].validator.toUpperCase());
                form.getTextField('validator').updateAppearances(timesNewRoman);
                form.getTextField('validator').defaultUpdateAppearances(timesBold);
                form.getTextField('validator-num').setText(info[0].prcnum);
                form.getTextField('validator-num').updateAppearances(timesNewRoman);
                form.getTextField('validator-num').defaultUpdateAppearances(timesBold);
                

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
        const {
            result,
            parameter,
            info
        } = req.body;

            console.log('Received data:', req.body);  
            const dir = 'public/common/pdfTemplates/';
            try {
                const pdfDoc = await PDFDocument.load(await readFile(dir + 'SerologyTemplate.pdf'));
                const form = pdfDoc.getForm();
                const fields = form.getFields();
        
                // Define the Times New Roman font
            // Define the Times New Roman font
            const timesNewRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
            const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
            console.log(fields.map(field => field.getName())); 

            const today = new Date();

            let month = today.getMonth() + 1;
            let day = today.getDate();
            let year = today.getFullYear();
            
            form.getTextField('Name').setText(info[0].name.toUpperCase());
            form.getTextField('Name').defaultUpdateAppearances(timesBold);
            form.getTextField('Age/Sex').setText(info[0].age + "/" + info[0].sex);
            form.getTextField('Date').setText(month+ "/" + day + "/" + year);

            let lastName = JSON.stringify(global.userFname[0]);
            let firstName = JSON.stringify(global.userFname[1]);
            lastName = lastName.replace("\"", "").replace(",", "").replace("\"", "");
            firstName = firstName.replace("\"", "").replace(",", "").replace("\"", "");

            form.getTextField('Physician').setText(firstName + " " + lastName);
                // Set values for specific fields by their names
                parameter.forEach((paramObj, index) => {
                    const key = Object.keys(paramObj)[0];
                    const value = paramObj[key];
                    form.getTextField(`${key}`).setText(value);
                });

                result.forEach((paramObj, index) => {
                    const key = Object.keys(paramObj)[0];
                    const value = paramObj[key];
                    form.getTextField(`${key}`).setText(value);
                })

                fields.forEach(field => {
                    field.defaultUpdateAppearances(timesBold, '/F1 13 Tf 0 g');
                });

                form.getTextField('Age/Sex').updateAppearances(timesNewRoman);
                form.getTextField('Date').updateAppearances(timesNewRoman);
                form.getTextField('Physician').updateAppearances(timesNewRoman);
                form.getTextField('validator').setText(info[0].validator.toUpperCase());
                form.getTextField('validator').updateAppearances(timesNewRoman);
                form.getTextField('validator').defaultUpdateAppearances(timesBold);
                form.getTextField('validator-num').setText(info[0].prcnum);
                form.getTextField('validator-num').updateAppearances(timesNewRoman);
                form.getTextField('validator-num').defaultUpdateAppearances(timesBold);
        
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
    router.post('/send-pdf-to-email', async (req, res) => {
        const { requestID, category, email, pdfData } = req.body;
    
        // Create a transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'bioscopicdiagnosticlaboratory@gmail.com',
                pass: 'ceht usoq zmxc gckd'
            }
        });
    
        // Send mail with defined transport object
        try {
            let info = await transporter.sendMail({
                from: '"Bioscopic Diagnostic Laboratory" <your-email@gmail.com>', // sender address
                to: email, // list of receivers
                subject: category.charAt(0).toUpperCase() + category.slice(1).toLowerCase() + ' Test Results', // Subject line
                text: 'Please find attached your '+ category +' test results.', // plain text body
                attachments: [
                    {
                        filename: requestID + "_" + 'TestResult_'+ category + '.pdf',
                        content: pdfData,
                        encoding: 'base64',
                        contentType: 'application/pdf'
                    }
                ]
            });
    
            console.log('Message sent: %s', info.messageId);
            res.status(200).send('Email sent successfully');
        } catch (error) {
            console.log('Error sending email:', error);
            res.status(500).send('Error sending email');
        }
    });

    router.post('/send-pdf-to-reg-email', async (req, res) => {
        const { requestID, patientID, category, pdfData } = req.body;
        let email;
        
        try {
            const patient = await patientModel.findOne({ patientID: patientID }).lean();
            email = patient.email;
        } catch (error) {
            console.error('Error fetching patient:', error);
            return res.status(500).send('Error fetching patient data');
        }
        
        console.log(email)

        if (email === "N/A") {
            return res.status(400).send('No registered email address');
        } else if (!email) {
            return res.status(400).send('Invalid email address');
        }

        // Create a transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'bioscopicdiagnosticlaboratory@gmail.com',
                pass: 'ceht usoq zmxc gckd'
            }
        });
        
        // Send mail with defined transport object
        try {
            let info = await transporter.sendMail({
                from: '"Bioscopic Diagnostic Laboratory" <your-email@gmail.com>', // sender address
                to: email, // list of receivers
                subject: category.charAt(0).toUpperCase() + category.slice(1).toLowerCase() + ' Test Results', // Subject line
                text: 'Please find attached your '+ category +' test results.', // plain text body
                attachments: [
                    {
                        filename: requestID + "_" + 'TestResult_'+ category + '.pdf',
                        content: pdfData,
                        encoding: 'base64',
                        contentType: 'application/pdf'
                    }
                ]
            });
    
            console.log('Message sent: %s', info.messageId);
            res.status(200).send('Email sent successfully');
        } catch (error) {
            console.log('Error sending email:', error);
            res.status(500).send('Error sending email');
        }
    });
}

module.exports.add = add;