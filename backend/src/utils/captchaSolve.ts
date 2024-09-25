import fs from "fs";
import axios from "axios";
import Tesseract from "tesseract.js";
import { createCanvas, loadImage } from "canvas";

const time = Date.now();

const image = `./image/captcha${time}.jpg`;

const downloadImage = async (imageUrl: string, outputPath: string): Promise<string> => {
    try {
        const response = await axios({ method: "get", url: imageUrl, responseType: "stream" });
        return new Promise((resolve, reject) => {
            response.data.pipe(fs.createWriteStream(outputPath))
                .on("close", () => resolve(outputPath))
                .on("error", (err: Error) => {
                    console.error("Error downloading image:", err);
                    reject(err);
                });
        });
    } catch (err) {
        console.error("Error in axios request:", err);
        throw err;
    }
};

// Function to process the image using canvas
const processImage = async (imagePath: string): Promise<string> => {
    try {
        const image = await loadImage(imagePath);
        const canvas = createCanvas(image.width, image.height);
        const context = canvas.getContext("2d");

        // Draw the image onto the canvas
        context.drawImage(image, 0, 0, image.width, image.height);
        const captchaDataUrl = canvas.toDataURL("image/png");

        return captchaDataUrl;
    } catch (err) {
        console.error("Error processing image:", err);
        throw err;
    }
};

// Function to solve the captcha using Tesseract.js
const solveCaptcha = async (captchaDataUrl: string): Promise<string> => {
    try {
        const result = await Tesseract.recognize(captchaDataUrl);
        return result.data.text.trim();
    } catch (err) {
        console.error("Error solving captcha:", err);
        throw err;
    }
};

// Main function to handle captcha solving
const captchaSolver = async (imageUrl: string): Promise<string | null> => {
  
    try {
        // Step 1: Download the captcha image
        const downloadedImagePath = await downloadImage(imageUrl, image);

        // Step 2: Process the image using canvas
        const captchaDataUrl = await processImage(downloadedImagePath);

        // Step 3: Solve the captcha using Tesseract.js
        const solvedCaptcha = await solveCaptcha(captchaDataUrl);

        return solvedCaptcha;
    } catch (err) {
        console.error("Failed to solve captcha:", err);
        return null;
    }
};

export { captchaSolver };
