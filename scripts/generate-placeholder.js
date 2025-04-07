const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// 创建画布
const canvas = createCanvas(290, 190);
const ctx = canvas.getContext('2d');

// 设置背景色
ctx.fillStyle = '#1a1a1a';
ctx.fillRect(0, 0, 290, 190);

// 添加网格
ctx.strokeStyle = '#333333';
ctx.lineWidth = 1;

// 绘制垂直线
for (let x = 0; x <= 290; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 190);
    ctx.stroke();
}

// 绘制水平线
for (let y = 0; y <= 190; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(290, y);
    ctx.stroke();
}

// 添加文字
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 20px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('DeFi Smart Account', 145, 95);

// 确保目录存在
const dir = path.join(__dirname, '../public/images/dsa');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

// 保存图片
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(dir, 'account-cover.png'), buffer);

console.log('占位图片已生成在 public/images/dsa/account-cover.png'); 