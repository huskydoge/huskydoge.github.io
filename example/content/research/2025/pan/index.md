---
title: "PAN: Towards General World Model with Natural Language Actions and Video States"
date: "2025-07-01"
tags:
  - "World Model"
  - "Image to Video"
  - "Diffusion"

# venue: a very very very very long long long long long long venue
authors:
  - name: "**Benhao Huang**"
  - name: "Pandora Team"
    url:  "https://maitrix.org/"
  - name: "Zhiting Hu"
    url: "https://zhiting.ucsd.edu/" 
  - name: "Eric P. Xing"
    url: "https://www.cs.cmu.edu/~epxing/"
path: "research/2025/pan"
excerpt: "A step towards a General World Model (GWM) that can simulate complex video scenarios with natural language actions."
selected: true
cover: "./preview.png"
links:
  - name: "新智元"
    url: "https://mp.weixin.qq.com/s/KeFkjhxkxhwGop5cNJwMOg"
  - name: "paper-v1"
    url: "https://world-model.maitrix.org/assets/pandora.pdf"
  - name: "Github"
    url: "https://github.com/maitrix-org/Pandora"
  - name: "Mirage"
    url: "https://blog.dynamicslab.ai/"
priority: 0
---

- **Diffusion Game Engine:** Built an auto-regressive Image-to-Video (I2V) model capable of simulating 2D platformer games (e.g., Mario), allowing control of both characters and environmental elements using text inputs on the fly. Proposed and implemented window-slide conditioning to support the generation of game videos lasting longer than one minute.

- **Video Diffusion Model Acceleration:** Spearheaded a sub-project focusing on optimizing video diffusion for real-time game generation, achieving generation speeds of under 1 second per round.

- **Complex Video Captioning:** Led a sub-project aimed at enhancing video captioning for complex scenarios (e.g. game videos) where even state-of-the-art visual language models tend to falter, ensuring more accurate descriptions.

- **Large-Scale Training Data Pipeline:** Designed and implemented a high-efficiency processing pipeline for video training data, processing over 10 million videos simultaneously, significantly improving the overall data quality and processing speed.

![mcts](./mcts.png)


