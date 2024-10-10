ALTER ROLE postgres WITH SUPERUSER;

CREATE DATABASE "somedatabase";

\c "somedatabase"

CREATE TABLE users (
	username text PRIMARY KEY,
	"password" text NULL,
	vars jsonb NULL,
	"status" text,
	createdate timestamp with time zone,
	modifydate timestamp with time zone
);