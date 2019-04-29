# Access Modifiers

## Access Control

Directive | Purpose
:---: | ---
| open | Can be subclassed outside of its own module and its methods overridden as well; truly open to modification by others and useful for framework builders
| public | Can only be subclassed by its own module or have its methods overridden by others within the same module
| internal | (Default) Indicates the entities are only available to the entire module that includes the definition, e.g. an app or framework target
| fileprivate | Indicates the entities are available only from within the source file where they are defined
| private | Indicates the entities are available only from within the declaring scope within the file where they are defined (e.g. within the `{ }` brackets only)