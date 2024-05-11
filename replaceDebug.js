const fs = require('fs');
const path = require('path');

// 递归读取目录中的所有文件
function readDirRecursive(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            readDirRecursive(filePath, fileList);
        } else {
            fileList.push(filePath);
        }
    });
    return fileList;
}

// 处理文件
function processFile(file, patterns) {
    let content = fs.readFileSync(file, 'utf8');
    patterns.forEach(pattern => {
        content = content.replace(pattern.regex, pattern.replacement);
    });
    fs.writeFileSync(file, content, 'utf8');
}

// 获取项目目录
const projectDir = process.cwd();
const files = readDirRecursive(projectDir).filter(file => file.endsWith('.rs')); // 只处理 .rs 文件

// 定义替换模式
const patterns1 = [
    {
        regex: /^(?!\s*\/\/.*)(\s*)debug!\((.*)\);/gm,
        replacement: '$1//  debug!($2);'
    }
];

const patterns2 = [
    {
        regex: /^(\s*)\/\/\s*debug!\((.*)\);/gm,
        replacement: '$1debug!($2);'
    }
];

// 处理文件，基于命令行参数选择模式
const args = process.argv.slice(2);
const selectedPatterns = args.includes('uncomment') ? patterns2 : patterns1;

files.forEach(file => {
    processFile(file, selectedPatterns);
});

console.log('Replacement complete.');
