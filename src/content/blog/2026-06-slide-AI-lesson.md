---
title: "The bitter lesson of developing AI agent for slides"
description: ""
date: 2026-06-21
tags: []
series: "slide"
seriesOrder: 1
draft: true
---


# Is it possible to make slide AI agent ?
- Most current slide ai app, generate slides from scratch, not edit current slide (e.g. PowerPoint pptx). Why ?
- Because it is easy to generate from any technology format (like most popular way is generate slide based on HTML/css/js), and AI also very good at it.
- But the problem is PowerPoint dominates slide market for decades. So wether what you use tools to make slides. You still need follow PowerPoint's file format pptx. And PPTX is very complex and has deep legacy back-compatiblity. So this make most AI slide app cannot deeply compatible with PowerPoint.
- So these AI slides just worked as initial draft at most. Then user will move into PowerPoint to continue revise, which takes extra hours to revise.

# PowerPoint addin
- Since we cannot ignore PowerPoint's existence, can we directly edit ppt slide with help of PowerPoint ? Do PowerPoint expose API, so we let AI edit slide through PowerPoint's APIs.
- The answer is yes, Altough PowerPoint is close sourced, but it still provide several types of APIs for developers to make ppt addin.
- List several PPT slide APIs. And give a simple table to list them with pros and cons.

## Office.js
- In order to make cross platform ppt slide addin. I choose the office.js which is latest solution. It can not just run in windows ppt and mac os, it can even run in ppt web. Since this addin just a web app (html/css/js), natively cross platform.
- The problem is office.js, it is too weak. It only support very limited and basic APIs. 
- For example, all objects only accept rectangular position format (x,y,width,height), and even connector (line) is. It is really weird, it cannot set points {start, end}. and it must set rect position with rotation to do the same job.
- Not to mention, it cannot access advanced properties, like shadow/...;
- So AI's power greatly limited by this addin interface;

## Better solution: PPTX inline objects edits
- Since officejs APIs are too weak, but it still give some very important APIs, which allow us to edit slide at a lower level, OOXML.
- OOXML simpliy explain, what this is, and give a link (reference) to another blog (2026-PPT-Replicate) for further detailed explain;
- Office.js provide two key APIs: 1. read pptx zip (full access); 2. replace any slide (slide.xml) as base64 format (manipulate inline objects);
- So I make a pptx (OOXML) edit layer (library), called `pptx_editor`, which take responsible for access OOXML file of each slide directly, and provide semantic operations for AI to take actions. Like slide.addObject('connector', {start, end}); And for each object, it can also access every properties, like connector.setColor(...);

### How to keep fully compatibility ? 
- Besides unitests, we must need e2e tests with PowerPoint test.
- Remember that PowerPoint provide not just officejs (limited but cross platform), it also provide another fully powerful but legacy interface COM, which is only accessible in Windows desktop PPT. But this works for e2e tests, when developing ppt addin in windows system.
- Test loop: pptx_editor make/edit -> pptx -> should be opened successfully in PowerPoint; And PowerPoint make/edit -> pptx_editor access successfully. This called ...
- Once provide enough test cases, we can say this editor library can cover most of PPT cases with greate compatiblity.

### Limitation of pptx edits
- But still has limiations. Since image/chart/smartArt, they have assets like image, data... So these objects not just inline in slide.xml, they rely on other assets in the pptx zip folder. But through officejs, we cannot modify other files, except replace slide.xml (inline);
- This (officejs) maybe also Claude for PowerPoint solution (sine it is cross platform). But still I cannot figure out how Claude can operate native chart. Maybe they (anthropic company) has private/beta APIs offered by Microsoft. I don't know.

# Final solution: Complete independent PPTX editor (with AI)
- In AI era, I expect every working app/tools will be replace by automatic AI app/tools.
- Since these automation app don't need to human manually edit. So we just don't need edit interface UI. For example, use mouse click one object is to let it focused, use mouse to drag obect to move/resize/rotate...; And there a lot of preset buttons to click, input box to set values, and so on. 
- It just use AI to directly use pptx_editor to manipulate pptx files. And human user just edit slides by chat with AI in the chatBot.
- And since slides are finally for human eyes to view. So in the AI app, it still need to render slide in vision (image), so human can see it and supervised it at any time. So in this way, it still needs a render engine.
- And this render engine is also a engineering challenge, if we also consider back-compabitlity issue.
- Since PowerPoint is closed sourced, and it actually has many small render details (tricks/quacks), which looks like a blackbox for us.
- The only way to replicate this render engine like PowerPoint, is use e2e tests with PowerPoint.
- For each test case: same pptx file show in PowerPoint and AI app, should be the exact same, pixelated same;
- Only given enough such tests cases, it then can cover most compatility.

# End
- PowerPoint slide automation is just an example in the AI times. It not just AI automation, it still need to consider back-compatility, cross-platform, and engineering plausible solutions. Hope to give inpiration to other developers who want to do such automation jobs.
