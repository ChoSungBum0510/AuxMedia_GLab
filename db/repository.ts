import { and, desc, eq, sql } from "drizzle-orm";
import { getDb, getRawDb } from ".";
import { applications, courses, notices, reviews } from "./schema";
import {
  fallbackNotices,
  fallbackReviews,
  legacyCourseSlugs,
  legacyNoticeTitles,
  legacyReviewTitles,
  seedCourses,
} from "../lib/content";

let initialization: Promise<void> | null = null;
const CONTENT_VERSION = "2026-07-22-course-platform-v1";

export async function ensureDatabase() {
  initialization ??= initializeDatabase().catch((error) => {
    initialization = null;
    throw error;
  });
  return initialization;
}

async function initializeDatabase() {
  const d1 = getRawDb();
  await d1.batch([
    d1.prepare(`CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      region TEXT NOT NULL,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      category TEXT NOT NULL,
      audience TEXT NOT NULL,
      format TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'planned',
      application_start TEXT NOT NULL,
      application_end TEXT NOT NULL,
      course_start TEXT NOT NULL,
      course_end TEXT NOT NULL,
      capacity INTEGER NOT NULL DEFAULT 20,
      location TEXT NOT NULL,
      platform_url TEXT NOT NULL DEFAULT '',
      curriculum TEXT NOT NULL DEFAULT '[]',
      outcomes TEXT NOT NULL DEFAULT '[]',
      published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`),
    d1.prepare("CREATE INDEX IF NOT EXISTS courses_region_idx ON courses(region)"),
    d1.prepare(`CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_slug TEXT NOT NULL,
      region TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      motivation TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'received',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`),
    d1.prepare("CREATE INDEX IF NOT EXISTS applications_email_idx ON applications(email)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS applications_course_idx ON applications(course_slug)"),
    d1.prepare(`CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_slug TEXT NOT NULL,
      region TEXT NOT NULL,
      author TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT '수강생',
      rating INTEGER NOT NULL DEFAULT 5,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      published INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`),
    d1.prepare("CREATE INDEX IF NOT EXISTS reviews_published_idx ON reviews(published)"),
    d1.prepare(`CREATE TABLE IF NOT EXISTS notices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT '공지',
      content TEXT NOT NULL,
      published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`),
    d1.prepare("CREATE INDEX IF NOT EXISTS notices_published_idx ON notices(published)"),
    d1.prepare(`CREATE TABLE IF NOT EXISTS login_attempts (
      attempt_key TEXT PRIMARY KEY NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 0,
      window_started_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )`),
    d1.prepare("CREATE INDEX IF NOT EXISTS login_attempts_updated_idx ON login_attempts(updated_at)"),
    d1.prepare(`CREATE TABLE IF NOT EXISTS content_metadata (
      metadata_key TEXT PRIMARY KEY NOT NULL,
      metadata_value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`),
  ]);

  const courseColumns = await d1.prepare("PRAGMA table_info(courses)").all<{ name: string }>();
  if (!courseColumns.results.some((column) => column.name === "platform_url")) {
    await d1.prepare("ALTER TABLE courses ADD COLUMN platform_url TEXT NOT NULL DEFAULT ''").run();
  }

  const contentVersion = await d1
    .prepare("SELECT metadata_value AS value FROM content_metadata WHERE metadata_key = 'content_version'")
    .first<{ value: string }>();
  if (contentVersion?.value !== CONTENT_VERSION) {
    await migrateToCurrentContent();
  }

  const row = await d1.prepare("SELECT COUNT(*) AS count FROM courses").first<{ count: number }>();
  if ((row?.count ?? 0) === 0) {
    await d1.batch(
      seedCourses.map((course) =>
        d1
          .prepare(`INSERT INTO courses (
            slug, region, title, summary, category, audience, format, status,
            application_start, application_end, course_start, course_end,
            capacity, location, platform_url, curriculum, outcomes, published
          ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18)`)
          .bind(
            course.slug,
            course.region,
            course.title,
            course.summary,
            course.category,
            course.audience,
            course.format,
            course.status,
            course.applicationStart,
            course.applicationEnd,
            course.courseStart,
            course.courseEnd,
            course.capacity,
            course.location,
            course.platformUrl ?? "",
            JSON.stringify(course.curriculum),
            JSON.stringify(course.outcomes),
            course.published ? 1 : 0,
          ),
      ),
    );
  }

  const reviewCount = await d1.prepare("SELECT COUNT(*) AS count FROM reviews").first<{ count: number }>();
  if ((reviewCount?.count ?? 0) === 0) {
    await d1.batch(
      fallbackReviews.map((review) =>
        d1
          .prepare(`INSERT INTO reviews (
            course_slug, region, author, role, rating, title, content, published, created_at
          ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)`)
          .bind(
            review.courseSlug,
            review.region,
            review.author,
            review.role,
            review.rating,
            review.title,
            review.content,
            1,
            review.createdAt,
          ),
      ),
    );
  }

  const noticeCount = await d1.prepare("SELECT COUNT(*) AS count FROM notices").first<{ count: number }>();
  if ((noticeCount?.count ?? 0) === 0) {
    await d1.batch(
      fallbackNotices.map((notice) =>
        d1
          .prepare(`INSERT INTO notices (
            title, category, content, published, created_at
          ) VALUES (?1, ?2, ?3, ?4, ?5)`)
          .bind(
            notice.title,
            notice.category,
            notice.content,
            notice.published ? 1 : 0,
            notice.createdAt,
          ),
      ),
    );
  }
}

