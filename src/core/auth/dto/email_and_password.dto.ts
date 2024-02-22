import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailAndPasswordDto {
  @ApiProperty({ description: 'Contraseña del usuario' })
  @IsNotEmpty({ message: 'Debe proporcionar una contraseña (password).' })
  password: string;

  @ApiProperty({ description: 'Correo electrónico del usuario' })
  @IsNotEmpty({ message: 'Es necesario el email del usuario (email).' })
  @IsEmail(
    {},
    { message: 'Debe cumplir con los estandares de un correo electrónico.' },
  )
  email: string;
}
