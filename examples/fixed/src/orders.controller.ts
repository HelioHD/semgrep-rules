import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class AuthGuard {}

@UseGuards(AuthGuard)
@Controller("orders")
export class OrdersController {
  @Get(":id")
  async findOne(@Param("id") id: string, @Req() req: any) {
    return prisma.order.findFirst({
      where: { id, ownerId: req.user.id },
    });
  }

  @Post()
  async create(@Body() body: { total: number }, @Req() req: any) {
    return prisma.order.create({
      data: { total: body.total, ownerId: req.user.id },
    });
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Req() req: any) {
    return prisma.order.deleteMany({ where: { id, ownerId: req.user.id } });
  }
}
