---
title: "LLM should own outside memory or inherit parameters ?"
description: "Scaling law is ...."
date: 2026-06-12
tags: ["cogcore", "architecture", "open-source"]
series: "cogcore"
seriesOrder: 1
draft: true
---


- The blog make analogy from LLM to CPU. Core of agent automation, cpu is computer's core. Follow CPU (computer) history, to help us understand the problem of LLM/Agent, and the possible future of AI will be.

- LLM is like a CPU, which has very limited context/register, because of costs..., so just like CPU, the solution is not just increase LLM's context / CPU's register. Instead, we need indirect context. (CPU has memory + disk); LLM need external memory, external tool sets (can be enoumous); Just like CPU to retrieve data/instruction access memory. So LLM need to retrive info with query. But CPU retrieve by address (index), and LLM query by content (similar to human).

- Scaling