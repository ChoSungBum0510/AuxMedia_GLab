import { and, desc, eq } from "drizzle-orm";
import { getDb, getRawDb } from ".";
import { applications, courses, notices, reviews } from "./schema";
import { fallbackNotices, fallbackReviews, seedCourses } from "../lib/content";

let initialization: Promise<void> | null = null;

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
  ]);

  const row = await d1.prepare("SELECT COUNT(*) AS count FROM courses").first<{ count: number }>();
  if ((row?.count ?? 0) === 0) {
    await d1.batch(
      seedCourses.map((course) =>
        d1
          .prepare(`INSERT INTO courses (
            slug, region, title, summary, category, audience, format, status,
            application_start, application_end, course_start, course_end,
            capacity, location, curriculum, outcomes, published
          ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17)`)
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
    .orderBy(courses.applicationEnd, courses.id);
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
