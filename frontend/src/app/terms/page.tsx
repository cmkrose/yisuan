'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Header/Navbar';
import Footer from '@/components/layout/Footer/Footer';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-xuan-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="inline-block text-xs tracking-[0.3em] text-xuan-gold/70 font-chinese mb-4">
              TERMS
            </span>
            <h1 className="text-3xl sm:text-4xl font-chinese font-bold text-gradient-gold mb-4">
              用户协议
            </h1>
            <p className="text-xuan-muted font-chinese text-sm">
              更新日期：2025年1月1日
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <p className="text-sm text-xuan-silver font-chinese leading-relaxed card-xuan-gold p-6 sm:p-8">
                欢迎使用易算平台（以下简称&ldquo;本平台&rdquo;或&ldquo;易算&rdquo;）。本用户协议（以下简称&ldquo;本协议&rdquo;）是您与易算平台运营方之间关于使用本平台服务所订立的具有法律约束力的合同。请您在注册或使用本平台服务前，仔细阅读本协议的全部条款。您点击&ldquo;同意&rdquo;按钮或实际使用本平台服务，即表示您已阅读、理解并同意接受本协议的所有条款和条件。如您不同意本协议中的任何条款，请勿注册或使用本平台服务。
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="card-xuan-gold p-6 sm:p-8">
              <h2 className="text-lg sm:text-xl font-chinese font-bold text-xuan-gold mb-4 border-b border-xuan-border pb-2">
                一、服务说明
              </h2>
              <div className="space-y-3 text-sm text-xuan-silver font-chinese leading-relaxed">
                <p>
                  1.1 本平台提供基于中国传统命理学的在线分析服务，包括但不限于：八字命理排盘分析、紫微斗数命盘解读、姓名学分析、风水堪舆指导、奇门遁甲布局、六爻占卜预测、择日吉凶查询以及AI命理辅助解读等功能。
                </p>
                <p>
                  1.2 本平台的部分核心服务需要用户注册账户并登录后方可使用。未注册用户可以浏览公开内容，但无法使用分析功能。
                </p>
                <p>
                  1.3 本平台保留根据自身运营需要调整、暂停或终止部分或全部服务的权利。涉及重大变更的，我们将提前通过平台公告或站内通知的方式告知用户。
                </p>
                <p>
                  1.4 本平台提供的命理分析结果仅供学习和参考之用，不构成任何形式的专业建议（包括但不限于医疗建议、法律建议、投资建议等）。用户应独立判断并以自身实际情况为准。
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="card-xuan-gold p-6 sm:p-8">
              <h2 className="text-lg sm:text-xl font-chinese font-bold text-xuan-gold mb-4 border-b border-xuan-border pb-2">
                二、用户责任
              </h2>
              <div className="space-y-3 text-sm text-xuan-silver font-chinese leading-relaxed">
                <p>
                  2.1 用户在注册时应提供真实、准确、完整的个人信息，并在信息变更时及时更新。因用户提供虚假或不完整信息导致的一切法律后果由用户自行承担。
                </p>
                <p>
                  2.2 用户应妥善保管账户和密码，不得将账户出借、转让或授权给任何第三方使用。因用户自身原因导致的账户被盗用或信息泄露，本平台不承担责任。
                </p>
                <p>
                  2.3 用户在使用本平台服务时，不得从事以下行为：（一）发布或传播违法信息，包括但不限于危害国家安全、破坏民族团结、宣扬暴力恐怖、传播淫秽色情等内容；（二）对平台系统进行反向工程、破解、攻击或干扰平台正常运营；（三）利用平台服务进行任何欺诈、虚假宣传或非法谋利活动；（四）侵犯他人知识产权、商业秘密或其他合法权益。
                </p>
                <p>
                  2.4 用户使用命理分析功能时，应审慎对待分析结果。命理分析并非精确科学，不同流派和方法可能得出不同结论。用户应保持理性态度，切勿将命理分析作为重大人生决策的唯一依据。
                </p>
                <p>
                  2.5 如用户违反本协议约定，本平台有权采取包括但不限于警告、限制功能、暂停服务、永久封禁账户等措施，并保留追究法律责任的权利。
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="card-xuan-gold p-6 sm:p-8">
              <h2 className="text-lg sm:text-xl font-chinese font-bold text-xuan-gold mb-4 border-b border-xuan-border pb-2">
                三、知识产权
              </h2>
              <div className="space-y-3 text-sm text-xuan-silver font-chinese leading-relaxed">
                <p>
                  3.1 本平台的源代码作为开源项目发布，根据项目仓库所附的开源许可证条款授权使用。用户应遵守对应开源许可证的义务要求。开源许可不包含平台运营方持有的商标、Logo和商业标识。
                </p>
                <p>
                  3.2 本平台发布的原创内容，包括但不限于命理分析算法、知识库文章、界面设计、图表样式、图标等（不含开源代码部分），其知识产权归本平台运营方所有。
                </p>
                <p>
                  3.3 用户在使用本平台过程中上传或生成的内容（包括命盘数据和分析报告），用户保留对该等内容的所有权利。用户授予本平台为提供服务之目的而必要的使用权限。
                </p>
                <p>
                  3.4 未经本平台书面许可，任何单位和个人不得以复制、镜像、抓取等任何方式大规模获取或使用本平台的数据内容。
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="card-xuan-gold p-6 sm:p-8">
              <h2 className="text-lg sm:text-xl font-chinese font-bold text-xuan-gold mb-4 border-b border-xuan-border pb-2">
                四、免责声明
              </h2>
              <div className="space-y-3 text-sm text-xuan-silver font-chinese leading-relaxed">
                <p>
                  4.1 本平台服务按&ldquo;现状&rdquo;提供，不附带任何形式的明示或默示保证。我们不保证服务完全无错误、不间断或满足所有用户期望。
                </p>
                <p>
                  4.2 命理学的理论和实践存在多种流派和解释体系，本平台的分析结果是基于特定算法和理论模型的自动计算，不代表唯一正确的解读。分析结果仅供文化研究和娱乐参考，用户应对据此做出的任何决策独立承担责任。
                </p>
                <p>
                  4.3 因不可抗力（包括但不限于自然灾害、战争、政府行为、网络攻击、电信基础设施故障等）、计算机病毒或黑客攻击、用户终端设备故障等原因造成的服务中断或数据损失，本平台不承担赔偿责任。
                </p>
                <p>
                  4.4 在法律允许的最大范围内，本平台不对因使用或无法使用本服务而产生的任何直接、间接、附带、特殊或后发性损害承担责任，包括但不限于利润损失、商誉损失、数据丢失或其他无形损失。
                </p>
                <p>
                  4.5 用户应了解并同意，AI大语言模型辅助分析的结果可能存在不准确、不完整或与事实不符的情况。AI分析仅供参考，不应作为决策的唯一或主要依据。
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="card-xuan-gold p-6 sm:p-8">
              <h2 className="text-lg sm:text-xl font-chinese font-bold text-xuan-gold mb-4 border-b border-xuan-border pb-2">
                五、服务变更
              </h2>
              <div className="space-y-3 text-sm text-xuan-silver font-chinese leading-relaxed">
                <p>
                  5.1 鉴于网络服务的特殊性，本平台保留在必要时修改、中断或终止部分或全部服务的权利，且无需对用户或任何第三方承担责任。
                </p>
                <p>
                  5.2 如本平台决定终止全部服务，将提前30日通过平台公告或站内通知的方式告知用户，以便用户有时间备份和导出个人数据。
                </p>
                <p>
                  5.3 本平台有权根据运营策略调整免费和收费服务的范围。如您使用的服务后续转为收费服务，我们将提前告知并征得您的同意后方可收费。您不同意付费的，有权在收费前停止使用相关服务。
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="card-xuan-gold p-6 sm:p-8">
              <h2 className="text-lg sm:text-xl font-chinese font-bold text-xuan-gold mb-4 border-b border-xuan-border pb-2">
                六、适用法律
              </h2>
              <div className="space-y-3 text-sm text-xuan-silver font-chinese leading-relaxed">
                <p>
                  6.1 本协议的订立、解释、执行和争议解决均适用中华人民共和国法律（为本协议之目的，不包括香港特别行政区、澳门特别行政区和台湾地区的法律）。
                </p>
                <p>
                  6.2 因本协议引起的或与本协议有关的任何争议，双方应首先通过友好协商解决。协商不成的，任何一方均有权向本平台运营方住所地有管辖权的人民法院提起诉讼。
                </p>
                <p>
                  6.3 如本协议中的任何条款因与现行法律冲突而无效或不可执行，不影响其他条款的效力。无效条款应按照最接近原条款意图且合法有效的方式进行解释和修改。
                </p>
                <p>
                  6.4 本平台不行使或延迟行使本协议项下的任何权利，不构成对该权利的放弃。任何权利的单独或部分行使，不妨碍该权利的进一步行使。
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <p className="text-sm text-xuan-muted font-chinese text-center card-xuan-gold p-6 sm:p-8">
                如对本用户协议有任何疑问，请通过【联系我们】页面列明的方式与我们取得联系。感谢您阅读本协议，祝您使用愉快。
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
