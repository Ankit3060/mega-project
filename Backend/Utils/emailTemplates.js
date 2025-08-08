export const generateVerificationOtpEmailTemplate = (otpCode) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7fafc;">
    
    <!-- Main Container -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; min-height: 100vh;">
        
        <!-- Email Container -->
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); overflow: hidden;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #4c51bf 0%, #553c9a 100%); padding: 30px 40px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                    🔐 Email Verification
                </h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
                    Secure your account with OTP verification
                </p>
            </div>
            
            <!-- Content -->
            <div style="padding: 50px 40px;">
                
                <!-- Greeting -->
                <div style="text-align: center; margin-bottom: 40px;">
                    <h2 style="color: #2d3748; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">
                        Verify Your Identity
                    </h2>
                    <p style="color: #718096; font-size: 16px; line-height: 1.6; margin: 0;">
                        We've sent you a One-Time Password to complete your verification. 
                        Please enter the code below to proceed.
                    </p>
                </div>
                
                <!-- OTP Code Display -->
                <div style="text-align: center; margin: 40px 0;">
                    <div style="display: inline-block; background: linear-gradient(135deg, #edf2f7 0%, #f7fafc 100%); border: 3px solid #e2e8f0; border-radius: 16px; padding: 25px 35px; box-shadow: 0 8px 20px rgba(0,0,0,0.08);">
                        <div style="color: #2d3748; font-size: 36px; font-weight: 800; letter-spacing: 12px; font-family: 'Courier New', monospace; margin: 0;">
                            ${otpCode}
                        </div>
                    </div>
                </div>
                
                <!-- Instructions -->
                <div style="background: #f8f9ff; border-left: 4px solid #4c51bf; padding: 20px 25px; border-radius: 8px; margin: 30px 0;">
                    <h3 style="color: #4c51bf; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">
                        📝 How to use this code:
                    </h3>
                    <ul style="color: #4a5568; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                        <li>Copy the 6-digit code above</li>
                        <li>Return to the verification page</li>
                        <li>Paste or type the code in the verification field</li>
                        <li>Click "Verify" to complete the process</li>
                    </ul>
                </div>
                
                <!-- Important Notice -->
                <div style="text-align: center; margin: 30px 0;">
                    <div style="background: #fff5f5; border: 1px solid #fed7d7; color: #c53030; padding: 15px; border-radius: 8px; font-size: 14px;">
                        ⚠️ <strong>Important:</strong> This code expires in <strong>15 minutes</strong> for security reasons.
                    </div>
                </div>
                
            </div>
            
            <!-- Footer -->
            <div style="background: #f7fafc; padding: 30px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #718096; margin: 0 0 15px 0; font-size: 14px; line-height: 1.5;">
                    If you didn't request this verification, please ignore this email or contact our support team.
                </p>
                
                <div style="margin-top: 20px;">
                    <p style="color: #4a5568; margin: 0; font-size: 16px;">
                        Best regards,<br/>
                        <strong style="color: #4c51bf; font-size: 18px;">Team AK Blog</strong>
                    </p>
                </div>
                
                <!-- Social Links or Additional Info -->
                <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                    <p style="color: #a0aec0; font-size: 12px; margin: 0;">
                        This is an automated message. Please do not reply to this email.
                    </p>
                </div>
            </div>
            
        </div>
        
        <!-- Bottom Spacer -->
        <div style="height: 40px;"></div>
        
    </div>
    
