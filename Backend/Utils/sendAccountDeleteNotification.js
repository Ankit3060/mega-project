import { generateAccountDeleteTemplate } from "./emailTemplates.js";
import { sendEmail } from "./sendEmail.js";

export async function sendAccountDeleteNotification(verifyLink, otp, email){
    try {
        const message = generateAccountDeleteTemplate(verifyLink, otp);
        sendEmail({
            email,
            subject: "Account Not Verified Verify now",
            message
        });

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Account deletion notification sent successfully"
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error sending account deletion notification"
        });
    }
} 