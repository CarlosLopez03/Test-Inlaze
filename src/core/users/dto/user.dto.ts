import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

import { RegisterUserDto } from 'src/core/auth/dto/register-user.dto';

export class EmailUserDto {
  @ApiProperty({ description: 'Correo electrónico del usuario' })
  @IsNotEmpty({ message: 'Es necesario el email del usuario (email).' })
  @IsEmail(
    {},
    { message: 'Debe cumplir con los estandares de un correo electrónico.' },
  )
  emailUser: string;
}

export class UpdateUserDto extends PartialType(RegisterUserDto) {}
