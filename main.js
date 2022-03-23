/*
 * @Author: your name
 * @Date: 2022-03-22 15:27:29
 * @LastEditTime: 2022-03-23 12:00:57
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \2DLive\main.js
 */
$(document).ready(function() {
    const video = $('#webcam')[0];
    const overlay = $('#overlay')[0];
    const overlay_eye = overlay.getContext('2d');
    // 初始化偵測
    const ctrack = new clm.tracker();
    ctrack.init();
  
  // 根據输出的數组中人脸相應位置的坐標，圈出眼睛的位置
    function getEyes(positions) {
      const minX = positions[23][0] - 6;
      const maxX = positions[28][0] + 6;
      const minY = positions[24][1] - 6;
      const maxY = positions[26][1] + 6;
  
      const width = maxX - minX;
      const height = maxY - minY;
  
      return [minX, minY, width, height];
    }
  
    // 持續監測人臉
    function detect() {
      // 檢查是否檢測到人臉
      requestAnimationFrame(detect);
      // 取得當前視訊的分類點
      let currentPosition = ctrack.getCurrentPosition();
  
      overlay_eye.clearRect(0, 0, 400, 300);
      if (currentPosition) {
        // 在overlay canvas上画出檢測到的人臉:
        ctrack.draw(overlay);
  
        // 畫出人眼位置:
        const eyesRect = getEyes(currentPosition);
        overlay_eye.strokeStyle = 'red';
        overlay_eye.strokeRect(eyesRect[0], eyesRect[1], eyesRect[2], eyesRect[3]);
        
      }
    }
  
    function onStreaming(stream) {
      video.srcObject = stream;
      //開始追蹤視訊中的畫面 
      ctrack.start(video);
      detect();
    }
  
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then(onStreaming);
  
  });
  