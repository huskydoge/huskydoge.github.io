---
title: "Basic Block Generation"
tags:
  - "Coq"
  - "FormalVerification"
authors:
  - name: "**Benhao Huang**"
  - name: "[Pengxiang Zhu](https://jubsteven.github.io/)"
  - name: "[Yizhou Liu](https://github.com/yizhou0409)"
path: "project/BasicBlocks"
excerpt: "CS2612 Programming Languages and Compilers, 2024. Intructor: [Prof. Qinxiang Cao](https://jhc.sjtu.edu.cn/people/members/faculty/qinxiang-cao.html)"
selected: true
cover: "./preview.png"
links:
  - name: "GitHub"
    url: "https://github.com/huskydoge/CS2612-BasicBlockGeneration"
priority: -2024
---

The definition of Basic Block: https://en.wikipedia.org/wiki/Basic_block

## 中文
**【语义理论】**基本块生成的正确性证明
考虑将程序语言语法树转化为控制流图并生成基本块的过程，请用数学语言定义这一转化过程
并证明它的正确性。本问题不要求考虑生成控制流图时为了减少基本块而使用的优化。
- 要求 1: 定义转化前程序语句的语法、控制流图的“语法”与两者的语义，用数学语言描述转化过程的
正确性性质，并证明赋值语句顺序执行情况的正确性。
- 要求 2：证明 if 条件分支语句情况下的
正确性。
- 要求 3：证明循环语句情况的正确性，并最终得到转化过程整体的正确性。

## English

**[Semantic Theory]** Correctness Proof for Basic Block Generation
Consider the process of transforming a program language syntax tree into a control flow graph and generating basic blocks. Please use mathematical language to define this transformation process and prove its correctness. This question does not require consideration of optimizations used to reduce basic blocks when generating control flow graphs.
Requirements:

1. Define the syntax of program statements before transformation, the "syntax" of the control flow graph, and the semantics of both. Describe the correctness properties of the transformation process using mathematical language, and prove the correctness for the case of sequential execution of assignment statements.
2. Prove the correctness for the case of if-conditional branch statements.
3. Prove the correctness for the case of loop statements, and ultimately derive the overall correctness of the transformation process.



My Github Repository for this course: https://github.com/huskydoge/CS2612-Programming-Languages-and-Compilers?tab=readme-ov-file