</body>
</html>`;
};



export const generateSuccessfulSubmissionBlogTemplate = (blogTitle, blogUrl, authorName) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog Published Successfully</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f9ff;">
    
    <!-- Main Container -->
    <div style="background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #6366f1 100%); padding: 40px 20px; min-height: 100vh;">
        
        <!-- Email Container -->
        <div style="max-width: 650px; margin: 0 auto; background: white; border-radius: 24px; box-shadow: 0 25px 50px rgba(0,0,0,0.15); overflow: hidden;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 40px; text-align: center; position: relative;">
                <!-- Success Icon -->
                <div style="background: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; border: 3px solid rgba(255,255,255,0.3);">
                    <span style="font-size: 40px;">✅</span>
                </div>
                <h1 style="color: white; margin: 0 0 10px 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                    Blog Published Successfully!
                </h1>
                <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 18px; font-weight: 400;">
                    Your content is now live and ready for readers
                </p>
            </div>
            
            <!-- Content -->
            <div style="padding: 50px 40px;">
                
                <!-- Congratulations Message -->
                <div style="text-align: center; margin-bottom: 40px;">
                    <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 26px; font-weight: 600;">
                        🎉 Congratulations, ${authorName}!
                    </h2>
                    <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0;">
                        Your blog post has been successfully published. 
                        It's now live and accessible to our community of readers.
                    </p>
                </div>
                
                <!-- Blog Details Card -->
                <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 2px solid #e2e8f0; border-radius: 20px; padding: 30px; margin: 30px 0; box-shadow: 0 8px 20px rgba(0,0,0,0.06);">
                    <h3 style="color: #1e40af; margin: 0 0 20px 0; font-size: 20px; font-weight: 600; display: flex; align-items: center;">
                        📝 Your Published Blog
                    </h3>
                    
                    <div style="background: white; padding: 25px; border-radius: 12px; border-left: 5px solid #3b82f6;">
                        <h4 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; line-height: 1.4;">
                            "${blogTitle}"
                        </h4>
                        <p style="color: #6b7280; margin: 0 0 20px 0; font-size: 14px;">
                            Published by <strong>${authorName}</strong> • Just now
                        </p>
                        
                        <!-- Call-to-Action Button -->
                        <div style="text-align: center; margin-top: 25px;">
                            <a href="${blogUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; text-decoration: none; padding: 15px 35px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3); transition: all 0.3s ease;">
                                🔗 View Your Blog Post
                            </a>
                        </div>
                    </div>
                </div>
                
                <!-- What's Next Section -->
                <div style="background: #fefce8; border: 2px solid #fde047; border-radius: 16px; padding: 25px; margin: 30px 0;">
                    <h3 style="color: #a16207; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                        🚀 What's Next?
                    </h3>
                    <ul style="color: #92400e; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.7;">
                        <li><strong>Share your blog:</strong> Copy the link and share it on social media</li>
                        <li><strong>Engage with readers:</strong> Respond to comments and feedback</li>
                        <li><strong>Track performance:</strong> Monitor views and engagement in your dashboard</li>
                        <li><strong>Write more:</strong> Keep your readers engaged with regular content</li>
                    </ul>
                </div>
                
                <!-- Share Options -->
                <div style="text-align: center; margin: 40px 0;">
                    <h3 style="color: #374151; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">
                        📢 Share Your Blog
                    </h3>
                    <p style="color: #6b7280; margin: 0 0 20px 0; font-size: 14px;">
                        Spread the word about your latest post:
                    </p>
                    <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
                        <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(blogUrl)}&text=${encodeURIComponent('Check out my latest blog post: ' + blogTitle)}" style="display: inline-block; background: #1da1f2; color: white; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 500;">
                            🐦 Twitter
                        </a>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blogUrl)}" style="display: inline-block; background: #4267b2; color: white; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 500;">
                            📘 Facebook
                        </a>
                        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(blogUrl)}" style="display: inline-block; background: #0077b5; color: white; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 500;">
                            💼 LinkedIn
                        </a>
                    </div>
                </div>
                
                <!-- Stats Preview -->
                <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-radius: 12px; padding: 20px; margin: 30px 0; text-align: center;">
                    <p style="color: #6b7280; margin: 0; font-size: 14px;">
                        📊 Your blog is now part of the  community with <strong>10,000+</strong> active readers
                    </p>
                </div>
                
            </div>
            
            <!-- Footer -->
            <div style="background: #f9fafb; padding: 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                <div style="margin-bottom: 20px;">
                    <h4 style="color: #374151; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">
                        Need Help?
                    </h4>
                    <p style="color: #6b7280; margin: 0 0 15px 0; font-size: 14px; line-height: 1.5;">
                        Have questions about your blog or need assistance? We're here to help!
                    </p>
                    <a href="mailto:dtspecial330660@gmail.com" style="color: #3b82f6; text-decoration: none; font-weight: 500; font-size: 14px;">
                        📧 Contact Support
                    </a>
                </div>
                
                <div style="margin-top: 30px;">
                    <p style="color: #4b5563; margin: 0; font-size: 16px;">
                        Keep writing amazing content!<br/>
                        <strong style="color: #3b82f6; font-size: 20px;">The AK Blog Team</strong>
                    </p>
                </div>
                
                <!-- Social Links -->
                <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                        Follow us for writing tips and community updates
                    </p>
                </div>
            </div>
            
        </div>
        
        <!-- Bottom Spacer -->
        <div style="height: 40px;"></div>
        
    </div>
    
</body>
</html>`;
};