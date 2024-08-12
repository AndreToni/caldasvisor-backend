import { NestMiddleware, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response, NextFunction } from 'express';


@Injectable()
export class OrganizerMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService) { }

    use(req: Request, res: Response, next: NextFunction) {
        try {
            /* @ts-ignore */
            console.log(req.user);
            next();

        } catch (error) {
            console.log(error.message)
            res.status(403).json({ success: false, message: 'Você não está autorizado.' });
        }
    }
}