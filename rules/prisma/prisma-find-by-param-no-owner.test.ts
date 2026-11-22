declare const prisma: any;
declare const req: any;

async function noOwnerScope() {
  // ruleid: prisma-find-by-param-no-owner
  return prisma.order.findUnique({ where: { id: req.params.id } });
}

async function findFirstNoOwner() {
  // ruleid: prisma-find-by-param-no-owner
  return prisma.invoice.findFirst({ where: { id: req.params.invoiceId } });
}

async function scopedByOwner() {
  // ok: prisma-find-by-param-no-owner
  return prisma.order.findFirst({ where: { id: req.params.id, ownerId: req.user.id } });
}

async function scopedByUser() {
  // ok: prisma-find-by-param-no-owner
  return prisma.order.findFirst({ where: { id: req.params.id, userId: req.user.id } });
}

async function notFromParam() {
  // ok: prisma-find-by-param-no-owner
  return prisma.order.findUnique({ where: { id: internalId } });
}

declare const internalId: string;
