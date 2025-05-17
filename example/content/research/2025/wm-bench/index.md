---
title: "Do Vision-Language Models Have Internal World Models? Towards an Atomic Evaluation"
tags:
  - "World Model"
  - "Benchmark"
  - "2025"

venue: "ICLR 2025 Workshop World Models / ACL 2025 Findings"

authors:
  - name: "Qiyue Gao"
  - name: "Xinyu Pi"
  - name: "Kevin Liu"
  - name: "Junrong Chen"
  - name: "Ruolan Yang"
  - name: "Xinqi Huang"
  - name: "Xinyu Fang"
  - name: "Lu Sun"
  - name: "Gautham Kishore"
  - name: "Bo Ai"
  - name: "Stone Tao"
  - name: "Mengyang Liu"
  - name: "Jiaxi Yang"
  - name: "Chao-Jung Lai"
  - name: "Chuanyang Jin"
  - name: "Jiannan Xiang"
  - name: "*Benhao Huang*"
  - name: "Zeming Chen"
  - name: "David Danks"
  - name: "Hao Su"


path: "research/2025/wm-bench"
excerpt: Internal world models (WMs) enable agents to understand the world's state and predict transitions, serving as the basis for advanced deliberative reasoning. Recent large Vision-Language Models (VLMs), such as GPT-4o and Gemini, exhibit potential as general-purpose WMs. While the latest studies have evaluated and shown limitations in specific capabilities such as visual understanding, a systematic evaluation of VLMs' fundamental WM abilities remains absent. Drawing on comparative psychology and cognitive science, we propose a two-stage framework that assesses Perception (visual, spatial, temporal, quantitative, and motion) and Prediction (mechanistic simulation, transitive inference, compositional inference) to provide an atomic evaluation of VLMs as WMs. Guided by this framework, we introduce WM-ABench, a large-scale benchmark comprising 23 fine-grained evaluation dimensions across 6 diverse simulated environments with controlled counterfactual simulations. Through 517 controlled experiments on 11 latest commercial and open-source VLMs, we find that these models exhibit striking limitations in basic world model abilities. For instance, all models perform at near-random accuracy when distinguishing motion trajectories. Additionally, they lack disentangled understanding---e.g., they tend to believe blue objects move faster than green ones. More rich results and analyses reveal significant gaps between VLMs and human-level world modeling.
selected: false
cover: "./preview.png"
links:
  - name: "paper"
    url: "https://openreview.net/pdf/fad1cdbf1a8687d3e2a1924573c79977176f6b06.pdf"
priority: 2
---


```

```
