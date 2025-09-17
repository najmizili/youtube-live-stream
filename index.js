const { exec } = require('child_process');

const STREAM_KEY = process.env.YOUTUBE_STREAM_KEY; // مفتاح البث من YouTube
const INPUT_VIDEO = process.env.INPUT_VIDEO || 'video.mp4'; // اسم الفيديو المحلي أو رابط مباشر

function startStream() {
    const cmd = `ffmpeg -re -i ${INPUT_VIDEO} -c:v libx264 -preset veryfast -maxrate 2500k -bufsize 5000k -pix_fmt yuv420p -g 50 -c:a aac -b:a 128k -f flv rtmp://a.rtmp.youtube.com/live2/${STREAM_KEY}`;
    const stream = exec(cmd);

    stream.stdout.on('data', data => console.log(data));
    stream.stderr.on('data', data => console.error(data));

    stream.on('close', code => {
        console.log(`Stream stopped with code ${code}. Restarting in 5 seconds...`);
        setTimeout(startStream, 5000);
    });
}

startStream();
