import { VERIFICATION_EMAIL_TEMPLATE } from "./emailtemplate.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";


export const sendVerificationEmail = async(email, name, verificationToken) =>{
    // const recipient = [{email}];
    const recipient = [{ email: 'newguidancestudies@gmail.com'}];
    try {
    const response = await mailtrapClient.send({
        from: sender,
        to: recipient,
        subject: "verify your email",
        html: VERIFICATION_EMAIL_TEMPLATE.replace("{name}", name).replace("{verificationCode}", verificationToken),
        category: "Email Verification",
    })
    console.log('email sent successfully ', response);
    
    } catch (error) {
        console.error(`error sending verification email`, error);
        throw new Error(`error sending verification email: ${error}`);

    }
}


export const sendWelcomeEmail = async (email, name) => {
	// const recipient = [{ email }];
    const recipient = [{ email: 'newguidancestudies@gmail.com'}];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Welcome to Blogify",
            text: "Welcome to our site, Login and start created post ...",
            category: "Welcome Email"
		});

		console.log("Welcome email sent successfully", response);
	} catch (error) {
		console.error(`Error sending welcome email, error`);

		throw new Error(`Error sending welcome email: ${error}`);
	}
};