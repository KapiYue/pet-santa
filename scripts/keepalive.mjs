/**
 * 连一次数据库，防止 Supabase 免费实例休眠。
 *
 * Supabase 免费项目在数据库连续无活动后会被暂停，整个应用随之下线，
 * 期间进来的 webhook 会被静默丢弃。所以由 GitHub Actions 定时跑这个脚本。
 *
 *   pnpm keepalive
 */
import postgres from "postgres";

// 本地跑时把 .env.local 读进 process.env；CI 里没有这些文件，dotenv 会静默跳过。
try {
  const dotenv = await import("dotenv");
  dotenv.config({ path: ".env.local" });
  dotenv.config();
} catch {
  // dotenv 是 devDependency，生产环境装不上也无所谓，CI 用的是 secrets
}

const url = process.env.DATABASE_URL;
if (!url) {
  // 这里必须大声失败：静默跳过正是数据库被暂停却没人发现的原因
  console.error("DATABASE_URL is not configured");
  process.exit(1);
}

// prepare: false —— Supabase 的连接池是 transaction 模式，不支持预处理语句
// max: 1 —— 一次性脚本，一条连接足够
const sql = postgres(url, { prepare: false, max: 1, idle_timeout: 5, connect_timeout: 15 });

try {
  // 最轻的一次真实查询：不读表、不写入，只让 Supabase 记录到这次数据库活动
  const [{ now }] = await sql`select now() as now`;
  console.log("Database keepalive ok:", now.toISOString());
  await sql.end({ timeout: 5 });
  process.exit(0);
} catch (error) {
  console.error("Database keepalive failed:", error);
  await sql.end({ timeout: 5 }).catch(() => {});
  process.exit(1);
}
