declare function Controller(path?: string): ClassDecorator;
declare function UseGuards(...guards: any[]): any;
declare function Post(path?: string): MethodDecorator;
declare function Get(path?: string): MethodDecorator;
declare const AuthGuard: any;

@Controller("orders")
class UnguardedController {
  // ruleid: nest-controller-no-guard
  @Post()
  create() {}

  // ok: nest-controller-no-guard
  @UseGuards(AuthGuard)
  @Post("safe")
  createGuarded() {}

  // ok: nest-controller-no-guard
  @Get()
  list() {}
}

@UseGuards(AuthGuard)
@Controller("secure")
class GuardedController {
  // ok: nest-controller-no-guard
  @Post()
  create() {}
}
