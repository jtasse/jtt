---
title: Meowlin
og_title: Meowlin - [pretend to] identify cat breeds based on their meows
date: 2026-05-13
description: Meowlin identifies cat breeds from user-uploaded audio recordings (or rather it *would* if its processing layer were not mocked)
image: ./meowlin_cover_photo.png
author: "James Tasse"
tags: "AWS"
---

# That bird app

You may have heard of [Merlin](https://merlin.allaboutbirds.org/), a fantastic mobile app that can identify birds in real time.

# This cat app

Well I had a very simple idea. What if I created a solution like Merlin but for _cats_? Thus [Meowlin](https://github.com/jtasse/meowlin/tree/main) was born.

# Caveats

All right, before we go any further, I need to clarify that one cannot simply walk into a cat cafe and use Meowlin to start identifying cat breeds based on recorded meows. This is first and foremost a _demo_ of the knowledge I gained before [passing](https://drive.google.com/file/d/1H1U0T9gPwDbSFsZ8DSF9j-uFtdjSesaL) the [AWS Certified Developer - Associate](https://aws.amazon.com/certification/certified-developer-associate/) exam. As such, I would like to call out a few [caveats](https://github.com/jtasse/meowlin/blob/main/README.md#caveats), the main one being that I implemented mock processing for this demo _rather than gathering loads of high quality meow audio and using machine learning to train an audio processing model_. Phew!

But who knows, mabye someday!

# How it works

I won't get into the weeds here. There's a [high level overview](https://github.com/jtasse/meowlin/blob/main/README.md#high-level-data-flow) of the process in the solution's [README](https://github.com/jtasse/meowlin/blob/main/README.md) and a [detailed sequence diagram](https://github.com/jtasse/meowlin/blob/main/ARCHITECTURE.md#current-sequence-diagram) in the solution's [Architecture doc](https://github.com/jtasse/meowlin/blob/main/ARCHITECTURE.md) if you're curious.

But at a very high level, here's how it works:

1. User uploads a raw audio file using a pre-signed URL.
2. Solution returns a [mocked] result that may or may not contain a cat breed ID.

# What's next

I'd like to get more experience with React, so I plan to create some kind of client (possibly one for Meowlin to replace its unwieldy Postman collection!).

In any case, thanks for reading!
