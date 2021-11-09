import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { jwtConstants } from './jwt.constants';
import { Passport } from 'passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private db: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretKey: jwtConstants.secret,
    });
  }

  async validade(payload: { email: string }) {
    const user = await this.db.user.findUnique({
      where: { email: playLoad.email },
    });
    return user;
  }
}
