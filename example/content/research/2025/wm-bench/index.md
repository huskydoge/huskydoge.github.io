---
title: "Do Vision-Language Models Have Internal World Models? Towards an Atomic Evaluation"
date: "2025-06-01"
tags:
  - "World Model"
  - "Benchmark"

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
  - name: "**Benhao Huang**"
  - name: "Zeming Chen"
  - name: "David Danks"
  - name: "Hao Su"
  - name: "Tianming Shu"
  - name: "Ziqiao Ma"
  - name: "Lianhui Qin"
  - name: "Zhiting Hu"


path: "research/2025/wm-bench"
excerpt: This paper evaluates whether modern Vision-Language Models (VLMs) like GPT-4o and Gemini can act as internal world models (WMs)—systems that understand and predict the world. 
selected: false
cover: "./preview.png"
links:
  - name: "paper"
    url: "https://arxiv.org/abs/2506.21876"
  - name: "HuggingFace"
    url: "https://huggingface.co/datasets/maitrix-org/WM-ABench"
  - name: "website"
    url: "https://wm-abench.maitrix.org/"
priority: 2
---



This paper evaluates whether modern Vision-Language Models (VLMs) like GPT-4o and Gemini can act as internal world models (WMs)—systems that understand and predict the world. The authors introduce WM-ABench, a benchmark assessing core perception and prediction abilities (e.g., motion, spatial reasoning, causal inference) across 23 dimensions and 6 simulated environments. Results from 517 experiments show major limitations: VLMs often perform at chance level in motion tasks and exhibit entangled, biased reasoning (e.g., associating object color with speed). The study reveals that current VLMs fall far short of human-like world modeling.


