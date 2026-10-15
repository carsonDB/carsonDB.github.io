---
title: "How to replicate PowerPoint precisely?"
description: ""
date: 2026-06-21
tags: ["pptx_editor", "architecture"]
series: "slide"
seriesOrder: 1
draft: true
---


# Intro
- Do we build another slide applicate like powerpoint hard ? Maybe not, since now we can just use web app technology to build any kinds of slide app. But why PowerPoint still dominate for decades. Why ?

# Back-compatibility issue
- Because PPT need back-compatility heavily. Its file *.pptx actually is a zip compressed folder. If you rename its extension from *.pptx to *.zip, then uncompress it, you will see its entire structure (show a folder directory as code block);
- In pptx zip folder, you can see there are multiple **.xml files, which decides the content of all slides in a slide deck. Which similar to html+css files, if you are familiar with web develop tech.
- So these ppt files are access and can be modified. What if we just use app to access (read/write) this zip folder's files, just like PowerPoint software read write the same folder files. Then can we build alternative to PowerPoint

# PPTX read/write layer
