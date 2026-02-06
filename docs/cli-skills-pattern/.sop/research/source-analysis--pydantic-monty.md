# Source Analysis: Pydantic Monty

## Source
- https://github.com/pydantic/monty
- HN: https://news.ycombinator.com/item?id=46838860

## What Is Monty?
A minimal, secure Python interpreter written in Rust, designed exclusively for executing LLM-generated code in sandboxed environments. It replaces container-based sandboxing with a purpose-built interpreter that trades language completeness for security, performance, and simplicity.

## Core Thesis
LLMs work faster, cheaper, and more reliably when asked to write Python code instead of making sequential tool calls. The code calls your tools as functions, and Monty executes it safely.

## Key Technical Details

### Performance
- **Startup**: <1μs (cold start 0.06ms)
- **Runtime**: Comparable to CPython (5x faster to 5x slower)
- **Package size**: ~4.5MB
- **Comparison**: Docker ~195ms startup, Pyodide ~2800ms

### Security Model
- **No direct host access**: filesystem, env vars, network all blocked
- **External function calls**: only developer-approved functions via controlled interface
- **Resource limits**: memory, allocations, stack depth, execution time
- **No CPython dependency**: eliminates CPython attack surface

### What It Can Do
- Execute a practical subset of Python for agent expressions
- Type checking via integrated `ty` tool
- Snapshot execution state to bytes (pause/resume/fork)
- Called from Rust, Python, or JavaScript
- Capture stdout/stderr
- Execute async or sync code on host

### What It Cannot Do
- Most stdlib modules (only `sys`, `typing`, `asyncio`)
- Import third-party libraries
- Define classes (coming soon)
- Match statements (coming soon)

### API Design
```python
# Basic execution
m = pydantic_monty.Monty(code, inputs=['prompt'], external_functions=['call_llm'])
output = await pydantic_monty.run_monty_async(m, inputs={'prompt': 'test'})

# Iterative (pause at external function calls)
snapshot = m.start(inputs)
# Host processes external call
result = m.resume(snapshot, return_value)

# Serialization (cache compiled code, persist state)
data = m.dump()
m2 = pydantic_monty.Monty.load(data)
```

### Integration with PydanticAI
Will power "code-mode" in PydanticAI - replacing sequential tool calls with LLM-generated Python that invokes tools as functions.

## Position in the Spectrum

Monty represents a **third path** between:
1. **Full containers** (Docker/E2B): Complete language, high startup latency, heavy
2. **Direct exec()**: Fast, zero isolation, dangerous
3. **Monty**: Restricted language, microsecond startup, strong isolation

## Key Insight
Monty is the CLI-skills pattern applied to the interpreter itself. Instead of giving the agent a full Python runtime and restricting what it can do externally (sandboxing), you give it a restricted runtime where dangerous operations simply don't exist. Security by omission rather than security by restriction.

## Why This Matters for the CLI Skills Pattern
- Demonstrates the pattern scales down to the interpreter level
- The "restricted but sufficient" philosophy mirrors SKILL.md (limited format, unlimited capability)
- External function model = the agent's "man page" for available tools
- Snapshot/resume = checkpoint pattern from SOP workflows
