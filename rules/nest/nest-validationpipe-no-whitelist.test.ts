declare class ValidationPipe {
  constructor(options?: any);
}

const noOptions =
  // ruleid: nest-validationpipe-no-whitelist
  new ValidationPipe();

const transformOnly =
  // ruleid: nest-validationpipe-no-whitelist
  new ValidationPipe({ transform: true });

const whitelisted =
  // ok: nest-validationpipe-no-whitelist
  new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true });

const whitelistedTransform =
  // ok: nest-validationpipe-no-whitelist
  new ValidationPipe({ transform: true, whitelist: true });
