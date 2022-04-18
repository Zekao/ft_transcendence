import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getAdventureTime(): string {
    return "It's Adventure Time!";
  }
  getCaractere(name: string): string {
    if (name === 'Jack') return "Jack the dog!";
    else if (name === 'Fin') return "Fin the Human!";
    else return "Adventure time!";
  }
}
