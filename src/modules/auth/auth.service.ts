import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { NodemailerService } from 'src/services/nodemailer.service';
import { v4 as uuidV4 } from "uuid";
import { TokensService } from '../tokens/tokens.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private nodemailerService: NodemailerService,
        private tokensService: TokensService
    ) { }

    async signIn(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) throw new UnauthorizedException();

        const passwordHash = compareSync(pass, user.password);
        if (!passwordHash) throw new UnauthorizedException();

        const { password, ...result } = user;
        const payload = {
            sub: user.id,
            ...result
        }

        return {
            user: result,
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async forgotPassword(email: string) {
        try {
            const user = await this.usersService.findOneByEmail(email);
            if (!user) throw new UnauthorizedException();

            const refresh_token = uuidV4();
            const expires_date = new Date();
            expires_date.setHours(expires_date.getHours() + 3);

            const userToken = await this.tokensService.create({
                expires_date,
                refresh_token,
                user
            });

            const messageOptions = {
                email: email,
                token: refresh_token,
                title: 'Recuperação de senha',
                body: `http://localhost:3000/recover-password?token=${refresh_token}&user=${user.id}`
            }

            const response = await this.nodemailerService.sendEmail(messageOptions);
            if (!response.success) {
                throw new Error("Falha ao enviar email com recuperação de senha.")
            }

            return {
                success: true,
                message: "Email com recuperação de senha enviado com sucesso.",
                result: {
                    refresh_token: userToken.result.refresh_token,
                    expires_date: userToken.result.expires_date
                }
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const { newPassword, repeatPassword, token, currentPassword, userId } = resetPasswordDto;
        try {
            if(token) {
                const tokenValid = await this.tokensService.findOne(token).then(res => res.result);
                
                if(!tokenValid) throw new Error('Token inválido.');
                if(newPassword != repeatPassword) throw new Error('As senhas devem ser iguais.');

                const {success} = await this.usersService.updatePassword(tokenValid.user.id, newPassword);
                if(!success) throw new Error('Erro ao atualizar senha');
            } else {
                const user = await this.usersService.findOne(userId).then(res => res.result);
                if(!user) throw new Error('Usuário não existe');
                if(newPassword != repeatPassword) throw new Error('As senhas devem ser iguais.');

                console.log(user, currentPassword);

                const passwordValid = compareSync(currentPassword, user.password)
                if(!passwordValid) throw new UnauthorizedException();

                const {success} = await this.usersService.updatePassword(userId, newPassword);
                if(!success) throw new Error('Erro ao atualizar senha');
            }
            return {
                success: true,
                message: 'Senha atualizada com sucesso'
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }
}
