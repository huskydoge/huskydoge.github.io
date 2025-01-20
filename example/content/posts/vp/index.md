---
title: "An Exploration for Fast Video Processing"
tags: ["skills"]
date: 2024-07-25
path: "posts/vp"
excerpt: How to process 100m mp4 clips?
---

# Background

It's always fast to process a single video clip. But what if you have 100m clips? It's an important problem in the project I'm working on. In this post, I will share my exploration on this topic.

The current pipeline mainly involves two parts: 
- video reading: read the video clips from the disk, which is **I/O bound**.
- video processing: process the video clips, which is **CPU bound**.

I tried to optimize two parts separately.

# Line Profiling

Optimizing without target is meaningless. So I first profiled the code to find the bottleneck. I used `line_profiler` to profile the code. I find that it's quite convenient to use, just follow the steps below:
1. `pip install line_profiler`
2. Then following the code here:
    
    ```python




# Video Reading

## multiprocessing

Currently, I'm using Python's `multiprocessing` library(a good tutorial [here](https://superfastpython.com/multiprocessing-in-python/)). I divide the mp4 file list and process them in parallel. This could be achieved by the following code example:

```python

index_list = list(range(len(self.mp4_list)))
            
pool = mp.Pool(N_workers)
num_per_process = math.ceil(len(self.mp4_list) // self.total_process)

start_index: int = num_per_process * self.process_index
end_index: int = start_index + num_per_process if self.process_index < self.total_process - 1 else len(self.mp4_list)
process_index_list = index_list[start_index:end_index]
total_index = len(process_index_list)

for _ in tqdm(pool.imap_unordered(self.read_mp4, range(len(process_index_list))), total=len(process_index_list)):
    pass
    
pool.close()
pool.join()

```

Where `N_workers` is the number of workers, `self.mp4_list` is the list of mp4 files, `self.read_mp4` is the function to process the mp4 files. `imap_unordered` means we don't care about the order of the results. (otherwise you should use `map`)

Then here comes a question: how to choose a proper `N_workers`? After suverying the internet, 

- Do we have any tools that allocate N_workers automatically?

## Faster Video Reading

To read mp4 file, the traditional way is to use `cv2.VideoCapture`. However, after surveying the internet, I found that cv2.VideoCapture is not the fastest way to read mp4 files. There are multiple alternatives.
