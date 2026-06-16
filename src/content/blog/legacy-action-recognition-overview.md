---
title: "Action Recognition Overview"
description: "Legacy presentation notes on action recognition, optical flow, and video CNNs."
date: 2017-01-03
tags: ["computer-vision", "action-recognition", "legacy"]
series: "legacy"
seriesOrder: 2
legacy: true
draft: false
---

<!-- slide -->
# Action Recognition Overview
灏忕粍鎴愬憳锛氭櫙鏅?璋㈣嫳鏉?鍚存€濊繙

<!-- slide -->
# Definition
Activity recognition aims to recognize the **actions** and goals of one or more **agents** from a series of observations on the agents' **actions and the environmental conditions**.
- Spatial information (image)
- Temporal information (motion)

<!-- slide -->
# Dataset
- UCF101 - Action Recognition Data Set.
- HMDB51: A Large Video Database for Human Motion Recognition.
- Sports-1M Dataset (not available)
- Human Activity Video Datasets
- THUMOS Challenge 2015 Action Recognition in Temporally Untrimmed Videos
- ...

<!-- slide -->
# Intuition
<img style='float:left' width=50% src='/pic/static_walk.jpg'>

<img style='float:right' width=40% src='/pic/dots_move.gif'>

<!-- slide -->
# Optical flow
![](/pic/optical_flow.png)``
$$I(x, y, t) = I(x + \Delta x, y + \Delta y, t + \Delta t)$$

<!-- slide -->
# Traditional method
Dense trajectories and motion boundary descriptors for action recognition (Wang et al., 2013)
![](/pic/dense_trajectory.jpg)

<!-- slide -->
# Spatio-Temporal ConvNets
1. Large-scale Video Classification with Convolutional Neural Networks, Karpathy et al., 2014

![](/pic/spatio_temporal_convnets.jpg)

<!-- slide -->
![](/pic/spatio_temporal_convnets_benchmark.jpg)
Note: The motion information didn鈥檛 add all that much...

<!-- slide -->
2. Two-Stream Convolutional Networks for Action Recognition in Videos, Simonyan and Zisserman 2014
![](/pic/two_stream.jpg)

<!-- slide -->
## "Slow fusion" VS "Two-Stream"
1. Spatio-Temporal ConvNets
![](/pic/slow_fusion_ucf101_result.png)
2. Two-Stream Convolutional Networks
![](/pic/two_stream_benchmark.jpg)

<!-- slide -->
![](/pic/two_stream_tensor.jpg)
- 鍒╃敤鍏夋祦鏄捐憲鎻愬崌绮惧害銆?
- 鍒╃敤pretrained model鐨勭壒寰佹彁鍙栫殑浼樺娍銆?
- Two-Stream 鏄剧劧姣斾箣鍓嶇殑鏁堟灉瑕佸ソ寰堝銆?

<!-- slide -->
3. Learning Spatiotemporal Features with 3D Convolutional Networks, Tran 2015
![](/pic/2d_3d_conv.png)

- 瀹為獙缁忛獙寰楀埌 3x3x3 kernel 鏁堟灉鏈€濂姐€?
- 鍗风Н鏍哥殑鏃堕棿缁村害鐨勯暱搴︿篃鍙湁3锛屾槸鍚﹁幏寰楄繍鍔ㄤ俊鎭憿锛?
- 缂虹偣: 鏃犳硶浣跨敤棰勮缁冨ソ鐨?缁村嵎绉綉缁溿€?

<!-- slide -->
4. Long-term Recurrent Convolutional Networks for Visual Recognition and Description, Donahue et al., 2015
![](/pic/Long_time_spatio_temporal_convnet.jpg)
- CNN -> feature -> RNN(LSTM)
- 鑾峰緱闀挎湡搴忓垪淇℃伅銆?
- 妯″瀷鏇村鏉傦紝闇€瑕佸厛鍚庤缁冧袱涓ā鍨嬨€?
- 濡傛灉鎶奀NN鍜孯NN缁撳悎锛屼細濡備綍鍛紵

<!-- slide -->
# Problems
1. 鏃犳硶瀹屽叏鍒╃敤鍗风Н绁炵粡缃戠粶瀛︿範闀挎湡鐨勮棰戜俊鎭€?
2. 瑙嗛鏁版嵁闆嗘牱鏈噺涓嶅澶э紝瀹规槗杩囨嫙鍚堬紝浣嗘槸鏁版嵁闆嗘€讳綋浣撶Н澶с€?
3. 澶ч儴鍒嗙殑妯″瀷杩橀渶瑕佷緷璧栧厜娴佺殑甯姪銆?

<!-- slide -->
# Expectation
1. 瑙嗛鐩搁偦甯у瓨鍦ㄥぇ閲忕殑鍐椾綑锛屽笇鏈涜兘闄嶄綆璁＄畻澶嶆潅搴︼紝鎻愰珮鏁堟灉銆?
2. 闅忕潃纭欢锛堢壒鍒槸GPU锛夌殑鍙戝睍锛屽湪涓嶄箙鐨勫皢鏉ワ紝鍙互鏈夊儚鐜板湪杩欐牱鐨勫浘鐗囨暟鎹泦锛圛magenet锛夛紝璁粌鏃堕棿涔熷彲浠ユ帴鍙椼€?
3. 瑙嗛钑村惈鐫€姣斿浘鐗囧寰堝鐨勪俊鎭€?
4. 鐩告瘮浜庡浘鐗囷紝瑙嗛鍏锋湁鏌愮搴忓垪锛屽彲浠ョ敤鍦ㄦ棤鐩戠潱寮忓涔犱腑鐨勭洃鐫ｅ洜绱犮€?

<!-- slide -->
# Thank You

