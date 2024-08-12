import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ResetPasswordDto {
    @ApiPropertyOptional()
    userId?: string;

    @ApiPropertyOptional()
    token?: string;

    @ApiPropertyOptional()
    currentPassword?: string;

    @ApiProperty()
    newPassword: string;

    @ApiProperty()
    repeatPassword: string;
}