// npx tsx src/vanilla/event-emitter.ts
import EventEmitter from "node:events";

// emit(event, args...) - on(event, args...)
// Preserves handler order
// Can check whether handlers exist / emit(error) with no handlers -> throw
// Guards against memory leaks. Default limit is 10 listeners per event.
// setMaxListeners(1) lowers it: the first on("tick") fits, the second warns.

const emitter = new EventEmitter();

function first(id: string) {
  console.log("first", id);
}

function second(id: string) {
  console.log("second", id);
}

emitter.on("job", first);
emitter.on("job", second);

console.log("job handlers:", emitter.listenerCount("job"));
emitter.emit("job", "42");

emitter.off("job", first);
emitter.off("job", second);
console.log("job handlers after off:", emitter.listenerCount("job"));

try {
  emitter.emit("error", new Error("no listeners"));
} catch (error) {
  console.log("error event threw:", (error as Error).message);
}

emitter.setMaxListeners(1);
emitter.on("tick", () => {});
emitter.on("tick", () => {});
