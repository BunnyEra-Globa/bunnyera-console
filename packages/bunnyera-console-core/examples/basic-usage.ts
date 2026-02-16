/**
 * BunnyEra Console Core 基本使用示例
 */

import {
  BunnyEraCore,
  projectCenter,
  resourceCenter,
  aiHub,
  logCenter,
  userCenter,
} from "../src";

async function main() {
  console.log("=== BunnyEra Console Core 示例 ===\n");

  // ========== 方式1: 使用统一核心类 ==========
  const core = new BunnyEraCore();
  await core.initialize();

  // ========== 方式2: 使用独立中心 ==========

  // --- ProjectCenter 示例 ---
  console.log("📁 项目中心示例:");

  // 获取所有项目
  const projects = await projectCenter.listProjects();
  console.log(`共有 ${projects.length} 个项目`);

  // 获取健康项目
  const healthyProjects = await projectCenter.listProjects({
    status: "healthy",
  });
  console.log(`健康项目: ${healthyProjects.length} 个`);

  // 获取健康度摘要
  const healthSummary = await projectCenter.getProjectHealthSummary();
  console.log(
    `项目健康度: ${healthSummary.healthRate}% (总: ${healthSummary.total}, 健康: ${healthSummary.healthy}, 警告: ${healthSummary.warning}, 错误: ${healthSummary.error})`
  );

  // 搜索项目
  const searchResults = await projectCenter.searchProjects({
    query: "bunnyera",
    includeDescription: true,
  });
  console.log(`搜索 "bunnyera" 找到 ${searchResults.length} 个项目\n`);

  // --- ResourceCenter 示例 ---
  console.log("📦 资源中心示例:");

  // 获取资源统计
  const resourceStats = await resourceCenter.getResourceStats();
  console.log(
    `资源统计: 总计 ${resourceStats.total}, 文件: ${resourceStats.byType.file}, 图片: ${resourceStats.byType.image}`
  );

  // 获取即将过期的资源
  const expiringResources = await resourceCenter.getExpiringResources();
  console.log(`即将过期的资源: ${expiringResources.length} 个`);

  // 按类型获取资源
  const images = await resourceCenter.listResources({ type: "image" });
  console.log(`图片资源: ${images.length} 个\n`);

  // --- AIHub 示例 ---
  console.log("🤖 AI 中心示例:");

  // 获取代理列表
  const agents = await aiHub.listAgents();
  console.log(`可用代理: ${agents.map((a) => a.name).join(", ")}`);

  // 创建会话
  const session = await aiHub.createChatSession("测试会话", "agent_001");
  console.log(`创建会话: ${session.title} (${session.id})`);

  // 发送消息
  console.log("发送消息: 你好！");
  const response = await aiHub.sendMessage(session.id, "你好！");
  const responseText = typeof response.content === "string" 
    ? response.content 
    : JSON.stringify(response.content);
  console.log(`AI 回复: ${responseText.substring(0, 50)}...\n`);

  // --- LogCenter 示例 ---
  console.log("📝 日志中心示例:");

  // 记录日志
  await logCenter.logInfo("system", "示例程序运行中");
  await logCenter.logWarn("api", "响应时间较慢", { duration: 2500 });

  // 获取日志统计
  const logStats = await logCenter.getLogStats();
  console.log(
    `日志统计: 总计 ${logStats.total}, 错误率: ${logStats.errorRate}%`
  );

  // 获取最近错误
  const recentErrors = await logCenter.getRecentErrors(5);
  console.log(`最近错误: ${recentErrors.length} 条\n`);

  // --- UserCenter 示例 ---
  console.log("👤 用户中心示例:");

  // 设置当前用户
  userCenter.setCurrentUserId("user_001");

  // 获取当前用户
  const currentUser = await userCenter.getCurrentUser();
  console.log(`当前用户: ${currentUser?.name} (${currentUser?.email})`);
  console.log(`角色: ${currentUser?.role}`);

  // 检查权限
  const canDeleteProject = userCenter.hasPermission(
    currentUser!,
    "project:delete"
  );
  console.log(`是否有删除项目权限: ${canDeleteProject}`);

  // 获取所有用户
  const users = await userCenter.listUsers();
  console.log(`系统用户总数: ${users.length}`);

  // 获取用户统计
  const userStats = await userCenter.getUserStats();
  console.log(
    `用户统计: 总计 ${userStats.total}, 所有者: ${userStats.byRole.owner}, 管理员: ${userStats.byRole.admin}, 成员: ${userStats.byRole.member}\n`
  );

  // --- 系统健康检查 ---
  console.log("🏥 系统健康检查:");
  const health = await core.getHealthStatus();
  console.log(`系统状态: ${health.status}`);
  console.log(`模块状态:`, health.modules);

  console.log("\n=== 示例完成 ===");
}

// 运行示例
main().catch(console.error);
