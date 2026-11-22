import { Controller, Get, Post, Delete, Param, Body } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function Public(): MethodDecorator {
  return () => {};
}

@Controller("orders")
export class OrdersController {
  @Get(":id")
  async findOne(@Param("id") id: string, req: any) {
    return prisma.order.findUnique({ where: { id: req.params.id } });
  }

  @Public()
  @Post()
  async create(@Body() body: any) {
    return prisma.order.create({ data: body });
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return prisma.order.delete({ where: { id } });
  }
}
