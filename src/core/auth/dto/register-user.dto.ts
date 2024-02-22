import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { EmailAndPasswordDto } from './email_and_password.dto';

export class RegisterUserDto extends EmailAndPasswordDto {
  @ApiProperty({ description: 'Nombre completo del usuario' })
  @IsNotEmpty({
    message: 'Es necesario el nombre completo del usuario (fullName).',
  })
  @IsString({ message: 'Deben ser caracteres (fullName).' })
  fullName: string;

  @ApiProperty({ description: 'Edad del usuario.' })
  @IsNotEmpty({ message: 'Es necesario la edad del usuario (age).' })
  @IsInt({ message: 'La edad debe ser un número entero (age).' })
  age: number;

  @ApiProperty({ description: 'Publicaciones del usuario', type: [String] })
  @IsArray()
  @IsOptional()
  posts: string[];
}
