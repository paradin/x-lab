/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  Smartphone, 
  ShieldCheck, 
  Zap, 
  CreditCard, 
  Wallet, 
  Eye, 
  EyeOff, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
  MessageSquare,
  TrendingUp,
  Camera,
  Ticket,
  Fingerprint,
  Activity,
  Cpu
} from 'lucide-react';

// --- Types ---

interface Dialogue {
  agent: 'C-Agent' | 'B-Agent';
  text: string;
}

interface Scenario {
  time: string;
  title: string;
  background: string;
  traditional: {
    title: string;
    description: string;
    icon: React.ReactNode;
  };
  a2a: {
    dialogue: Dialogue[];
    outcome: string;
  };
  barrier: string;
  accent: string;
}

// --- Data ---

const SCENARIOS: Scenario[] = [
  {
    time: "09:00",
    title: "晨间自动财务“体检”",
    background: "背景：小陈刚醒，账户有新变动。",
    traditional: {
      title: "传统做法 (SDC)",
      description: "小陈收到三条短信通知和两个APP推送，告诉他账单到期、余额变动。小陈觉得很烦，全部划掉。",
      icon: <MessageSquare className="w-6 h-6 text-red-400" />
    },
    a2a: {
      dialogue: [
        { agent: 'C-Agent', text: "Hi，Bank-Agent。小陈昨晚在海外平台收到一笔3000美金的劳务费，今天下午他有一笔大额器材租赁支出。" },
        { agent: 'B-Agent', text: "收到。已自动匹配结汇路径，并根据他下午的支出需求，预留了头寸。剩余资金已自动划入‘灵动理财计划’，预计到下午支出前能产生3.5元的收益。" }
      ],
      outcome: "资金调度自动完成，无需用户干预。"
    },
    barrier: "语义理解与预测性执行。银行不再等用户点菜单，而是通过Agent直接对话完成资金调度。",
    accent: "cyan"
  },
  {
    time: "14:00",
    title: "动态价格博弈（极客贷款）",
    background: "背景：小陈在咖啡店看中了一套二手哈苏相机，需要临时提额5万元。",
    traditional: {
      title: "传统做法 (SDC)",
      description: "小陈点开APP，填写申请表，上传收入证明，等待审批，最后因为他是“自由职业者”被拒或给了一个极高的利率。",
      icon: <CreditCard className="w-6 h-6 text-red-400" />
    },
    a2a: {
      dialogue: [
        { agent: 'C-Agent', text: "Bank-Agent，小陈要买相机。他目前的B站粉丝数正在上涨，且过去三个月的商业合同履约率100%。我们要5万额度，利率要比挂牌低15%。" },
        { agent: 'B-Agent', text: "正在调取小陈在实验室‘数字足迹沙盒’中的信用数据……验证通过。由于他是优质创作者，且该笔消费属于生产力工具，实时定价引擎给出4.2%的特惠利率。" }
      ],
      outcome: "小陈在智能眼镜里点一下“确认”，资金秒到账。"
    },
    barrier: "非标数据定价模型。实验室绕过了SDC死板的信用评分，通过A2A实时谈判完成了风险定价。",
    accent: "purple"
  },
  {
    time: "20:00",
    title: "社交金融与权益流转",
    background: "背景：小陈想参加一个限量的数字艺术展。",
    traditional: {
      title: "传统做法 (SDC)",
      description: "银行在“积分商城”里上架了门票。小陈根本找不到入口。",
      icon: <Ticket className="w-6 h-6 text-red-400" />
    },
    a2a: {
      dialogue: [
        { agent: 'C-Agent', text: "Bank-Agent，小陈在小红书关注了这个展览，你们有合作吗？" },
        { agent: 'B-Agent', text: "有。我们拥有30个优先入场名额。小陈的‘金融极客勋章’等级足够，已自动将入场券推送到他的数字钱包。这笔权益是用他上月的‘碳减排’数据换取的。" }
      ],
      outcome: "权益自动检索与流转，无感兑换。"
    },
    barrier: "可编程权益生态。银行权益不再是死板的积分，而是Agent可以自动检索、交换、使用的数字资产。",
    accent: "emerald"
  },
  {
    time: "23:00",
    title: "跨平台无感清算",
    background: "背景：小陈在元宇宙平台购买了一件虚拟装备。",
    traditional: {
      title: "传统做法 (SDC)",
      description: "跳出网页跳转、扫码、输入六位密码。",
      icon: <ShieldCheck className="w-6 h-6 text-red-400" />
    },
    a2a: {
      dialogue: [
        { agent: 'C-Agent', text: "确认购买，Bank-Agent，请调用我的‘小额支付协议’进行加密结算。" },
        { agent: 'B-Agent', text: "检测到当前处于非安全网络环境，启动‘环境感知验证’——检测到小陈心率与常用手机轨迹一致，验证通过。支付完成。" }
      ],
      outcome: "彻底取消密码，改用行为生物识别和环境感知。"
    },
    barrier: "多模态无感风控。彻底取消密码，改用行为生物识别和环境感知。",
    accent: "blue"
  }
];

