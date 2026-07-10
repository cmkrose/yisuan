-- ============================================
-- 易算 数据库优化脚本 (PostgreSQL 16+)
-- ============================================

-- 1. 连接池配置 (在 postgresql.conf 中)
-- max_connections = 200
-- shared_buffers = 4GB (建议物理内存的25%)
-- effective_cache_size = 12GB (建议物理内存的75%)
-- work_mem = 64MB
-- maintenance_work_mem = 512MB
-- wal_buffers = 64MB

-- 2. 补充性能索引
CREATE INDEX IF NOT EXISTS idx_charts_user_type_created
    ON charts (user_id, chart_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analyses_user_type_created
    ON analyses (user_id, analysis_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_hanzi_library_wuxing_strokes
    ON hanzi_library (wuxing, kangxi_strokes);

CREATE INDEX IF NOT EXISTS idx_hanzi_library_surname
    ON hanzi_library (is_surname) WHERE is_surname = true;

CREATE INDEX IF NOT EXISTS idx_analysis_records_type_date
    ON analysis_records (analysis_type, created_at DESC);

-- 3. 部分索引（仅活跃用户）
CREATE INDEX IF NOT EXISTS idx_users_active
    ON users (email) WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_users_created_active
    ON users (created_at) WHERE status = 'active';

-- 4. 分析表定期清理任务（保留90天）
-- 建议设置 cron 任务: 每周日凌晨3点执行
-- DELETE FROM analysis_records WHERE created_at < NOW() - INTERVAL '90 days' AND user_id IS NULL;
-- DELETE FROM charts WHERE created_at < NOW() - INTERVAL '365 days' AND user_id IS NULL AND is_public = false;

-- 5. 表统计信息更新
ANALYZE users;
ANALYZE user_profiles;
ANALYZE charts;
ANALYZE analysis_records;
ANALYZE hanzi_library;

-- 6. 慢查询日志配置 (postgresql.conf)
-- log_min_duration_statement = 200     # 记录超过200ms的查询
-- log_checkpoints = on
-- log_connections = on
-- log_disconnections = on
