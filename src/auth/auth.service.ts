
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
	constructor(private readonly jwtService: JwtService, private readonly usersService: UsersService) {}

	async validateUser(email: string, password: string) {
		const user: any = await this.usersService.findByEmail(email);
		if (!user) return null;
		const match = await bcrypt.compare(password, user.password);
		if (match) {
			// exclude password from returned user
			const { password: _p, ...result } = user;
			return result;
		}
		return null;
	}

	async login(user: any) {
		const payload = { email: user.email, sub: user.id, role: user.role };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}
}
