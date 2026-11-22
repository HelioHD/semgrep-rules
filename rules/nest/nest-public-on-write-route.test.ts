declare function Public(): MethodDecorator;
declare function Post(path?: string): MethodDecorator;
declare function Put(path?: string): MethodDecorator;
declare function Delete(path?: string): MethodDecorator;
declare function Get(path?: string): MethodDecorator;

class UsersController {
  // ruleid: nest-public-on-write-route
  @Public()
  @Post()
  create() {}

  // ruleid: nest-public-on-write-route
  @Public()
  @Delete(":id")
  remove() {}

  // ok: nest-public-on-write-route
  @Public()
  @Get()
  list() {}

  // ok: nest-public-on-write-route
  @Post()
  createAuthed() {}
}
