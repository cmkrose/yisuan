const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...\n');

  const existing = await prisma.user.count();
  if (existing > 0) { console.log(`Already has ${existing} users, skipping seed.`); return; }

  const bcrypt = require('bcryptjs');
  const hash = bcrypt.hashSync('yisuan123', 10);

  // Admin
  await prisma.user.create({
    data: { email: 'admin@yisuan.com', phone: '13800000000', password: hash, nickname: '易算管理员', status: 'active' },
  });
  console.log('[OK] Admin user created');

  // Demo users
  const names = ['张明远', '李婉清', '王浩然', '陈晓琳', '刘志强', '赵雅琪', '周建平', '吴思雨'];
  const genders = ['male', 'female', 'male', 'female', 'male', 'female', 'male', 'female'];
  const places = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '南京'];

  for (let i = 0; i < names.length; i++) {
    const u = await prisma.user.create({
      data: { email: `user${i + 1}@example.com`, phone: `1380000000${i + 1}`, password: hash, nickname: names[i], status: 'active',
        createdAt: new Date(Date.now() - (i + 1) * 3 * 86400000) },
    });
    await prisma.userProfile.create({
      data: { userId: u.id, realName: names[i], gender: genders[i],
        birthDate: new Date(1990 + (i % 15), i % 12, (i % 28) + 1),
        birthTime: `${(i * 2) % 24}:00`, birthPlace: places[i] },
    });
  }
  console.log(`[OK] ${names.length} demo users`);

  // Charts & analyses
  const users = await prisma.user.findMany();
  const types = ['bazi', 'ziwei', 'name', 'fengshui', 'divination', 'zeri'];
  let cc = 0, ac = 0;

  for (const user of users) {
    const n = Math.floor(Math.random() * 4) + 2;
    for (let j = 0; j < n; j++) {
      const ct = types[(cc + j) % types.length];
      const ch = await prisma.chart.create({
        data: { userId: user.id, chartType: ct, title: `${user.nickname}的${ct}`, inputData: '{}', chartData: '{}',
          createdAt: new Date(Date.now() - Math.random() * 30 * 86400000) },
      });
      cc++;
      if (Math.random() > 0.3) {
        await prisma.analysisRecord.create({
          data: { userId: user.id, chartId: ch.id, analysisType: ct, inputData: '{}', resultData: '{}',
            createdAt: new Date(ch.createdAt.getTime() + 60000) },
        });
        ac++;
      }
    }
  }
  console.log(`[OK] ${cc} charts, ${ac} analyses`);

  // Feedback
  const fbs = [
    { type: '建议', content: '希望增加每日运势推送功能' },
    { type: '问题', content: '八字排盘手机端排版需要优化' },
    { type: '建议', content: '知识库内容很好，希望增加风水知识' },
    { type: '建议', content: '能不能增加合婚功能？' },
    { type: '问题', content: 'AI分析有时候不太准确' },
    { type: '建议', content: '紫微盘很好看，希望能导出图片' },
  ];
  for (const fb of fbs) {
    await prisma.feedback.create({ data: { userId: users[Math.floor(Math.random() * users.length)].id, feedbackType: fb.type, content: fb.content, createdAt: new Date(Date.now() - Math.random() * 7 * 86400000) } });
  }
  console.log(`[OK] ${fbs.length} feedbacks\n`);
  console.log('Seed complete! Admin password: yisuan123');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
