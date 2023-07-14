-- Adminer 4.8.1 PostgreSQL 15.3 dump

DROP TABLE IF EXISTS "tasks";
DROP SEQUENCE IF EXISTS tasks_id_seq;
CREATE SEQUENCE tasks_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."tasks" (
    "task_name" character varying NOT NULL,
    "task_type" character varying NOT NULL,
    "id" integer DEFAULT nextval('tasks_id_seq') NOT NULL,
    "is_complete" boolean DEFAULT false NOT NULL,
    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "tasks" ("task_name", "task_type", "id", "is_complete") VALUES
('Task 1',	'Type 1',	3,	'1'),
('Task 1',	'Type 1',	4,	'0');

-- 2023-07-11 16:19:02.150673+05