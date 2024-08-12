import {ApiProperty} from '@nestjs/swagger';

export class SignInDto {
    @ApiProperty({default: "andre@gmail.com"})
    email: string;

    @ApiProperty({default: "12345678"})
    password: string;
}