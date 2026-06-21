---
title: "What Is the Best Way for AI to Control a Computer?"
description: "GUI automation and shell access both expose interfaces built for humans. An API-native runtime offers a different tradeoff: generate small programs against narrow, validated application APIs."
date: 2026-06-12
tags: ["cogcore", "architecture", "open-source"]
series: "cogcore"
seriesOrder: 1
draft: false
---

An AI agent can write an email, summarize a repository, or propose a set of edits. The harder question is what happens next: how should it actually operate the computer?

Most current systems choose one of two answers.

The agent can use the graphical interface, moving a pointer and clicking the same buttons as a person. Or it can use a command-line interface, composing shell commands and reading their output. Both approaches are useful. Neither is a natural machine interface.

This post argues for a third option: give the agent a small, application-specific API and let it generate a short program against that API for each task.

I call this **API-native computer control**. I do not think it is the final answer to the title question. It has important weaknesses, especially when the model has never seen the application's API before. But it produces an interesting combination of flexibility, narrow permissions, runtime validation, and low execution overhead.

## Tool use is not enough

"Tool use" often means exposing a list of functions such as:

```text
create_rectangle(...)
move_object(...)
set_fill_color(...)
delete_object(...)
```

The model chooses a function, supplies arguments, receives a result, and repeats.

This works well for small, independent actions. It becomes awkward when a task involves iteration, branching, data transformation, or hundreds of related changes. Consider:

> Find every text object smaller than 12 px, increase it to 12 px, and move any resulting overflow into a new text box below the original.

A model can issue one tool call at a time, but then the model itself becomes the control loop. Every observation and action crosses the inference boundary. Latency and token use grow with the number of steps, while partial failure becomes harder to reason about.

A short program is a better representation:

```js
const objects = document.listObjects({ type: "text" });

for (const object of objects) {
  if (object.fontSize >= 12) continue;

  const result = document.updateText(object.id, { fontSize: 12 });
  if (result.overflowText) {
    document.createText({
      content: result.overflowText,
      x: object.x,
      y: object.y + object.height + 8,
      fontSize: 12,
    });
  }
}
```

The model still decides what to do, but ordinary computation stays inside the program: loops, conditions, sorting, arithmetic, and intermediate values do not each require another LLM turn.

The question therefore is not only which tools an agent should have. It is also which *execution interface* should sit between the model and the application.

## GUIs are compressed for eyes and hands

Graphical interfaces are extraordinarily effective for humans. Vision gives us a high-bandwidth overview. We can scan a canvas, notice alignment, recognize an icon, and point at an object without first naming it.

An agent using a GUI has a different workload:

1. Render pixels.
2. Interpret the screenshot.
3. Infer which visual element corresponds to an action.
4. Estimate coordinates.
5. click or type.
6. Render again and check whether the state changed as expected.

This is valuable when no other interface exists. It is also the only general route through legacy software and arbitrary websites. But it makes the agent reconstruct semantics that the application already knows.

A button is not fundamentally a rectangle at `(x, y)`. It is an action with a name, accepted inputs, preconditions, and effects. A text layer is not merely a cluster of pixels. The application already has a structured object containing its content, bounds, font, transform, and identifier. Turning that structure into pixels and asking a model to infer the structure again is a lossy round trip.

GUI control also inherits incidental human concerns: window size, display scaling, animation timing, focus, overlapping dialogs, responsive layouts, and small redesigns. These are not part of the user's intent, but they become part of the agent's problem.

That does not make computer vision useless. Visual feedback is essential for tasks where appearance is the result—editing slides, graphics, video, or a web page. The distinction is between using vision to **judge the output** and using pixel coordinates as the primary **control plane**.

## The CLI is closer, but it is still a human interface

The command line removes many GUI problems. It is textual, composable, scriptable, and easy for a language model to emit. Unix tools in particular have decades of accumulated examples in model training data.

For developer workflows, the shell is often the best interface available.

But a CLI is still designed around human conventions. It compresses meaning into short flags, overloaded positional arguments, environment variables, exit codes, and unstructured text. It often assumes broad ambient access to the filesystem, subprocesses, credentials, and the network.

