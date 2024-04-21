import { ApiProperty } from '@nestjs/swagger';

export class CreateActivityDto {
  @ApiProperty()
  activity_name: string;

  @ApiProperty()
  activity_participants?: number;

  @ApiProperty()
  activity_notes?: string;
}
