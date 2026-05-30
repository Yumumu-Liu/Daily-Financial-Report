const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

// 配置文件路径
const IBD_PDF_PATH = path.join(__dirname, '../data/ibd_400.pdf');
const SNT_PDF_PATH = path.join(__dirname, '../data/snt_qna.pdf');
const OUTPUT_DIR = path.join(__dirname, '../src/data');

// 定义问题的数据结构
interface Question {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags: string[];
}

/**
 * 核心处理函数：读取 PDF，解析文本，并进行分类
 */
async function processPDF(filePath: string, track: 'IBD' | 'SNT'): Promise<Question[]> {
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  文件未找到: ${filePath}`);
    console.warn(`   请将您的 PDF 文件放入该路径后重试。`);
    return [];
  }

  console.log(`📄 正在读取并解析 ${track} 的 PDF 文件: ${filePath}...`);
  
  try {
    const dataBuffer = fs.readFileSync(filePath);
    // 解析 PDF 文本
    const data = await pdfParse(dataBuffer);
    const text = data.text;
    
    console.log(`✅ 成功提取了 ${text.length} 个字符的文本数据。`);
    
    // 调用分类逻辑（您可以根据具体的 PDF 文本结构进行正则替换，或者接入 LLM 接口）
    const questions = categorizeText(text, track);
    return questions;
  } catch (error) {
    console.error(`❌ 解析 ${track} PDF 失败:`, error);
    return [];
  }
}

/**
 * 文本分类逻辑引擎
 * 由于纯文本丢失了排版信息，这里提供一个基础的正则拆分框架。
 * 如果您的文本非常不规则，推荐在此处替换为调用大模型（如 OpenAI / Gemini）的 API，将文本切块后让 AI 返回结构化 JSON。
 */
function categorizeText(rawText: string, track: 'IBD' | 'SNT'): Question[] {
  console.log(`🧠 正在对 ${track} 文本进行结构化分类...`);
  const questions: Question[] = [];
  
  const lines = rawText.split('\n');
  let currentQuestion = "";
  let currentAnswer: string[] = [];
  let questionCount = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // 忽略页眉页脚
    if (!line || line.includes("SalesAndTrading.Org") || line.includes("All Rights Reserved")) continue;

    // 判断是否是新问题 (长度适中，且以问号结尾)
    if (line.endsWith("?") && line.length < 150 && !line.includes("Are you doing")) {
      // 保存上一个问题
      if (currentQuestion) {
        questions.push(buildQuestionObject(currentQuestion, currentAnswer.join(' '), track, questionCount++));
      }
      currentQuestion = line;
      currentAnswer = [];
    } else if (currentQuestion) {
      currentAnswer.push(line);
    }
  }

  // 保存最后一个
  if (currentQuestion) {
    questions.push(buildQuestionObject(currentQuestion, currentAnswer.join(' '), track, questionCount));
  }

  if (questions.length === 0) {
    console.warn(`⚠️ 正则未能匹配到任何结构化问答！`);
  } else {
    console.log(`🎯 成功提取并分类了 ${questions.length} 个 ${track} 问题！`);
  }

  return questions;
}

function buildQuestionObject(qText: string, aText: string, track: string, idNum: number): Question {
  const tags: string[] = [];
  let category = "General";

  if (track === 'IBD') {
    if (qText.match(/depreciation|amortization|ebitda|working capital/i)) {
      category = "Accounting";
      tags.push("#Accounting");
    } else if (qText.match(/dcf|wacc|terminal value|discount rate/i)) {
      category = "Valuation";
      tags.push("#DCF", "#Valuation");
    } else if (qText.match(/lbo|irr|moic|debt/i)) {
      category = "LBO";
      tags.push("#LBO", "#PE");
    } else if (qText.match(/merger|accretion|dilution|synergy/i)) {
      category = "M&A";
      tags.push("#M&A");
    }
  } else if (track === 'SNT') {
    if (qText.match(/greeks|delta|gamma|vega|theta|implied volatility/i)) {
      category = "Options";
      tags.push("#Option_Greeks");
    } else if (qText.match(/bond|yield|duration|convexity/i)) {
      category = "Fixed Income";
      tags.push("#Credit", "#Rates");
    } else if (qText.match(/inflation|fed|hike|cpi/i)) {
      category = "Macro";
      tags.push("#Macro");
    } else if (qText.match(/brainteaser|probability|coin/i)) {
      category = "Brainteaser";
      tags.push("#Brainteasers");
    }
  }

  return {
    id: `${track.toLowerCase()}-${idNum}`,
    category,
    question: qText,
    answer: aText.substring(0, 1000), // 限制答案长度
    tags
  };
}

async function main() {
  console.log("🚀 开始执行数据填充脚本 (Seed Data)...");

  // 确保输出目录存在
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // 1. 处理 IBD 数据
  const ibdQuestions = await processPDF(IBD_PDF_PATH, 'IBD');
  if (ibdQuestions.length > 0) {
    const outPath = path.join(OUTPUT_DIR, 'ibd_questions.json');
    fs.writeFileSync(outPath, JSON.stringify(ibdQuestions, null, 2), 'utf-8');
    console.log(`💾 IBD 数据已保存至: ${outPath}`);
  }

  console.log("--------------------------------------------------");

  // 2. 处理 S&T 数据
  const sntQuestions = await processPDF(SNT_PDF_PATH, 'SNT');
  if (sntQuestions.length > 0) {
    const outPath = path.join(OUTPUT_DIR, 'snt_questions.json');
    fs.writeFileSync(outPath, JSON.stringify(sntQuestions, null, 2), 'utf-8');
    console.log(`💾 S&T 数据已保存至: ${outPath}`);
  }

  console.log("✨ Seed 脚本执行完毕！");
}

main();