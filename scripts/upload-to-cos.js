import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// 加载 .env 文件
dotenv.config({ path: path.join(projectRoot, '.env') });

// 从环境变量读取配置
const config = {
  secretId: process.env.TENCENT_SECRET_ID,
  secretKey: process.env.TENCENT_SECRET_KEY,
  bucket: process.env.TENCENT_BUCKET,
  region: process.env.TENCENT_REGION || 'ap-shanghai',
};

// 验证配置
if (!config.secretId || !config.secretKey || !config.bucket) {
  console.error('❌ 缺少必要的环境变量配置');
  console.error('请设置以下环境变量:');
  console.error('  TENCENT_SECRET_ID');
  console.error('  TENCENT_SECRET_KEY');
  console.error('  TENCENT_BUCKET');
  console.error('\n参考 .env.example 文件');
  process.exit(1);
}

async function uploadToCOS() {
  try {
    // 动态导入 cos-nodejs-sdk-v5
    const COS = (await import('cos-nodejs-sdk-v5')).default;

    const cos = new COS({
      SecretId: config.secretId,
      SecretKey: config.secretKey,
    });

    const distPath = path.join(projectRoot, 'dist');

    if (!fs.existsSync(distPath)) {
      console.error('❌ dist 文件夹不存在，请先运行 npm run build');
      process.exit(1);
    }

    console.log(`📦 开始上传到腾讯云 COS...`);
    console.log(`   Bucket: ${config.bucket}`);
    console.log(`   Region: ${config.region}`);

    const files = getAllFiles(distPath);
    let uploadedCount = 0;

    for (const filePath of files) {
      const relativePath = path.relative(distPath, filePath);
      const fileContent = fs.readFileSync(filePath);

      await new Promise((resolve, reject) => {
        cos.putObject(
          {
            Bucket: config.bucket,
            Region: config.region,
            Key: relativePath.replace(/\\/g, '/'),
            Body: fileContent,
            ContentType: getContentType(filePath),
          },
          (err, data) => {
            if (err) {
              reject(err);
            } else {
              uploadedCount++;
              console.log(`   ✓ ${relativePath}`);
              resolve();
            }
          }
        );
      });
    }

    console.log(`\n✅ 上传完成！共 ${uploadedCount} 个文件`);
    console.log(`\n📍 访问地址: https://${config.bucket}.cos.${config.region}.myqcloud.com/index.html`);
  } catch (error) {
    console.error('❌ 上传失败:', error.message);
    process.exit(1);
  }
}

function getAllFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files = files.concat(getAllFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
  };
  return types[ext] || 'application/octet-stream';
}

uploadToCOS();
