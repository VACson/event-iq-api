import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export class CreateTeamDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description?: string;
}
