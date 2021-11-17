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

 Date: 17/11/2021 20:57:51
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
INSERT INTO "public"."Class_User" VALUES (12, 2, 't', NULL);
INSERT INTO "public"."Class_User" VALUES (12, 3, 'f', NULL);
INSERT INTO "public"."Class_User" VALUES (12, 4, 'f', NULL);
INSERT INTO "public"."Class_User" VALUES (13, 3, 't', NULL);
INSERT INTO "public"."Class_User" VALUES (13, 2, 'f', NULL);
INSERT INTO "public"."Class_User" VALUES (14, 4, 't', NULL);
INSERT INTO "public"."Class_User" VALUES (14, 3, 'f', NULL);
INSERT INTO "public"."Class_User" VALUES (14, 6, 'f', NULL);
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
INSERT INTO "public"."Classes" OVERRIDING SYSTEM VALUE VALUES (12, 'PTUDW', 'Môn học cơ bản về back end', 2, NULL);
INSERT INTO "public"."Classes" OVERRIDING SYSTEM VALUE VALUES (13, 'PTUDWNC', 'Học cách phát triển front end', 3, NULL);
INSERT INTO "public"."Classes" OVERRIDING SYSTEM VALUE VALUES (14, 'PTUDDD', 'Xây dựng ứng dụng cho thiết bị di động', 4, NULL);
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
INSERT INTO "public"."Users" OVERRIDING SYSTEM VALUE VALUES (2, 'Nguyễn Văn A', 'a_nguyenvan', '123', '123', NULL, NULL, NULL);
INSERT INTO "public"."Users" OVERRIDING SYSTEM VALUE VALUES (3, 'Võ Xuân Đức Thắng', 'thang_123', '123', '124', NULL, NULL, NULL);
INSERT INTO "public"."Users" OVERRIDING SYSTEM VALUE VALUES (4, 'Nguyễn Thị Minh Vượng', 'vuong_321', '123', '321', NULL, NULL, NULL);
INSERT INTO "public"."Users" OVERRIDING SYSTEM VALUE VALUES (6, 'Lê Thị Tuyết Trinh', 'trinh_312', '123', '312', NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."Classes_id_seq"
OWNED BY "public"."Classes"."id";
SELECT setval('"public"."Classes_id_seq"', 15, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."Users_id_seq"
OWNED BY "public"."Users"."id";
SELECT setval('"public"."Users_id_seq"', 7, true);

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
