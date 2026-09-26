---
layout: page
title: About
permalink: /about/
---

I am Rui Duan, a software engineer who builds AI agents and the platforms that run them reliably.

My current work focuses on agentic AI for enterprise operations.  Most recently, I built a system that automates disaster-recovery assessments across an organization's application portfolio.  An ETL pipeline builds an inventory of each application's data.  A deterministic retriever then assembles exactly the right context for the LLM, alongside curated assessment rules.  The model identifies DR gaps, and an assessor–reviewer loop between agents checks the findings before a report is produced.  Each assessment runs as an independent job, dispatched through Kafka or direct service-to-service calls on OpenShift.  It has reduced assessment time by 50%.  What I care about is making agents trustworthy: controlling what the model sees, checking what it says, and running it like any other production system.

Before AI, I spent years on the layers most people never see: building, packaging, and installing C/C++ software; mobile apps on Qualcomm BREW; mainframe systems; logging and metrics pipelines; load testing; Kubernetes and infrastructure as code.  That background shapes how I build agents.  I care less about demos and more about what happens at scale: reliability, cost, security, and knowing why a system behaves the way it does.

I believe good software should be understandable and open.  I've been a member of the Free Software Foundation since 2023, I write most things in Emacs, and I have a soft spot for Rust and Lisp, both languages with a coherent theory behind them.

Away from the keyboard, I play the accordion.  Music and computing have more in common than they seem: both are about structure, patterns, and the moment when a complicated piece suddenly becomes clear.  That's where this blog's name, Melody of Computing, comes from.

You can reach me at rui.r.duan@gmail.com or find my work on GitHub or find more information about me in my [LinkedIn profile](https://www.linkedin.com/in/rui-r-duan/).
