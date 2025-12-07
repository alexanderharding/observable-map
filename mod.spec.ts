import { assertEquals } from "@std/assert";
import { Observable } from "@xan/observable";
import { Observer } from "@xan/observer";
import { map } from "./mod.ts";
import { pipe } from "@xan/pipe";
import { of } from "@xan/observable-of";
import { thrown } from "@xan/observable-thrown";

Deno.test("map should project the values", () => {
  // Arrange
  const notifications: Array<["N", number] | ["R"] | ["T", unknown]> = [];
  const indices: Array<number> = [];
  const materialized = pipe(
    of(1, 2, 3),
    map((value, index) => {
      indices.push(index);
      return value * 2;
    }),
  );

  // Act
  materialized.subscribe(
    new Observer({
      next: (value) => notifications.push(["N", value]),
      return: () => notifications.push(["R"]),
      throw: (value) => notifications.push(["T", value]),
    }),
  );

  // Assert
  assertEquals(notifications, [["N", 2], ["N", 4], ["N", 6], ["R"]]);
  assertEquals(indices, [0, 1, 2]);
});

Deno.test("map should pump throws through itself", () => {
  // Arrange
  const error = new Error("test");
  const notifications: Array<["N", number] | ["R"] | ["T", unknown]> = [];
  const observable = pipe(
    thrown(error),
    map((value) => value * 2),
  );

  // Act
  observable.subscribe(
    new Observer({
      next: (value) => notifications.push(["N", value]),
      return: () => notifications.push(["R"]),
      throw: (value) => notifications.push(["T", value]),
    }),
  );

  // Assert
  assertEquals(notifications, [["T", error]]);
});

Deno.test("map should pump returns through itself", () => {
  // Arrange
  const notifications: Array<["N", number] | ["R"] | ["T", unknown]> = [];
  const observable = pipe(
    of(),
    map((value) => value * 2),
  );

  // Act
  observable.subscribe(
    new Observer({
      next: (value) => notifications.push(["N", value]),
      return: () => notifications.push(["R"]),
      throw: (value) => notifications.push(["T", value]),
    }),
  );

  // Assert
  assertEquals(notifications, [["R"]]);
});

Deno.test("map should handle unsubscribe", () => {
  // Arrange
  let sourceAborted = false;
  const controller = new AbortController();
  const source = new Observable<number>((observer) =>
    observer.signal.addEventListener("abort", () => (sourceAborted = true), {
      once: true,
    })
  );
  const doubled = pipe(
    source,
    map((value) => value * 2),
  );

  // Act
  doubled.subscribe(new Observer({ signal: controller.signal }));
  controller.abort();

  // Assert
  assertEquals(sourceAborted, true);
});

Deno.test("map should throw if the project function throws", () => {
  // Arrange
  const error = new Error("test");
  const notifications: Array<["N", number] | ["R"] | ["T", unknown]> = [];
  const observable = pipe(
    of(1),
    map(() => {
      throw error;
    }),
  );

  // Act
  observable.subscribe(
    new Observer({
      next: (value) => notifications.push(["N", value]),
      return: () => notifications.push(["R"]),
      throw: (value) => notifications.push(["T", value]),
    }),
  );

  // Assert
  assertEquals(notifications, [["T", error]]);
});
