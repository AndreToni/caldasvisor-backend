import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { TypeUser } from "src/enums/type-user.enum";

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: jwtConstants.secret
                }
            );
            if(payload.type != TypeUser.admin) throw new UnauthorizedException('Você não está autorizado, precisa ser um organizador ou admin.', { cause: new Error(), description: 'Some error description' });

            request['user'] = payload;
        } catch (error) {
            throw new UnauthorizedException('Você não está autorizado, precisa ser um organizador ou admin.', { cause: new Error(), description: 'Some error description' });
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        /* @ts-ignore */
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}