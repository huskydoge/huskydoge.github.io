---
title: "Paper List"
tags: ["paper"]
date: 2024-06-25
path: "posts/paper"
excerpt: How I hope I won't forget the papers I have read.
---

## World Models & Video Reasoning

- [Pandora: Towards General World Model with Natural Language Actions and Video States](https://world-model.maitrix.org/assets/pandora.pdf), 2024 | [Code](https://github.com/maitrix-org/Pandora?tab=readme-ov-file)
- [Video-of-Thought: Step-by-Step Video Reasoning from Perception to Cognition](https://haofei.vip/VoT/)
  - Insightful and comprehensive. The conecept of spatial-temporal scene graph (STSG) is something new to me.
- [Robotic Control via Embodied Chain-of-Thought Reasoning](https://arxiv.org/html/2407.08693v1)

### Video Position Encoding & Temporal/Spacial Attention
- [Rotary Position Embedding for Vision Transformer](https://arxiv.org/abs/2403.13298), 2024
  - The application of RoPE in video transformers. Compared to the S/T Attention, it's something different.
- [Video Transformers: A Survey](https://arxiv.org/abs/2201.05991), 2022
- [Space or time for video classification transformers](https://link.springer.com/article/10.1007/s10489-023-04756-5), 2023
  - The concept of Space Attention and Temporal Attention is interesting. 

### Datasets
- [(hdvila) Advancing High-Resolution Video-Language Representation with Large-Scale Video Transcriptions
](https://arxiv.org/abs/2111.10337) | [Code](https://github.com/microsoft/XPretrain/tree/main/hd-vila), 2021
- [How Good is my Video LMM? Complex Video Reasoning and Robustness Evaluation Suite for Video-LMMs](https://arxiv.org/abs/2405.03690) | [Code](https://github.com/mbzuai-oryx/CVRR-Evaluation-Suite/), 2024
- [ShareGPT4Video:
Improving Video Understanding and Generation with Better Captions](https://sharegpt4video.github.io/), 2024
  - The differencial data annotation method is interesting, we want to have fine-grained annotations for the video data.

## Video Generation

### Benchmark

- [VBench: Comprehensive Benchmark Suite for Video Generative Models](https://arxiv.org/abs/2311.17982) | [Code](https://github.com/Vchitect/VBench), 2023 (CVPR 2024)
  - Comprehensive benchmark for video generation models. 

## Long Context LLM

- [RoFormer: Enhanced Transformer with Rotary Position Embedding](https://arxiv.org/abs/2104.09864), 2020
- [Base of RoPE Bounds Context Length](https://arxiv.org/abs/2405.14591), 2024

  - Explore the influence of the base of RoPE on the context length of the model.

- [3D-RPE: Enhancing Long-Context Modeling Through 3D Rotary Position Encoding](https://arxiv.org/abs/2406.09897), 2024
  - Creative idea to introduce a new dimension to the RoPE, which is called a chunk. Attention of attention.
- [LongEmbed: Extending Embedding Models for Long Context Retrieval](https://arxiv.org/abs/2404.12096), 2024 | [Code](https://github.com/dwzhu-pku/LongEmbed)
  - A comprehensive experimental study on different methods to extend context window (e.g. Parallel Context Window, NTK, self-extend, Grouped Position & Reccurent Position, etc.). Also introduce a benchmark called LongEmbed.
- [CAPE: Context-Adaptive Positional Encoding for Length Extrapolation](https://arxiv.org/abs/2405.14722), 2024
  - Exploring on using NNs to further enhance the additive PE methods.


## Diffusion Models

- https://github.com/showlab/Awesome-Video-Diffusion?tab=readme-ov-file

- [Step-by-Step Diffusion: An Elementary Tutorial](https://arxiv.org/pdf/2406.08929), 2024
- [Understanding Diffusion Models: A Unified Perspective](https://arxiv.org/abs/2208.11970), 2022

## MLSys

- vLLM (PagedAttention): 
  - https://www.youtube.com/watch?v=Oq2SN7uutbQ (CN)
  - https://www.youtube.com/watch?v=5ZlavKF_98U (EN)
- 