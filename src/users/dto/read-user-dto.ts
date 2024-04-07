import { PartialType } from '@nestjs/mapped-types';
import { UserEntity } from '../entities/user.entity'; // Replace with actual path

export class UserForRead extends PartialType(UserEntity) {} // Example fields
