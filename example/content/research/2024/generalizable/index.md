---
title: "Defining and extracting generalizable interaction primitives from DNNs"
date: "2024-09-13"
tags:
  - "LLM"
  - "AI Interpretability"
venue: ICLR-2024
authors:
  - name: "Lu Chen"
  - name: "Siyu Lou"
  - name: "**Benhao Huang**"
  - name: "Quanshi Zhang"
path: "research/2024/generalizable"
excerpt: Given different DNNs trained for the same task, developed a new method to extract interactions that are shared by these DNNs. Experiments show that the extracted interactions can better reflect common knowledge shared by different DNNs.
selected: false
cover: "./preview.png"
links:
  - name: "paper"
    url: "https://arxiv.org/abs/2401.16318"
  - name: "GitHub"
    url: "https://github.com/sjtu-xai-lab/generalizable-interaction"
priority: 2
---

Faithfully summarizing the knowledge encoded by a deep neural network (DNN) into a few symbolic primitive patterns without losing much information represents a core challenge in explainable AI. To this end, Ren et al. (2023c) have derived a series of theorems to prove that the inference score of a DNN can be explained as a small set of interactions between input variables. However, the lack of generalization power makes it still hard to consider such interactions as faithful primitive patterns encoded by the DNN. Therefore, given different DNNs trained for the same task, we develop a new method to extract interactions that are shared by these DNNs. Experiments show that the extracted interactions can better reflect common knowledge shared by different DNNs.


