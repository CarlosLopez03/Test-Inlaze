import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class IdPublicationDto {
  @ApiProperty({ description: 'Id de la publicación.' })
  @IsNotEmpty({ message: 'Es necesario el id (idPublication).' })
  idPublication: string;
}

export class CreatePublicationDto {
  @ApiProperty({ description: 'Título de la publicación.' })
  @IsNotEmpty({
    message: 'Es necesario el titulo (title).',
  })
  @IsString({ message: 'Deben ser caracteres (title).' })
  title: string;

  @ApiProperty({ description: 'Contenido de la publicación.' })
  @IsNotEmpty({
    message: 'Es necesario el contenido (content).',
  })
  @IsString({ message: 'Deben ser caracteres (content).' })
  content: string;

  @ApiProperty({ description: 'Like de la publicación.' })
  @IsNotEmpty({
    message: 'Es necesario un valor inicial (likes).',
  })
  @IsInt({ message: 'Deben ser un numero entero (likes).' })
  likes: number;
}

export class UpdatePublicationDto extends PartialType(CreatePublicationDto) {}
