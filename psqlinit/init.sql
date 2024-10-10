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


-- Insert 5 users
INSERT INTO users (username, "password", vars, "status", createdate, modifydate) VALUES
    ('user1', '$2a$11$J0IMzn/C4ARog75X5LrUp.u1j2D0IoR2M0vt6tVNoW5DquJdRl5ca', '{"key1": "value1"}', 'Active', NOW(), NOW()), 
    ('user2', '$2a$11$3NH4wu1kumv118.UASfcqOAsNsB2THXPu8aymdl7jq.xlzdhbarUW', '{"key2": "value2"}', 'Active', NOW(), NOW()), 
    ('user3', '$2a$11$SqtBY7rBEdG6hxSEyk7UWePFZW486HbSbl36nFSffIvBpxXIZUV5.', NULL, 'Active', NOW(), NOW()), 
    ('user4', '$2a$11$wbBkOQpGHz0vBgnlXz55GuvMdXIb4qYmL8KElHc79fnxHKXdyTgwu', '{"key3": "value3", "key4": "value4"}', 'Active', NOW(), NOW()), 
    ('user5', '$2a$11$08.FHgl4AT5aCA278a2oDedbW5TVf2WSSqC8fYPdd7RR4sNEbT44e', '{"key5": "value5"}', 'Active', NOW() - interval '1 day', NOW() - interval '1 hour'); 
