DROP TABLE IF EXISTS class_user;
CREATE TABLE class_user (
  "id_class" int4 NOT NULL,
  "id_user" int4 NOT NULL,
  "is_teacher" bool NOT NULL,
  "mark" int4
)
;


-- ----------------------------
-- Records of Class_User
-- ----------------------------
BEGIN;
INSERT INTO class_user VALUES (1, 1, 't', NULL);
INSERT INTO class_user VALUES (1, 2, 'f', NULL);
INSERT INTO class_user VALUES (1, 3, 'f', NULL);
INSERT INTO class_user VALUES (2, 2, 't', NULL);
INSERT INTO class_user VALUES (2, 1, 'f', NULL);
INSERT INTO class_user VALUES (3, 3, 't', NULL);
INSERT INTO class_user VALUES (3, 2, 'f', NULL);
INSERT INTO class_user VALUES (3, 4, 'f', NULL);
COMMIT;

-- ----------------------------
-- Table structure for Classes
-- ----------------------------
DROP TABLE IF EXISTS classes;
CREATE TABLE classes (
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

-- ----------------------------
-- Records of Classes
-- ----------------------------
BEGIN;
INSERT INTO classes OVERRIDING SYSTEM VALUE VALUES (1, 'PTUDW', 'Môn học cơ bản về back end', 2, NULL);
INSERT INTO classes OVERRIDING SYSTEM VALUE VALUES (2, 'PTUDWNC', 'Học cách phát triển front end', 3, NULL);
INSERT INTO classes OVERRIDING SYSTEM VALUE VALUES (3, 'PTUDDD', 'Xây dựng ứng dụng cho thiết bị di động', 4, NULL);
COMMIT;

-- ----------------------------
-- Table structure for Users
-- ----------------------------
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 5
),
  "full_name" varchar(255),
  "username" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "password" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "id_uni" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "address" varchar(255),
  "email" varchar(255),
  "phone" varchar(50),
	"otp" int4
)
;

-- ----------------------------
-- Records of Users
-- ----------------------------
BEGIN;
INSERT INTO users OVERRIDING SYSTEM VALUE VALUES (1, 'Nguyễn Văn A', 'a_nguyenvan', '123', '123', NULL, NULL, NULL);
INSERT INTO users OVERRIDING SYSTEM VALUE VALUES (2, 'Võ Xuân Đức Thắng', 'thang_123', '123', '124', NULL, NULL, NULL);
INSERT INTO users OVERRIDING SYSTEM VALUE VALUES (3, 'Nguyễn Thị Minh Vượng', 'vuong_321', '123', '321', NULL, NULL, NULL);
INSERT INTO users OVERRIDING SYSTEM VALUE VALUES (4, 'Lê Thị Tuyết Trinh', 'trinh_312', '123', '312', NULL, NULL, NULL);
COMMIT;


-- ----------------------------
-- Checks structure for table Class_User
-- ----------------------------
ALTER TABLE class_user ADD CONSTRAINT "VALID_MARK" CHECK (mark >= 0 AND mark <= 10);

-- ----------------------------
-- Primary Key structure for table Class_User
-- ----------------------------
ALTER TABLE class_user ADD CONSTRAINT "Class_User_pkey" PRIMARY KEY ("id_class", "id_user");

-- ----------------------------
-- Uniques structure for table Classes
-- ----------------------------
ALTER TABLE classes ADD CONSTRAINT "CLASS_NAME" UNIQUE ("class_name");

-- ----------------------------
-- Primary Key structure for table Classes
-- ----------------------------
ALTER TABLE classes ADD CONSTRAINT "Classes_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table Users
-- ----------------------------
ALTER TABLE users ADD CONSTRAINT "ID_UNI" UNIQUE ("id_uni");
ALTER TABLE users ADD CONSTRAINT "USERNAME" UNIQUE ("username");

-- ----------------------------
-- Primary Key structure for table Users
-- ----------------------------
ALTER TABLE users ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table Class_User
-- ----------------------------
ALTER TABLE class_user ADD CONSTRAINT "ID_CLASS_CLASSUSERCLASS" FOREIGN KEY ("id_class") REFERENCES classes ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE class_user ADD CONSTRAINT "ID_USER_CLASSUSERUSER" FOREIGN KEY ("id_user") REFERENCES users ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Foreign Keys structure for table Classes
-- ----------------------------
ALTER TABLE classes ADD CONSTRAINT "ADMIN_CLASSUSER" FOREIGN KEY ("id_admin") REFERENCES users ("id") ON DELETE SET NULL ON UPDATE CASCADE;

select * from users
