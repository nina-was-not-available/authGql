import { Injectable } from '@nestjs/common'
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import {PrismaService} from "../../prisma.service";

@ValidatorConstraint({ name: 'IsUniqueConstraint', async: true })
@Injectable()
export class IsUnique implements ValidatorConstraintInterface {
    constructor(private readonly prismaService: PrismaService) {}
    async validate(value: string, args?: ValidationArguments): Promise<boolean> {
        const prop: 'email' | 'username' = args.constraints[0]
        const whereCondition: any = { [prop]: value };
        const dataExist = await this.prismaService.user.findUnique({
            where: whereCondition
        })

        return !dataExist
    }

    defaultMessage(validationArguments: ValidationArguments): string {
        const field = validationArguments.property

        return `${field} is already exist.`
    }
}