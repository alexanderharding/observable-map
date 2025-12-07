# @xan/observable-map

A utility that projects one [`nexted`](https://jsr.io/@xan/observer/doc/~/Observer.next) value to
another.

## Build

Automated by [JSR](https://jsr.io/).

## Publishing

Automated by `.github\workflows\publish.yml`.

## Running unit tests

Run `deno task test` or `deno task test:ci` to execute the unit tests via
[Deno](https://deno.land/).

## Example

```ts
import { map } from "@xan/observable-map";
import { of } from "@xan/observable-of";
import { pipe } from "@xan/pipe";

const controller = new AbortController();

pipe(
  of(1, 2, 3),
  map((x) => x * 2),
).subscribe({
  signal: controller.signal,
  next: (value) => console.log(value),
  return: () => console.log("return"),
  throw: (value) => console.log("throw", value),
});

// Console output:
// 2
// 4
// 6
// return
```

# Glossary And Semantics

- [@xan/observer](https://jsr.io/@xan/observer#glossary-and-semantics)
- [@xan/observable](https://jsr.io/@xan/observable#glossary-and-semantics)
