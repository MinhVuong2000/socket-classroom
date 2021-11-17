/*
 Navicat Premium Data Transfer

 Source Server         : classroom
 Source Server Type    : PostgreSQL
 Source Server Version : 140000
 Source Host           : localhost:5432
 Source Catalog        : classroom
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 140000
 File Encoding         : 65001

 Date: 17/11/2021 08:30:55
*/


-- ----------------------------
-- Sequence structure for Classes_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."Classes_id_seq";
CREATE SEQUENCE "public"."Classes_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 6
CACHE 1;
ALTER SEQUENCE "public"."Classes_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for Users_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."Users_id_seq";
CREATE SEQUENCE "public"."Users_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;
ALTER SEQUENCE "public"."Users_id_seq" OWNER TO "postgres";

-- ----------------------------
-- Table structure for Class_User
-- ----------------------------
DROP TABLE IF EXISTS "public"."Class_User";
CREATE TABLE "public"."Class_User" (
  "id_class" int4 NOT NULL,
  "id_user" int4 NOT NULL,
  "is_teacher" bool NOT NULL,
  "mark" int4
)
;
ALTER TABLE "public"."Class_User" OWNER TO "postgres";

-- ----------------------------
-- Records of Class_User
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for Classes
-- ----------------------------
DROP TABLE IF EXISTS "public"."Classes";
CREATE TABLE "public"."Classes" (
  "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 6
),
  "class_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "description" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "id_admin" int4 NOT NULL,
  "invitation_link" varchar(255) COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."Classes" OWNER TO "postgres";

-- ----------------------------
-- Records of Classes
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for Users
-- ----------------------------
DROP TABLE IF EXISTS "public"."Users";
CREATE TABLE "public"."Users" (
  "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
),
  "full_name" varchar(255) COLLATE "pg_catalog"."default",
  "username" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "password" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "id_uni" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "adress" varchar(255) COLLATE "pg_catalog"."default",
  "email" varchar(255) COLLATE "pg_catalog"."default",
  "phone" int4
)
;
ALTER TABLE "public"."Users" OWNER TO "postgres";

-- ----------------------------
-- Records of Users
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."Classes_id_seq"
OWNED BY "public"."Classes"."id";
SELECT setval('"public"."Classes_id_seq"', 11, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."Users_id_seq"
OWNED BY "public"."Users"."id";
SELECT setval('"public"."Users_id_seq"', 2, false);

-- ----------------------------
-- Checks structure for table Class_User
-- ----------------------------
ALTER TABLE "public"."Class_User" ADD CONSTRAINT "VALID_MARK" CHECK (mark >= 0 AND mark <= 10);

-- ----------------------------
-- Primary Key structure for table Class_User
-- ----------------------------
ALTER TABLE "public"."Class_User" ADD CONSTRAINT "Class_User_pkey" PRIMARY KEY ("id_class", "id_user");

-- ----------------------------
-- Uniques structure for table Classes
-- ----------------------------
ALTER TABLE "public"."Classes" ADD CONSTRAINT "CLASS_NAME" UNIQUE ("class_name");

-- ----------------------------
-- Primary Key structure for table Classes
-- ----------------------------
ALTER TABLE "public"."Classes" ADD CONSTRAINT "Classes_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table Users
-- ----------------------------
ALTER TABLE "public"."Users" ADD CONSTRAINT "ID_UNI" UNIQUE ("id_uni");
ALTER TABLE "public"."Users" ADD CONSTRAINT "USERNAME" UNIQUE ("username");

-- ----------------------------
-- Primary Key structure for table Users
-- ----------------------------
ALTER TABLE "public"."Users" ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table Class_User
-- ----------------------------
ALTER TABLE "public"."Class_User" ADD CONSTRAINT "ID_CLASS_CLASSUSERCLASS" FOREIGN KEY ("id_class") REFERENCES "public"."Classes" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."Class_User" ADD CONSTRAINT "ID_USER_CLASSUSERUSER" FOREIGN KEY ("id_user") REFERENCES "public"."Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table Classes
-- ----------------------------
ALTER TABLE "public"."Classes" ADD CONSTRAINT "ADMIN_CLASSUSER" FOREIGN KEY ("id_admin") REFERENCES "public"."Users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
