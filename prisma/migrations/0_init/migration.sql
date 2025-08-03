-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."TenantStatus" AS ENUM ('active', 'inactive', 'maintenance');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('admin', 'user');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'user',
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" VARCHAR NOT NULL,
    "reset_password_token" VARCHAR,
    "reset_password_expiration" TIMESTAMPTZ(3),
    "salt" VARCHAR,
    "hash" VARCHAR,
    "login_attempts" DECIMAL DEFAULT 0,
    "lock_until" TIMESTAMPTZ(3),
    "is_super_admin" BOOLEAN DEFAULT false,
    "current_tenant_id" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tenants" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "slug" VARCHAR NOT NULL,
    "status" "public"."TenantStatus" NOT NULL DEFAULT 'active',
    "is_default" BOOLEAN DEFAULT false,
    "settings_domain" VARCHAR,
    "settings_theme_primary_color" VARCHAR DEFAULT '#0066ff',
    "settings_theme_logo_id" INTEGER,
    "settings_features_enable_news" BOOLEAN DEFAULT true,
    "settings_features_enable_reservation" BOOLEAN DEFAULT true,
    "settings_features_enable_analytics" BOOLEAN DEFAULT true,
    "settings_limits_max_users" DECIMAL DEFAULT 10,
    "settings_limits_max_articles" DECIMAL DEFAULT 1000,
    "contact_address" VARCHAR,
    "contact_phone" VARCHAR,
    "contact_email" VARCHAR,
    "contact_business_hours" VARCHAR,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."media" (
    "id" SERIAL NOT NULL,
    "alt" VARCHAR,
    "tenant_id" INTEGER,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" VARCHAR,
    "thumbnail_u_r_l" VARCHAR,
    "filename" VARCHAR,
    "mime_type" VARCHAR,
    "filesize" DECIMAL,
    "width" DECIMAL,
    "height" DECIMAL,
    "focal_x" DECIMAL,
    "focal_y" DECIMAL,
    "sizes_thumbnail_url" VARCHAR,
    "sizes_thumbnail_width" DECIMAL,
    "sizes_thumbnail_height" DECIMAL,
    "sizes_thumbnail_mime_type" VARCHAR,
    "sizes_thumbnail_filesize" DECIMAL,
    "sizes_thumbnail_filename" VARCHAR,
    "sizes_medium_url" VARCHAR,
    "sizes_medium_width" DECIMAL,
    "sizes_medium_height" DECIMAL,
    "sizes_medium_mime_type" VARCHAR,
    "sizes_medium_filesize" DECIMAL,
    "sizes_medium_filename" VARCHAR,
    "sizes_large_url" VARCHAR,
    "sizes_large_width" DECIMAL,
    "sizes_large_height" DECIMAL,
    "sizes_large_mime_type" VARCHAR,
    "sizes_large_filesize" DECIMAL,
    "sizes_large_filename" VARCHAR,
    "prefix" VARCHAR DEFAULT '.',

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users_sessions" (
    "_order" INTEGER NOT NULL,
    "_parent_id" INTEGER NOT NULL,
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(3),
    "expires_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "users_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tenants_domains" (
    "_order" INTEGER NOT NULL,
    "_parent_id" INTEGER NOT NULL,
    "id" VARCHAR NOT NULL,
    "url" VARCHAR NOT NULL,
    "is_active" BOOLEAN DEFAULT true,

    CONSTRAINT "tenants_domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users_rels" (
    "id" SERIAL NOT NULL,
    "order" INTEGER,
    "parent_id" INTEGER NOT NULL,
    "path" VARCHAR NOT NULL,
    "tenants_id" INTEGER,

    CONSTRAINT "users_rels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payload_locked_documents" (
    "id" SERIAL NOT NULL,
    "global_slug" VARCHAR,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payload_locked_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payload_locked_documents_rels" (
    "id" SERIAL NOT NULL,
    "order" INTEGER,
    "parent_id" INTEGER NOT NULL,
    "path" VARCHAR NOT NULL,
    "users_id" INTEGER,
    "tenants_id" INTEGER,
    "media_id" INTEGER,

    CONSTRAINT "payload_locked_documents_rels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payload_preferences" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR,
    "value" JSONB,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payload_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payload_preferences_rels" (
    "id" SERIAL NOT NULL,
    "order" INTEGER,
    "parent_id" INTEGER NOT NULL,
    "path" VARCHAR NOT NULL,
    "users_id" INTEGER,

    CONSTRAINT "payload_preferences_rels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payload_migrations" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "batch" DECIMAL,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payload_migrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_idx" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "public"."users"("created_at");

-- CreateIndex
CREATE INDEX "users_updated_at_idx" ON "public"."users"("updated_at");

-- CreateIndex
CREATE INDEX "users_current_tenant_idx" ON "public"."users"("current_tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_slug_idx" ON "public"."tenants"("slug");

-- CreateIndex
CREATE INDEX "tenants_created_at_idx" ON "public"."tenants"("created_at");

-- CreateIndex
CREATE INDEX "tenants_updated_at_idx" ON "public"."tenants"("updated_at");

-- CreateIndex
CREATE INDEX "tenants_settings_theme_settings_theme_logo_idx" ON "public"."tenants"("settings_theme_logo_id");

-- CreateIndex
CREATE UNIQUE INDEX "media_filename_idx" ON "public"."media"("filename");

-- CreateIndex
CREATE INDEX "media_created_at_idx" ON "public"."media"("created_at");

-- CreateIndex
CREATE INDEX "media_updated_at_idx" ON "public"."media"("updated_at");

-- CreateIndex
CREATE INDEX "media_tenant_idx" ON "public"."media"("tenant_id");

-- CreateIndex
CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "public"."media"("sizes_thumbnail_filename");

-- CreateIndex
CREATE INDEX "media_sizes_medium_sizes_medium_filename_idx" ON "public"."media"("sizes_medium_filename");

-- CreateIndex
CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "public"."media"("sizes_large_filename");

-- CreateIndex
CREATE INDEX "users_sessions_order_idx" ON "public"."users_sessions"("_order");

-- CreateIndex
CREATE INDEX "users_sessions_parent_id_idx" ON "public"."users_sessions"("_parent_id");

-- CreateIndex
CREATE INDEX "tenants_domains_order_idx" ON "public"."tenants_domains"("_order");

-- CreateIndex
CREATE INDEX "tenants_domains_parent_id_idx" ON "public"."tenants_domains"("_parent_id");

-- CreateIndex
CREATE INDEX "users_rels_path_idx" ON "public"."users_rels"("path");

-- CreateIndex
CREATE INDEX "users_rels_parent_idx" ON "public"."users_rels"("parent_id");

-- CreateIndex
CREATE INDEX "users_rels_order_idx" ON "public"."users_rels"("order");

-- CreateIndex
CREATE INDEX "users_rels_tenants_id_idx" ON "public"."users_rels"("tenants_id");

-- CreateIndex
CREATE INDEX "payload_locked_documents_created_at_idx" ON "public"."payload_locked_documents"("created_at");

-- CreateIndex
CREATE INDEX "payload_locked_documents_global_slug_idx" ON "public"."payload_locked_documents"("global_slug");

-- CreateIndex
CREATE INDEX "payload_locked_documents_updated_at_idx" ON "public"."payload_locked_documents"("updated_at");

-- CreateIndex
CREATE INDEX "payload_locked_documents_rels_path_idx" ON "public"."payload_locked_documents_rels"("path");

-- CreateIndex
CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "public"."payload_locked_documents_rels"("parent_id");

-- CreateIndex
CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "public"."payload_locked_documents_rels"("users_id");

-- CreateIndex
CREATE INDEX "payload_locked_documents_rels_tenants_id_idx" ON "public"."payload_locked_documents_rels"("tenants_id");

-- CreateIndex
CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "public"."payload_locked_documents_rels"("media_id");

-- CreateIndex
CREATE INDEX "payload_locked_documents_rels_order_idx" ON "public"."payload_locked_documents_rels"("order");

-- CreateIndex
CREATE INDEX "payload_preferences_created_at_idx" ON "public"."payload_preferences"("created_at");

-- CreateIndex
CREATE INDEX "payload_preferences_key_idx" ON "public"."payload_preferences"("key");

-- CreateIndex
CREATE INDEX "payload_preferences_updated_at_idx" ON "public"."payload_preferences"("updated_at");

-- CreateIndex
CREATE INDEX "payload_preferences_rels_path_idx" ON "public"."payload_preferences_rels"("path");

-- CreateIndex
CREATE INDEX "payload_preferences_rels_parent_idx" ON "public"."payload_preferences_rels"("parent_id");

-- CreateIndex
CREATE INDEX "payload_preferences_rels_users_id_idx" ON "public"."payload_preferences_rels"("users_id");

-- CreateIndex
CREATE INDEX "payload_preferences_rels_order_idx" ON "public"."payload_preferences_rels"("order");

-- CreateIndex
CREATE INDEX "payload_migrations_created_at_idx" ON "public"."payload_migrations"("created_at");

-- CreateIndex
CREATE INDEX "payload_migrations_updated_at_idx" ON "public"."payload_migrations"("updated_at");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_current_tenant_id_tenants_id_fk" FOREIGN KEY ("current_tenant_id") REFERENCES "public"."tenants"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."tenants" ADD CONSTRAINT "tenants_settings_theme_logo_id_media_id_fk" FOREIGN KEY ("settings_theme_logo_id") REFERENCES "public"."media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."media" ADD CONSTRAINT "media_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."tenants_domains" ADD CONSTRAINT "tenants_domains_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."users_rels" ADD CONSTRAINT "users_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."users_rels" ADD CONSTRAINT "users_rels_tenants_fk" FOREIGN KEY ("tenants_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tenants_fk" FOREIGN KEY ("tenants_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