async function migrateToCurrentContent() {
  const d1 = getRawDb();
  const statements = [];

  for (const slug of legacyCourseSlugs) {
    statements.push(d1.prepare("UPDATE courses SET published = 0, updated_at = CURRENT_TIMESTAMP WHERE slug = ?1").bind(slug));
    statements.push(
      d1
        .prepare("DELETE FROM courses WHERE slug = ?1 AND NOT EXISTS (SELECT 1 FROM applications WHERE applications.course_slug = courses.slug)")
        .bind(slug),
    );
  }

  for (const course of seedCourses) {
    statements.push(
      d1
        .prepare(`INSERT INTO courses (
          slug, region, title, summary, category, audience, format, status,
          application_start, application_end, course_start, course_end,
          capacity, location, platform_url, curriculum, outcomes, published
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18)
        ON CONFLICT(slug) DO UPDATE SET
          region = excluded.region,
          title = excluded.title,
          summary = excluded.summary,
          category = excluded.category,
          audience = excluded.audience,
          format = excluded.format,
          status = excluded.status,
          application_start = excluded.application_start,
          application_end = excluded.application_end,
          course_start = excluded.course_start,
          course_end = excluded.course_end,
          capacity = excluded.capacity,
          location = excluded.location,
          platform_url = excluded.platform_url,
          curriculum = excluded.curriculum,
          outcomes = excluded.outcomes,
          published = excluded.published,
          updated_at = CURRENT_TIMESTAMP`)
        .bind(
          course.slug,
          course.region,
          course.title,
          course.summary,
          course.category,
          course.audience,
          course.format,
          course.status,
          course.applicationStart,
          course.applicationEnd,
          course.courseStart,
          course.courseEnd,
          course.capacity,
          course.location,
          course.platformUrl ?? "",
          JSON.stringify(course.curriculum),
          JSON.stringify(course.outcomes),
          course.published ? 1 : 0,
        ),
    );
  }

  for (const title of legacyReviewTitles) {
    statements.push(d1.prepare("DELETE FROM reviews WHERE title = ?1").bind(title));
  }
  for (const review of fallbackReviews) {
    statements.push(
      d1
        .prepare(`UPDATE reviews SET
          course_slug = ?1,
          region = ?2,
          role = ?4,
          rating = ?5,
          content = ?7,
          published = ?8
        WHERE title = ?6 AND author = ?3`)
        .bind(
          review.courseSlug,
          review.region,
          review.author,
          review.role,
          review.rating,
          review.title,
          review.content,
          review.published ? 1 : 0,
        ),
    );
    statements.push(
      d1
        .prepare(`INSERT INTO reviews (
          course_slug, region, author, role, rating, title, content, published, created_at
        ) SELECT ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9
        WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE title = ?6 AND author = ?3)`)
        .bind(
          review.courseSlug,
          review.region,
          review.author,
          review.role,
          review.rating,
          review.title,
          review.content,
          review.published ? 1 : 0,
          review.createdAt,
        ),
    );
  }

  for (const title of legacyNoticeTitles) {
    statements.push(d1.prepare("DELETE FROM notices WHERE title = ?1").bind(title));
  }
  for (const notice of fallbackNotices) {
    statements.push(
      d1
        .prepare(`UPDATE notices SET category = ?2, content = ?3, published = ?4
          WHERE title = ?1`)
        .bind(
          notice.title,
          notice.category,
          notice.content,
          notice.published ? 1 : 0,
        ),
    );
    statements.push(
      d1
        .prepare(`INSERT INTO notices (title, category, content, published, created_at)
          SELECT ?1, ?2, ?3, ?4, ?5
          WHERE NOT EXISTS (SELECT 1 FROM notices WHERE title = ?1)`)
        .bind(
          notice.title,
          notice.category,
          notice.content,
          notice.published ? 1 : 0,
          notice.createdAt,
        ),
    );
  }

  statements.push(
    d1
      .prepare(`INSERT INTO content_metadata (metadata_key, metadata_value, updated_at)
        VALUES ('content_version', ?1, CURRENT_TIMESTAMP)
        ON CONFLICT(metadata_key) DO UPDATE SET metadata_value = excluded.metadata_value, updated_at = CURRENT_TIMESTAMP`)
      .bind(CONTENT_VERSION),
  );

  await d1.batch(statements);
}