This command is concise for someone who already knows it:

```sh
ffmpeg -i input.mov -vf "scale=1920:-2,fps=30" -c:v libx264 -crf 20 output.mp4
```

Its compactness is not automatically helpful to an agent. The semantics live in documentation and convention rather than in a machine-checkable input schema. Validation usually happens only after process launch, and successful output may still be semantically wrong.

The shell also exposes a very large authority surface. If an agent only needs to resize one video, giving it a general process launcher and filesystem access is much broader than giving it a `video.resize(...)` capability scoped to one input asset and one output location.

Containers can reduce that authority. They are useful and sometimes necessary. But they place a boundary around a broadly capable environment rather than reducing the interface itself. A narrow API can make many unsafe actions unrepresentable before container policy enters the picture.

## MCP does not choose the control model

The Model Context Protocol is relevant here, but it lives at a different layer.

MCP standardizes how an application can expose tools, resources, and prompts to an AI system. An MCP tool might wrap a GUI action, execute a shell command, call a REST endpoint, or run code in a sandbox. The protocol helps components discover and invoke capabilities; it does not require one particular execution abstraction.

API-native control can therefore be exposed through MCP, but MCP alone does not answer whether an agent should make 200 individual tool calls or generate one 40-line program that uses a constrained API.

## Every button already hides code

In most applications, clicking a button eventually invokes code that the developer wrote in advance:

```tsx
function AlignButton({ selectedIds }) {
  return (
    <button
      onClick={() => {
        const objects = selectedIds.map((id) => editor.getObject(id));
        const left = Math.min(...objects.map((object) => object.x));

        for (const object of objects) {
          editor.updateTransform(object.id, { x: left });
        }

        editor.commitHistory("Align left");
      }}
    >
      Align left
    </button>
  );
}
```

The visible button is a human-friendly handle for a predefined program.

Professional software contains thousands of these handles. Photoshop, Final Cut Pro, Word, Excel, and PowerPoint expose menus, panels, dialogs, ribbons, shortcuts, and context menus. Together they enumerate a large but finite set of operations that their developers anticipated.

Natural-language control changes the economics. Instead of requiring the application developer to pre-compose every useful sequence behind a button, the agent can compose a small program on demand:

```js
const objects = canvas.getSelection();
const left = Math.min(...objects.map((object) => object.bounds.x));

for (const object of objects) {
  canvas.move(object.id, { x: left, y: object.bounds.y });
}
```

The important shift is not "replace every button with chat." Buttons remain faster for many frequent actions. The shift is that uncommon combinations no longer require a permanent UI affordance or a manually installed macro.

A user can describe an operation that was never assigned a menu item, and the agent can assemble it from lower-level application primitives.

## The proposed interface: a manual and a guarded runtime

Letting a model generate executable code without review sounds reckless, because unrestricted generated code *is* reckless. The useful version needs two things:

1. A manual the agent can retrieve and reason over.
2. A runtime that strictly limits and validates what the generated program can do.

In this design, the manual is an API specification. It describes available objects, methods, parameters, return values, and related types. The runtime exposes only those APIs as globals inside a sandbox.

The generated code should not receive `window`, the DOM, arbitrary network access, a shell, or the host application's internal state. If the task concerns an SVG document, it might receive exactly one global:

```js
svg
```

That object can expose semantic operations such as:

```ts
class SvgForAI {
  getDocument(): SvgDocumentSummary;
  listObjects(filter?: SvgObjectFilter): SvgObjectSummary[];
  getObject(id: string): SvgObject | null;
  createShape(input: SvgShapeInput): SvgObject;
  createText(input: SvgTextInput): SvgObject;
  updateGeometry(id: string, geometry: SvgGeometryUpdate): SvgObject;
  updateAppearance(id: string, appearance: SvgAppearanceUpdate): SvgObject;
  removeObjects(ids: string[]): void;
  exportSvg(): string;
}
```

