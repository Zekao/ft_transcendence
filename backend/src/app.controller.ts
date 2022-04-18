import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get('AdventureTime')
	adventureTime(): string {
		return this.appService.getAdventureTime();
	}

 	@Get('AdventureTime/:name')
	Caractere(@Param('name') name: string): string {
		return this.appService.getCaractere(name);
	}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}
}
