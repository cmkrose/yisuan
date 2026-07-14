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

export default function PrivacyPage() {
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
              PRIVACY
            </span>
            <h1 className="text-3xl sm:text-4xl font-chinese font-bold text-gradient-gold mb-4">
              隐私政策
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
                易算平台（以下简称&ldquo;我们&rdquo;）深知个人信息对您的重要性，并会尽全力保护您的个人信息安全。本隐私政策旨在向您说明我们如何收集、使用、存储和保护您的个人信息，以及您所享有的相关权利。请您在使用我们的服务前，仔细阅读并充分理解本隐私政策。
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="card-xuan-gold p-6 sm:p-8">
              <h2 className="text-lg sm:text-xl font-chinese font-bold text-xuan-gold mb-4 border-b border-xuan-border pb-2">
                一、信息收集
              </h2>
              <div className="space-y-3 text-sm text-xuan-silver font-chinese leading-relaxed">
                <p>
                  1.1 注册信息：当您注册易算平台账户时，我们会收集您提供的用户名、电子邮箱地址或手机号码，以及您设置的登录密码。上述信息是您使用基础服务所必需的，如拒绝提供则无法完成注册。
                </p>
                <p>
                  1.2 命理信息：当您使用八字排盘、紫微斗数、姓名学分析等功能时，我们需要收集您的出生日期（年月日时）、性别以及姓名等个人信息。这些信息是进行命理分析所必需的原始数据，我们仅在您主动使用时才会收集。
                </p>
                <p>
                  1.3 设备信息：为保障服务正常运行，我们会自动收集您的设备型号、操作系统版本、浏览器类型、IP地址、访问时间等日志信息。此类信息不包含个人敏感数据，仅用于改善服务体验和保障网络安全。
                </p>
                <p>
                  1.4 我们不会收集您的精确地理位置、通讯录、相册、麦克风等敏感权限信息。除非法律法规另有规定，我们不会请求超出必要范围的权限。
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="card-xuan-gold p-6 sm:p-8">
              <h2 className="text-lg sm:text-xl font-chinese font-bold text-xuan-gold mb-4 border-b border-xuan-border pb-2">
                二、信息使用
              </h2>
              <div className="space-y-3 text-sm text-xuan-silver font-chinese leading-relaxed">
                <p>
                  2.1 我们将收集的信息用于以下目的：（一）为您提供命理分析、排盘计算等核心功能服务；（二）优化和改进我们的算法模型，提升分析准确度；（三）发送与服务相关的通知，如账号安全提醒、功能更新等；（四）响应用户的客服请求和技术支持需求。
                </p>
                <p>
                  2.2 我们不会将您的个人信息用于任何自动化决策，包括但不限于信用评估、就业资格判定等对个人权益有重大影响的自动化处理。
                </p>
                <p>
                  2.3 我们保证不会将您的个人信息出售、出租或以其他形式提供给任何第三方用于其营销目的。在法律法规要求或为保护我们合法权益所必需的情况下，我们可能会依法披露有限的必要信息。
                </p>
                <p>
                  2.4 当我们要将信息用于本政策未载明的其他用途时，会事先征求您的明确同意。
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="card-xuan-gold p-6 sm:p-8">
              <h2 className="text-lg sm:text-xl font-chinese font-bold text-xuan-gold mb-4 border-b border-xuan-border pb-2">
                三、信息存储
              </h2>
              <div className="space-y-3 text-sm text-xuan-silver font-chinese leading-relaxed">
                <p>
                  3.1 我们在中华人民共和国境内收集和产生的个人信息，将存储于中华人民共和国境内的服务器中。我们使用专业的云服务提供商（部署于中国大陆境内）进行数据存储，确保数据传输和存储的安全。
                </p>
                <p>
                  3.2 我们仅在实现本政策所述目的所必需的最短期限内保留您的个人信息，除非法律法规有强制性的留存要求。当您注销账户后，我们将对您的个人信息进行删除或匿名化处理。
                </p>
                <p>
                  3.3 如因业务需要确需向境外传输数据的，我们将严格遵循《中华人民共和国个人信息保护法》的相关规定，在取得您的单独同意后进行，并采取必要的安全保护措施。
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="card-xuan-gold p-6 sm:p-8">
              <h2 className="text-lg sm:text-xl font-chinese font-bold text-xuan-gold mb-4 border-b border-xuan-border pb-2">
                四、信息安全
              </h2>
              <div className="space-y-3 text-sm text-xuan-silver font-chinese leading-relaxed">
                <p>
                  4.1 我们采用行业标准的安全技术和组织措施来保护您的个人信息，包括但不限于：传输层安全加密（TLS/SSL）、数据存储加密、访问控制、防火墙和入侵检测系统等。
                </p>
                <p>
                  4.2 我们建立了以数据为核心、围绕数据生命周期进行的数据安全管理体系，从组织建设、制度设计、人员管理、产品技术等多维度提升整体安全性。
                </p>
                <p>
                  4.3 我们会定期进行安全审计和漏洞扫描，及时修复发现的安全隐患。若不幸发生个人信息安全事件，我们将按照法律法规的要求，及时向您告知事件基本情况、可能造成的影响以及我们已采取或将要采取的处置措施。
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="card-xuan-gold p-6 sm:p-8">
              <h2 className="text-lg sm:text-xl font-chinese font-bold text-xuan-gold mb-4 border-b border-xuan-border pb-2">
                五、Cookie政策
              </h2>
              <div className="space-y-3 text-sm text-xuan-silver font-chinese leading-relaxed">
                <p>
                  5.1 我们使用Cookie和类似技术来保障服务的正常运行。Cookie是存储在您设备上的小型文本文件，用于记住您的登录状态、偏好设置等信息。
                </p>
                <p>
                  5.2 我们使用的Cookie类型包括：（一）必要Cookie：用于维持登录会话和保障服务安全，无法关闭；（二）偏好Cookie：用于记住您的界面语言和主题偏好；（三）分析Cookie：用于统计服务使用情况，帮助我们改进服务。
                </p>
                <p>
                  5.3 您可以通过浏览器设置管理或删除Cookie。但请注意，禁用必要Cookie可能导致部分功能无法正常使用。
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="card-xuan-gold p-6 sm:p-8">
              <h2 className="text-lg sm:text-xl font-chinese font-bold text-xuan-gold mb-4 border-b border-xuan-border pb-2">
                六、用户权利
              </h2>
              <div className="space-y-3 text-sm text-xuan-silver font-chinese leading-relaxed">
                <p>
                  根据《中华人民共和国个人信息保护法》，您享有以下权利：
                </p>
                <p>
                  6.1 查阅权：您有权查阅我们持有的您的个人信息，您可以在账户设置页面查看和下载您的个人数据。
                </p>
                <p>
                  6.2 更正权：如发现我们收集的个人信息有误，您有权要求更正。您可以在账户设置页面自行修改大部分个人信息。
                </p>
                <p>
                  6.3 删除权：在以下情形中，您有权要求删除个人信息：（一）处理目的已实现或无法实现；（二）我们停止提供服务；（三）您撤回同意；（四）我们违反法律法规处理您的信息。
                </p>
                <p>
                  6.4 注销权：您随时可以通过账户设置页面申请注销账户。账户注销后，我们将依法删除您的个人信息。
                </p>
                <p>
                  6.5 撤回同意权：您可以随时撤回对本隐私政策的同意。撤回同意不影响撤回前基于同意而进行的个人信息处理活动的效力。
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="card-xuan-gold p-6 sm:p-8">
              <h2 className="text-lg sm:text-xl font-chinese font-bold text-xuan-gold mb-4 border-b border-xuan-border pb-2">
                七、政策更新
              </h2>
              <div className="space-y-3 text-sm text-xuan-silver font-chinese leading-relaxed">
                <p>
                  7.1 我们可能会根据服务变更、法律法规调整等因素适时更新本隐私政策。更新后的版本将在本页面发布，并在发布时显著标注生效日期。
                </p>
                <p>
                  7.2 如涉及重大变更（包括但不限于收集信息范围扩大、使用目的变更等），我们将通过站内通知、弹窗提示或电子邮件等方式向您进行显著告知。
                </p>
                <p>
                  7.3 请您定期查阅本隐私政策，以了解最新的个人信息保护规则。如您继续使用我们的服务，即表示您同意接受修订后的隐私政策约束。
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <p className="text-sm text-xuan-muted font-chinese text-center card-xuan-gold p-6 sm:p-8">
                如对本隐私政策有任何疑问或建议，请通过【联系我们】页面列明的方式与我们取得联系。我们将在15个工作日内回复您的请求。
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