This is adapted from the SVG editor in [MoBoard](https://github.com/carsonDB/MoBoard). The agent does not need access to XML parsing, React state, browser storage, or arbitrary DOM mutation. It gets a deliberately small vocabulary for reading and changing the document.

The architecture looks roughly like this:

```text
 User request
      |
      v
 Chat agent
      |
      v
 Code agent  <------>  API retrieval agent
      |                       |
      |                       v
      |                 API-spec graph
      |                       ^
      v                       |
 Generated JavaScript   TypeScript application API
      |
      v
 Guarded sandbox
      |
      v
 Validated application changes
```

The application developer writes the real API implementation in TypeScript. A build step can use the TypeScript AST—through a library such as `ts-morph`—to extract signatures and type relationships into a graph for retrieval. The implementation itself is then exposed to the sandbox through a controlled entry point.

This avoids maintaining two independent descriptions of the same interface. TypeScript remains the source of truth for the application developer; the generated graph becomes a searchable manual for the agent.

An API retrieval agent matters because a serious application's complete schema may be too large to place in every prompt. Given "make the selected icons the same size and distribute them horizontally," it can retrieve the small connected part of the API graph concerning selection, bounds, resizing, and arrangement.

## Why generate JavaScript instead of TypeScript?

If TypeScript provides static checking, why not require the agent to generate TypeScript?

Because generated code has a different lifecycle from maintained source code.

The program may exist for only one task. It is generated, executed, and discarded. It does not need a stable public type surface or years of backward compatibility. Requiring type annotations for callback arguments, generics, imports, and intermediate structures can add syntax without adding much safety at the boundary that matters.

Worse, TypeScript's guarantees stop at runtime. These are all `string`:

```ts
type Input = {
  color: string;
  svgPath: string;
  outputFile: string;
};
```

But an application may need:

- `color` to be a valid CSS color accepted by this renderer;
- `svgPath` to parse as path data and stay below a complexity limit;
- `outputFile` to refer to a permitted virtual destination, not an arbitrary host path.

Likewise, `number` does not mean finite, positive, within canvas bounds, or safe as a frame rate.

For unattended execution, runtime contracts are more important than compile-time convenience. A practical design is therefore:

- application APIs implemented in TypeScript;
- generated task programs written in plain JavaScript;
- every exposed call validated at runtime;
- object access constrained so nonexistent or forbidden properties throw instead of quietly returning `undefined`;
- results verified before they are committed.

In [CogCore](https://github.com/carsonDB/CogCore), the project where I am experimenting with this architecture, JavaScript runs in a worker sandbox. Exposed values are wrapped and checked at runtime, with schemas capable of expressing constraints beyond TypeScript's basic types.

This does not make generated code correct. It changes failure from "the model may silently mutate anything" to "the model can attempt only the exposed operations, and invalid attempts produce structured errors."

That enables a repair loop:

```text
generate -> validate -> execute -> verify
    ^          |          |         |
    +----------+----------+---------+
             structured error
```

The agent can inspect an error, revise a small program, and try again. No human needs to review every transient snippet, just as a passenger in a self-driving car cannot approve every steering correction. The guardrails and verification must carry the safety burden.

## Safety begins with API design

Sandboxing is necessary, but the API's shape determines much of the security model.

Compare these two capabilities:

```js
system.exec("rm -rf " + path);
```

and:

```js
project.deleteGeneratedPreview({ previewId });
```

The first accepts a string whose meaning is delegated to a shell with ambient filesystem authority. The second can validate an opaque identifier, check that the object is a generated preview owned by the current project, record the change in history, and support undo.

The safer API is also easier for the model to use correctly because it expresses intent directly.

Good agent-facing APIs should be:

- **semantic**: expose domain operations rather than UI coordinates;
- **narrow**: grant only the authority needed for the task;
- **inspectable**: make current state available as structured data;
- **validated**: reject invalid values at every boundary;
- **transactional where possible**: stage changes, verify invariants, then commit;
- **observable**: return structured results and errors;
- **reversible where practical**: integrate with undo, snapshots, or compensating actions.

This is capability security applied at the application level. Instead of giving the agent a computer and trying to blacklist dangerous behavior, give it a small set of objects that cannot express most dangerous behavior.

There will still be applications where a process-level sandbox or container is appropriate. API-native control is not an argument against defense in depth. It is an argument for reducing authority before adding heavier isolation around it.

## The largest weakness: unfamiliar APIs

There is an obvious reason shell-based agents work surprisingly well: models have seen enormous amounts of shell code.

Commands such as `git`, `find`, `ffmpeg`, and `curl` are represented throughout public code, documentation, Q&A, tests, and training traces. Models do not merely read their manuals at inference time. Some operational knowledge has been compressed into the model's parameters, and agent training gives them repeated practice using common interfaces.

A custom application API has none of that advantage.

Even with perfect documentation, a model may retrieve the wrong part of the schema, invent a familiar-sounding method, misunderstand an invariant, or require several attempts before producing valid code. API retrieval adds latency. Runtime repair adds more. A novel API may be safer and more expressive than a CLI while still being less usable by today's models.

This is the central tradeoff:

| Interface | Model familiarity | Semantic precision | Typical authority | Composition |
| --- | --- | --- | --- | --- |
| GUI | Medium and improving | Low at control time | Whatever the user can click | Slow, observation-heavy |
| CLI | High for common tools | Medium | Often broad | Excellent |
| Individual tool calls | Depends on schema | High | Can be narrow | Awkward for long workflows |
| Generated code over APIs | Low for custom APIs | High | Can be very narrow | Excellent |

API-native control moves difficulty from execution into interface learning. That is a good trade only if agents can become competent with new interfaces quickly.

## Should skills live only in model weights?

This leads to a broader question.

When a model becomes good at Bash after training on millions of examples, the skill is stored implicitly across neural-network parameters. That makes the skill fast to invoke and hard to inspect, update, transfer, or delete.

Do all operational skills need to live there?

Humans do not relearn an entire profession from scratch for each task, but neither do we encode every procedure biologically. We use manuals, source code, checklists, examples, notebooks, and practice. We turn repeated experience into external artifacts as well as internal intuition.

An agent could do something similar at the system level:

1. retrieve an unfamiliar API;
2. attempt a task in a sandbox;
3. use validation errors and outcome checks as feedback;
4. retain successful patterns, counterexamples, and invariants as external text or code;
5. retrieve those learned artifacts on future tasks.

This would be reinforcement at the agent-system level rather than only at model-training time. The base model supplies general reasoning and code generation; the surrounding system accumulates application-specific competence.

There are many unsolved problems. Which experiences are worth keeping? How do we avoid preserving accidental workarounds? How should a learned procedure be invalidated when an API changes? Can retrieved skills remain concise enough to help rather than distract? When should the system generalize several traces into one reusable pattern?

I do not know whether plain text, executable examples, test cases, embeddings, or some combination will be the right representation. I am working on this problem, but it is too early to claim a solution.

The important point is that "the model was pretrained on it" should not be a permanent prerequisite for reliable automation. If agents can only master interfaces already present at scale in training data, new software will always begin at a severe disadvantage.

## A useful division of labor

The most plausible system is not GUI *or* CLI *or* APIs. It uses each where it is strongest:

- vision for understanding appearance and verifying visual outcomes;
- GUI control as a universal fallback for software with no structured interface;
- CLI tools for developer environments and mature, well-known utilities;
- direct tool calls for small atomic actions;
- generated code over narrow APIs for novel, multi-step application workflows.

The API-native path is especially attractive for professional software, where the application already owns rich structured state and where mistakes can be expensive. Instead of forcing an agent to operate the same controls as a person, we can expose the semantics beneath those controls.

That requires more work from application developers. Agent-facing APIs must be designed, documented, constrained, and tested. But UI development already requires engineers to define actions and validation. The additional step is to make those semantics accessible without routing everything through pixels or an unrestricted shell.

The best interface for AI may not look like an interface to a person at all. It may look like a small program, written for one task, using a manual retrieved just in time, running inside a world where invalid actions are difficult—or ideally impossible—to express.