// --- Components ---

const AgentBubble = ({ dialogue, index }: { dialogue: Dialogue; index: number }) => {
  const isUser = dialogue.agent === 'C-Agent';
  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? -20 : 20, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: index * 0.8, duration: 0.5 }}
      className={`flex flex-col mb-4 ${isUser ? 'items-start' : 'items-end'}`}
    >
      <div className={`flex items-center gap-2 mb-1 ${isUser ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isUser ? 'bg-cyan-500 text-black' : 'bg-purple-500 text-white'}`}>
          {isUser ? 'C' : 'B'}
        </div>
        <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">{dialogue.agent}</span>
      </div>
      <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
        isUser 
          ? 'bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700' 
          : 'bg-indigo-900/40 text-indigo-100 rounded-tr-none border border-indigo-500/30'
      }`}>
        {dialogue.text}
      </div>
    </motion.div>
  );
};

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [viewMode, setViewMode] = useState<'traditional' | 'a2a'>('traditional');
  const [isAnimating, setIsAnimating] = useState(false);

  const scenario = SCENARIOS[currentStep];

  const nextStep = () => {
    if (currentStep < SCENARIOS.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setViewMode('traditional');
        setIsAnimating(false);
      }, 400);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setViewMode('traditional');
        setIsAnimating(false);
      }, 400);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 flex flex-col items-center p-4 md:p-8 overflow-y-auto">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-10 mb-8 text-center mt-4 md:mt-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4"
        >
          <Zap className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono tracking-widest uppercase text-cyan-400">Project Invisible</span>
        </motion.div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-2 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
          “隐形银行”计划
        </h1>
        <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto">
          Gen Z 青年“小陈”的24小时：从传统繁琐到Agent驱动的无感金融
        </p>
      </header>

      {/* Main Content: Phone Frame */}
      <div className="relative z-10 w-full max-w-[380px] aspect-[9/19] bg-[#111] rounded-[3rem] border-[8px] border-[#222] shadow-2xl overflow-hidden flex flex-col mb-12 shrink-0">
        {/* Phone Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#222] rounded-b-2xl z-50 flex items-center justify-center">
          <div className="w-12 h-1 bg-[#333] rounded-full" />
        </div>

        {/* Screen Content */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!isAnimating && (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col"
              >
                {/* Status Bar */}
                <div className="pt-8 px-6 pb-4 flex justify-between items-center text-[10px] font-medium text-gray-500">
                  <span>{scenario.time}</span>
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full border border-gray-700" />
                    <div className="w-3 h-3 rounded-full border border-gray-700" />
                    <div className="w-3 h-3 rounded-full bg-cyan-500/50" />
                  </div>
                </div>

                {/* Scenario Header */}
                <div className="px-6 mb-6">
                  <h2 className="text-xl font-bold mb-1">{scenario.title}</h2>
                  <p className="text-xs text-gray-500 italic">{scenario.background}</p>
                </div>

                {/* View Switcher */}
                <div className="px-6 mb-6">
                  <div className="flex p-1 bg-black/40 rounded-xl border border-white/5">
                    <button
                      onClick={() => setViewMode('traditional')}
                      className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                        viewMode === 'traditional' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      传统做法 (SDC)
                    </button>
                    <button
                      onClick={() => setViewMode('a2a')}
                      className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                        viewMode === 'a2a' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      A2A模式 (Lab)
                    </button>
                  </div>
                </div>

                {/* Scenario Body */}
                <div className="flex-1 px-6 overflow-y-auto pb-32 custom-scrollbar min-h-0 relative">
                  <AnimatePresence mode="wait">
                    {viewMode === 'traditional' ? (
                      <motion.div
                        key="trad"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 flex gap-4">
                          <div className="shrink-0 p-2 rounded-xl bg-red-500/10">
                            {scenario.traditional.icon}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-red-400 mb-1">{scenario.traditional.title}</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">
                              {scenario.traditional.description}
                            </p>
                          </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-gray-900/50 border border-gray-800 text-center">
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Pain Point</p>
                          <p className="text-xs text-gray-300 italic">“太繁琐了，我只想完成任务，不想操作银行。”</p>
                        </div>
                        <button 
                          onClick={() => setViewMode('a2a')}
                          className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                        >
                          体验 A2A 模式 <ChevronRight className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="a2a"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          {scenario.a2a.dialogue.map((d, i) => (
                            <div key={`bubble-${i}`}>
                              <AgentBubble dialogue={d} index={i} />
                            </div>
                          ))}
                        </div>
                        
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.8 }}
                          className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <ShieldCheck className="w-4 h-4 text-cyan-400" />
                            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">执行结果</h3>
                          </div>
                          <p className="text-sm text-gray-200">{scenario.a2a.outcome}</p>
                        </motion.div>

                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 2.2 }}
                          className="p-4 rounded-2xl bg-black/60 border border-white/5"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Cpu className="w-4 h-4 text-purple-400" />
                            <h3 className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">实验室壁垒</h3>
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed italic">
                            {scenario.barrier}
                          </p>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Scroll Indicator Hint */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center"
                  >
                    <span className="text-[8px] text-gray-600 uppercase tracking-[0.2em] mb-1">Scroll</span>
                    <ChevronDown className="w-3 h-3 text-gray-600" />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#111] via-[#111] to-transparent">
            <div className="flex justify-between items-center">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`p-3 rounded-full border border-white/10 transition-all ${
                  currentStep === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/5 active:scale-95'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex gap-1.5">
                {SCENARIOS.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === currentStep ? 'w-6 bg-cyan-500' : 'w-2 bg-gray-800'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextStep}
                disabled={currentStep === SCENARIOS.length - 1}
                className={`p-3 rounded-full border border-white/10 transition-all ${
                  currentStep === SCENARIOS.length - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/5 active:scale-95'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Legend */}
      <footer className="relative z-10 mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">C-Agent</span>
          </div>
          <p className="text-xs text-gray-500">用户个人助理，代表用户利益进行谈判与调度。</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">B-Agent</span>
          </div>
          <p className="text-xs text-gray-500">银行侧助理，负责风险定价、合规与资金清算。</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-3 h-3 text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Real-time</span>
          </div>
          <p className="text-xs text-gray-500">所有决策基于实时数据流，而非静态信用分。</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-3 h-3 text-blue-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Invisible</span>
          </div>
          <p className="text-xs text-gray-500">金融服务隐于生活场景，彻底告别繁琐APP。</p>
        </div>
      </footer>

      {/* Mobile Hint */}
      <div className="md:hidden mt-8 text-gray-500 text-[10px] uppercase tracking-[0.2em]">
        Scroll down to explore
      </div>
    </div>
  );
}
