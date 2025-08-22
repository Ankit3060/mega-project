import { generatePostUpdatedSuccessfullyTemplate } from "./emailTemplates.js";
import { sendEmail } from "./sendEmail.js";

export async function sendSuccessfulPostUpdateMail(postUrl, email){
    try {
        const message = generatePostUpdatedSuccessfullyTemplate(postUrl);
        sendEmail({
            email: email,
            subject: "Post published successfully",
            message
        });

        console.log(`Sending post updated mail to ${email}`);
    } catch (error) {
        console.error("Error sending notification:", error.message);
        throw error;
    }
} 