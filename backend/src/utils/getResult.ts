import puppeteer, { Page } from 'puppeteer';
import { captchaSolver } from './captchaSolve';
import * as cheerio from 'cheerio';

interface Result {
    rollNo?: string;
    name?: string;
    resultDes?: string;
    cgpa?: string;
    error?: string;
    NotFound?: string;
    WrongCaptcha?: string;
    msg?: string;
}

const result = async (EnrollmentNo: string): Promise<Result> => {
    let wrongCaptcha = false;
    let notFound = false;

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page: Page = await browser.newPage();

        page.on('dialog', async dialog => {
            const message = dialog.message();
            if (dialog.type() === 'alert' && message.includes('you have entered a wrong text')) {
                wrongCaptcha = true;
                await dialog.accept();
                return { error: 'Wrong captcha' };
            } else if (dialog.type() === 'alert' && message.includes('Result for this Enrollment No. not Found')) {
                notFound = true;
                await dialog.accept();
                return { response: 'Not found' };
            }
        });

        await page.goto('http://result.rgpv.ac.in/');
        await page.waitForSelector('input[id="radlstProgram_1"]', { visible: true });

        await Promise.all([
            page.click('input[id="radlstProgram_1"]'),
            page.waitForNavigation({ waitUntil: 'networkidle0' })
        ]);

        await page.type('input[name="ctl00$ContentPlaceHolder1$txtrollno"]', EnrollmentNo);
        await page.select('select[name="ctl00$ContentPlaceHolder1$drpSemester"]', '6');
        await page.click('input[id="ctl00_ContentPlaceHolder1_rbtnlstSType_0"]');

        const captchaUrl = await page.$eval('img[src*="CaptchaImage.axd"]', (el: any) => el.src);
        const captchaString = await captchaSolver(captchaUrl);
        if (captchaString === null) {
            await page.close();
            return { error: "Captcha is null" };
        }
        const captcha = captchaString.replace(/\s+/g, '').toUpperCase();
        await page.type('input[name="ctl00$ContentPlaceHolder1$TextBox1"]', captcha);

        await page.click('input[name="ctl00$ContentPlaceHolder1$btnviewresult"]');

        const content = await page.content();
        await browser.close();

        if (wrongCaptcha) {
            return { WrongCaptcha: "Wrong Captcha!" };
        }

        if (notFound) {
            return { NotFound: "Not found" };
        }

        const $ = cheerio.load(content);

        const rollNo = $('input[name="ctl00$ContentPlaceHolder1$txtrollno"]').val() as string | undefined;
        const name = $('#ctl00_ContentPlaceHolder1_lblNameGrading').text().trim();
        const resultDes = $('#ctl00_ContentPlaceHolder1_lblResultNewGrading').text().trim();
        const cgpa = $('#ctl00_ContentPlaceHolder1_lblcgpa').text().trim();

        if (rollNo) {
            const result =  { rollNo, name, resultDes, cgpa };
            return result;
        }

        return { msg: "I don't know what happened" };

    } catch (err: any) {
        return { error: err.message };
    }
};

export default result;