export async function listCourses(options?: { region?: string; includeHidden?: boolean }) {
  await ensureDatabase();
  const db = getDb();
  const filters = [];
  if (options?.region) filters.push(eq(courses.region, options.region));
  if (!options?.includeHidden) filters.push(eq(courses.published, true));

  return db
    .select()
    .from(courses)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(
      sql`CASE ${courses.status} WHEN 'open' THEN 0 WHEN 'planned' THEN 1 ELSE 2 END`,
      courses.courseStart,
      courses.id,
    );
}

export async function getCourse(slug: string) {
  await ensureDatabase();
  const db = getDb();
  const rows = await db
    .select()
    .from(courses)
    .where(and(eq(courses.slug, slug), eq(courses.published, true)))
    .limit(1);
  return rows[0] ?? null;
}

export async function listPublishedReviews() {
  await ensureDatabase();
  return getDb()
    .select()
    .from(reviews)
    .where(eq(reviews.published, true))
    .orderBy(desc(reviews.createdAt))
    .limit(20);
}

export async function listApplicationsForEmail(email: string) {
  await ensureDatabase();
  return getDb()
    .select()
    .from(applications)
    .where(eq(applications.email, email))
    .orderBy(desc(applications.createdAt));
}

export async function findApplicantIdentity(email: string, phone: string) {
  await ensureDatabase();
  const normalizedPhone = phone.replace(/\D/gu, "");
  const rows = await getDb()
    .select({ name: applications.name, email: applications.email, phone: applications.phone })
    .from(applications)
    .where(eq(applications.email, email.toLowerCase()))
    .orderBy(desc(applications.createdAt))
    .limit(30);
  return rows.find((row) => row.phone.replace(/\D/gu, "") === normalizedPhone) ?? null;
}

export async function listAllApplications() {
  await ensureDatabase();
  return getDb().select().from(applications).orderBy(desc(applications.createdAt)).limit(200);
}

export async function listPublishedNotices() {
  await ensureDatabase();
  return getDb()
    .select()
    .from(notices)
    .where(eq(notices.published, true))
    .orderBy(desc(notices.createdAt), desc(notices.id))
    .limit(100);
}

export async function getPublishedNotice(id: number) {
  await ensureDatabase();
  const rows = await getDb()
    .select()
    .from(notices)
    .where(and(eq(notices.id, id), eq(notices.published, true)))
    .limit(1);
  return rows[0] ?? null;
}

export async function listAllNotices() {
  await ensureDatabase();
  return getDb().select().from(notices).orderBy(desc(notices.createdAt), desc(notices.id)).limit(200);
}
