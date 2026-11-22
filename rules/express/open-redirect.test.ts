declare const req: any;
declare const res: any;

function directRedirect() {
  // ruleid: open-redirect
  res.redirect(req.query.next);
}

function throughVariable() {
  const target = req.body.returnTo;
  // ruleid: open-redirect
  res.redirect(target);
}

function withStatus() {
  // ruleid: open-redirect
  res.redirect(301, req.query.url);
}

function constantRedirect() {
  // ok: open-redirect
  res.redirect("/dashboard");
}
