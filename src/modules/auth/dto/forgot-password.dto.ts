import { ApiProperty } from "@nestjs/swagger";

export class ForgotPasswordDto {
    @ApiProperty({
        description: 'Insira o email para recuperar a senha',
        default: 'andre@gmail.com'
    })
    email: string;
}