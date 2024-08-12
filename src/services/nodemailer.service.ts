import * as nodemailer from "nodemailer";

interface SendEmailProps {
    email: string;
    body?: string;
    title?: string;
    token: string;
}

export class NodemailerService {
    constructor() { }

    async sendEmail({ email, body, title, token }: SendEmailProps) {
        try {
            let transporter = nodemailer.createTransport({
              service: 'gmail',
                auth: {
                    user: 'caldasvisor@gmail.com',
                    pass: 'q k p d n x p w d p l l q u v h'
                }
            })
            let info = await transporter.sendMail({
                from: 'caldasvisor@gmail.com',
                to: email,
                subject: 'Recuperação de senha',
                text: title,
                html: `
                <html>
                 <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Recuperação de Senha - Caldas Visor</title>
                  <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                        color: #333;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 20px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        padding: 10px 0;
                    }
                    .header img {
                        width: 150px;
                    }
                    .content {
                        padding: 20px 0;
                        text-align: center;
                    }
                    .content h1 {
                        color: #333;
                    }
                    .content p {
                        color: #666;
                    }
                    .button {
                        display: inline-block;
                        padding: 16px 64px;
                        background-color: #F06111;
                        color: #ffffff; /* Define a cor da fonte como branca */
                        text-decoration: none;
                        border-radius: 4px;
                        font-family: Arial, sans-serif; /* Define a família de fontes */
                        font-size: 16px; /* Define o tamanho da fonte */
                        text-align: center; /* Centraliza o texto dentro do botão */
                    }
                    .button:hover {
                        background-color: #d54d0a; /* Muda a cor de fundo ao passar o mouse */
                    }
                    .footer {
                        text-align: center;
                        padding: 20px 0;
                        color: #999;
                        font-size: 12px;
                    }
                  </style>
              </head>
              <body>
                <div class="container">
                    <div class="header">
                        <img src="https://caldasvisor-frontend.vercel.app/LogoVerticalFullColor.png" alt="CaldasVisor Logo">
                    </div>
                    <div class="content">
                        <h1>Recuperação de Senha</h1>
                        <p>Olá,</p>
                        <p>Recebemos uma solicitação para redefinir a senha da sua conta no CaldasVisor. Se você não solicitou essa alteração, ignore este e-mail.</p>
                        <p>Para redefinir sua senha, clique no botão abaixo:</p>
                        <a href="${body}" class="button" style="color: #ffffff; text-decoration: none; display: inline-block; padding: 16px 64px; background-color: #F06111; border-radius: 4px;">Redefinir Senha</a>

                        <p>Se o botão acima não funcionar, copie e cole o seguinte link no seu navegador:</p>
                        <p><a href="${body}">${body}</a></p>
                    </div>
                    <div class="footer">
                        <p>© 2024 CaldasVisor. Todos os direitos reservados.</p>
                    </div>
                </div>
              </body>
              </html>
              `,
            })

            return {
                success: true,
                message: info.response
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }
}