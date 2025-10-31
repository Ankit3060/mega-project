import { generatePasswordResetEmailTemplate } from "./emailTemplates.js";
import { sendEmail } from "./sendEmail.js";

export async function sendPasswordResetCode(resetPasswordUrl, email, res){
    try {
        const message = generatePasswordResetEmailTemplate(resetPasswordUrl);
        sendEmail({
            email,
            subject: "Password Reset Code from Quick Blog Team",
            message
        });

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Verification code sent successfully"
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error sending verification code"
        });
    }
} 