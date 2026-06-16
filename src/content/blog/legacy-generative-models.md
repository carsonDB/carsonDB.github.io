---
title: "Generative Models for Video Prediction"
description: "Legacy presentation notes on GANs, VAEs, and autoregressive models for video prediction."
date: 2017-01-02
tags: ["deep-learning", "generative-models", "legacy"]
series: "legacy"
seriesOrder: 3
legacy: true
draft: false
---

<!-- slide -->
## Introduce three generative models from the view of video prediction.
</br>
<div align='right'>1631722 鍚存€濊繙</div>

<!-- slide -->
#### Why generative models should be applied in video prediction?
There are **uncertainties** in video prediction.
![](/generative_pic/uncertainty.png)

<!-- slide -->
### Discriminative models and Generative models
Discriminative Models $\longrightarrow p(\mathbf{y} | \mathbf{x})$
Models are fed with $\mathbf{x}$, and supposed to produce correct $\mathbf{y}$ with high probability.

Generative Models $\longrightarrow p(\mathbf{y} , \mathbf{x})$ or $p(\mathbf{x})$
Models are supposed to model real data $p(\mathbf{y} , \mathbf{x})$ or $p(\mathbf{x})$ distributions.
</br>
<blockquote class="Blockquote--large">
<p>鈥淲hat I cannot create, I do not understand.鈥?/p>
<cite>鈥擱ichard Feynman</cite>
</blockquote>

<!-- slide -->
- ### Generative Adversarial Network
- ### Variable Autoencoder
- ### PixelRNN / PixelCNN (Autoregressive Network)

Papers:
- Carl Vondrick, Hamed Pirsiavash, Antonio Torralba. "Generating videos with scene dynamics", in NIPS 2016.
- Jacob Walker, Carl Doersch, Abhinav Gupta, Martial Hebert. "An Uncertain Future: Forecasting from Static Images using Variational Autoencoders", in ECCV 2016.
- Nal Kalchbrenner, Aaron van den Oord, Karen Simonyan, Ivo Danihelka, Oriol Vinyals, Alex Graves, Koray Kavukcuoglu. "Video Pixel Networks", Arxiv, 2016.

<!-- slide -->
### GAN (conceptual)
<img width='100%' src='/generative_pic/gan_structure.png' />
A typical gan model consists of generator and discriminator.

<!-- slide -->
### Generator part of VideoGAN.
![](/generative_pic/gan_network.png)
This generator can produce 32 frames at a time. Efficient!

<!-- slide -->
### Selected generated clips
<table>
  <tr>
    <td>Beach</td>
    <td><img src='/generative_pic/beach/1.gif'></td>
    <td><img src='/generative_pic/beach/2.gif'></td>
    <td><img src='/generative_pic/beach/3.gif'></td>
    <td><img src='/generative_pic/beach/4.gif'></td>
  </tr>
  <tr>
    <td>golf</td>
    <td><img src='/generative_pic/golf/1.gif'></td>
    <td><img src='/generative_pic/golf/2.gif'></td>
    <td><img src='/generative_pic/golf/3.gif'></td>
    <td><img src='/generative_pic/golf/4.gif'></td>
  </tr>
  <tr>
    <td>train</td>
    <td><img src='/generative_pic/train/1.gif'></td>
    <td><img src='/generative_pic/train/2.gif'></td>
    <td><img src='/generative_pic/train/3.gif'></td>
    <td><img src='/generative_pic/train/4.gif'></td>
  </tr>
  <tr>
    <td>baby</td>
    <td><img src='/generative_pic/baby/1.gif'></td>
    <td><img src='/generative_pic/baby/2.gif'></td>
    <td><img src='/generative_pic/baby/3.gif'></td>
    <td><img src='/generative_pic/baby/4.gif'></td>
  </tr>
</table>

<!-- slide -->
### Pros:
- Beautiful, state-of-the-art samples!
### Cons:
- Trickier / more unstable to train.
- Can鈥檛 solve inference queries such as p(x), p(z|x).

<!-- slide -->
![](/generative_pic/three_distance_effects.png)
##### GAN belongs to the last one (JSD), while VAE and PixelRNN (PixelCNN) related to the second one (KLD).

Lucas Theis, A盲ron van den Oord, Matthias Bethge. "A note on the evaluation of generative models", in ICLR 2016.

<!-- slide -->
### Variable Autoencoders
<table>
<tr>
  <td align='middle'>Autoencoder</td>
  <td align='middle'>Encoder of VAE (inference)</td>
</tr>
<tr>
<td><img src='/generative_pic/autoencoder.png'></td>
<td><img src='/generative_pic/vae_encoder.png'></td>
</tr>
</table>

Diederik P Kingma, Max Welling. "Auto-Encoding Variational Bayes", in ICLR 2014.

<!-- slide -->
### Maximize lower bound
![](/generative_pic/lower_bound_inference.png)

<!-- slide -->
### Reparameterization tricks
$z \sim \mathcal{N}(\mu,\,\Sigma) \longrightarrow
z = \mu + L\varepsilon, \varepsilon \sim \mathcal{N}(0, I)$
![](/generative_pic/reparameterization_trick.png)

<!-- slide -->
### Predict dense trajectory
![](/generative_pic/vae_DT.png)
Jacob Walker, Carl Doersch, Abhinav Gupta, Martial Hebert. "An Uncertain Future: Forecasting from Static Images using Variational Autoencoders", in ECCV 2016.

<!-- slide -->
### Results
![](/generative_pic/dt_draw.png)

<!-- slide -->
### Pros:
- Principled approach to generative models.
- Allows inference of $q(z|x)$, can be useful feature representation for other tasks.
### Cons:
- Maximizes lower bound of likelihood: okay, but not as good evaluation as PixelRNN/PixelCNN.
- Samples blurrier and lower quality compared to state-of-the-art (GANs).

<!-- slide -->
### Negative log-likelihood for generative models on CIFAR-10 expressed as bits per sub-pixel.
![](/generative_pic/pixelplusplus_results.png)

Tim Salimans, Andrej Karpathy, Xi Chen, Diederik P. Kingma. "PIXELCNN++: improving the pixelcnn with discretized logistic mixture likelihood and other modifications", ICLR 2017.

<!-- slide -->
### PixelRNN / PixelCNN
Basic formula:
$\begin{aligned}
P(X) &= P(x_1,...,x_{i}) \\
&= P(x_i | x_1,..., x_{i-1}) P(x_1,..., x_{i-1}) \\
&= ... \\
&= {\displaystyle \prod_{i=1}^{n^2} P(x_i|x_1,...,x_{i-1})}
\end{aligned}$
<div style='position: absolute; top: 20%; left: 60%'>
<img src='/generative_pic/pixelcnn.png'>
</div>
</br>
Model every pixel iteratively with RNN.

<!-- slide -->
### Results in nats/frame on the Moving MNIST dataset.
![](/generative_pic/vpn_results.png)
Nal Kalchbrenner, Aaron van den Oord, Karen Simonyan, Ivo Danihelka, Oriol Vinyals, Alex Graves, Koray Kavukcuoglu. "Video Pixel Networks", Arxiv, 2016.

<!-- slide -->
### Pros:
- Can explicitly compute likelihood p(x).
- Explicit likelihood of training data gives good evaluation metric.
- Good samples.
### Con:
- Sequential generation => slow.

<!-- slide -->
## Thank you


