const emailVerificationTemplate = (username, verificationLink) => {
  return `
    <html>
      <head>
        <title>Email Verification</title>
      </head>
      <body>
        <h1>Email Verification</h1>
        <p>Hello ${username},</p>
        <p>Please click the link below to verify your email:</p>
        <a href="${verificationLink}">Verify Email</a>
      </body>
    </html>
  `;
};

export default emailVerificationTemplate