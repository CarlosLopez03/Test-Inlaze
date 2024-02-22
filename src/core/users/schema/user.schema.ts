import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Schema()
export class User extends Document {
  @ApiProperty({ description: 'Nombre completo del usuario' })
  @Prop()
  fullName: string;

  @ApiProperty()
  @Prop()
  age: number;

  @ApiProperty({ description: 'Correo electrónico del usuario' })
  @Prop()
  email: string;

  @ApiProperty({ description: 'Contraseña del usuario' })
  @Prop()
  password: string;

  @ApiProperty({ description: 'Publicaciones del usuario', type: [String] })
  @Prop()
  posts: string[];

  @ApiPropertyOptional({ description: 'Fecha de creación del usuario' })
  @Prop()
  createdAt: Date;

  @ApiPropertyOptional({ description: 'Fecha de actualización del usuario' })
  @Prop()
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Fecha de eliminación del usuario' })
  @Prop()
  deletedAt: Date;
}

export const USER_SCHEMA = SchemaFactory.createForClass(User);
