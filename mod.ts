import { from, isObservable, Observable } from "@xan/observable";

/**
 * {@linkcode project|Projects} each {@linkcode In|value} from the `source`
 * [`Observable`](https://jsr.io/@xan/observable/doc/~/Observable) to a new
 * {@linkcode Out|value}.
 * @example
 * ```ts
 * import { map } from "@xan/observable-map";
 * import { of } from "@xan/observable-of";
 * import { pipe } from "@xan/pipe";
 *
 * const controller = new AbortController();
 *
 * pipe(of(1, 2, 3), map((x) => x * 2)).subscribe({
 *   signal: controller.signal,
 *   next: (value) => console.log(value),
 *   return: () => console.log("return"),
 *   throw: (value) => console.log("throw", value),
 * });
 *
 * // Console output:
 * // 2
 * // 4
 * // 6
 * // return
 * ```
 */
export function map<In, Out>(
  project: (value: In, index: number) => Out,
): (source: Observable<In>) => Observable<Out> {
  if (arguments.length === 0) {
    throw new TypeError("1 argument required but 0 present");
  }
  if (typeof project !== "function") {
    throw new TypeError("Parameter 1 is not of type 'Function'");
  }
  return function mapFn(source) {
    if (arguments.length === 0) {
      throw new TypeError("1 argument required but 0 present");
    }
    if (!isObservable(source)) {
      throw new TypeError("Parameter 1 is not of type 'Function'");
    }
    source = from(source);
    return new Observable((observer) => {
      let index = 0;
      source.subscribe({
        signal: observer.signal,
        next: (value) => observer.next(project(value, index++)),
        return: () => observer.return(),
        throw: (value) => observer.throw(value),
      });
    });
  };
}
