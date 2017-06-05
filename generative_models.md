<!-- slide -->
## Introduce three generative models from the view of video prediction.
</br>
<div align='right'>1631722 吴思远</div>

<!-- slide -->
#### Why generative models should be applied in video prediction?
Uncertainty in video prediction.
![](./generative_pic/uncertainty.png)

<!-- slide -->
### Generative models
Discriminative Models $\longrightarrow p(\mathbf{y} | \mathbf{x})$

Generative Models $\longrightarrow p(\mathbf{y} , \mathbf{x})$ or $p(\mathbf{x})$.
</br>
<blockquote class="Blockquote--large">
<p>“What I cannot create, I do not understand.”</p>
<cite>—Richard Feynman</cite>
</blockquote>

<!-- slide -->
- ### Generative Adversarial Network.
- ### Variable Autoencoder.
- ### PixelRNN / PixelCNN (Autoregressive Network).

Papers:
- Generating videos with scene dynamics.
- An Uncertain Future: Forecasting from Static Images using Variational Autoencoders.
- Video Pixel Networks.

<!-- slide -->
### GAN generates 32 frames at a time.
![](./generative_pic/gan_network.png)

<!-- slide -->
### Selected generated clips
<table>
  <tr>
    <td>Beach</td>
    <td><img src='generative_pic/beach/1.gif'></td>
    <td><img src='generative_pic/beach/2.gif'></td>
    <td><img src='generative_pic/beach/3.gif'></td>
    <td><img src='generative_pic/beach/4.gif'></td>
  </tr>
  <tr>
    <td>golf</td>
    <td><img src='generative_pic/golf/1.gif'></td>
    <td><img src='generative_pic/golf/2.gif'></td>
    <td><img src='generative_pic/golf/3.gif'></td>
    <td><img src='generative_pic/golf/4.gif'></td>
  </tr>
  <tr>
    <td>train</td>
    <td><img src='generative_pic/train/1.gif'></td>
    <td><img src='generative_pic/train/2.gif'></td>
    <td><img src='generative_pic/train/3.gif'></td>
    <td><img src='generative_pic/train/4.gif'></td>
  </tr>
  <tr>
    <td>baby</td>
    <td><img src='generative_pic/baby/1.gif'></td>
    <td><img src='generative_pic/baby/2.gif'></td>
    <td><img src='generative_pic/baby/3.gif'></td>
    <td><img src='generative_pic/baby/4.gif'></td>
  </tr>
</table>

<!-- slide -->
### Pros:
- Beautiful, state-of-the-art samples!
### Cons:
- Trickier / more unstable to train.
- Can’t solve inference queries such as p(x), p(z|x).

<!-- slide -->
Different distance metrics used by different models.
![](generative_pic/three_distance_effects.png)
Paper: A NOTE ON THE EVALUATION OF GENERATIVE MODELS.

<!-- slide -->
### Variable Autoencoders
<table>
<tr>
<td><img src='generative_pic/autoencoder.png'></td>
<td><img src='generative_pic/vae_encoder.png'></td>
</tr>
</table>

Paper: Auto-Encoding Variational Bayes.

<!-- slide -->
### Maximize lower bound
![](./generative_pic/lower_bound_inference.png)
<!-- slide -->
### Reparameterization tricks
$z \sim \mathcal{N}(\mu,\,\Sigma) \longrightarrow
z = \mu + L\varepsilon, \varepsilon \sim \mathcal{N}(0, I)$
![](./generative_pic/reparameterization_trick.png)

<!-- slide -->
### Predict dense trajectory
![](./generative_pic/vae_DT.png)

<!-- slide -->
![](./generative_pic/dt_draw.png)

<!-- slide -->
### Pros:
- Principled approach to generative models.
- Allows inference of $q(z|x)$, can be useful feature representation for other tasks.
### Cons:
- Maximizes lower bound of likelihood: okay, but not as good evaluation as PixelRNN/PixelCNN.
- Samples blurrier and lower quality compared to state-of-the-art (GANs).

<!-- slide -->
### Negative log-likelihood for generative models on CIFAR-10 expressed as bits per sub-pixel.
![](./generative_pic/pixelplusplus_results.png)

Paper: PIXELCNN++: improving the pixelcnn with discretized logistic mixture likelihood and other modifications.

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
<img src='./generative_pic/pixelcnn.png'>
</div>

<!-- slide -->
### Results in nats/frame on the Moving MNIST dataset.
![](./generative_pic/vpn_results.png)
Paper: Video Pixel Networks.

<!-- slide -->
### Pros:
- Can explicitly compute likelihood p(x).
- Explicit likelihood of training data gives good evaluation metric.
- Good samples.
### Con:
- Sequential generation => slow.

<!-- slide -->
## Thank you.
