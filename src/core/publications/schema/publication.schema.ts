import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class Publications extends Document {
  @ApiProperty({ description: 'Titulo de la publicación.' })
  @Prop()
  title: string;

  @ApiProperty({ description: 'Contenido de la publicación.' })
  @Prop()
  content: string;

  @ApiProperty({ description: 'Likes de la publicación.' })
  @Prop()
  likes: number;

  @ApiPropertyOptional({ description: 'Fecha de creación del usuario' })
  @Prop()
  createdAt: Date;

  @ApiPropertyOptional({ description: 'Fecha de actualización del usuario' })
  @Prop()
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Fecha de eliminación del usuario' })
  @Prop()
  deletedAt: Date;

  @ApiProperty({ description: 'Usuario que creó la publicación.' })
  @Prop()
  userId: string;
}

export const PUBLICATIONS_SCHEMA = SchemaFactory.createForClass(Publications);
