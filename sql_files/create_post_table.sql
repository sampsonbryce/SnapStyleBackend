CREATE TABLE posts (
  post_id int auto_increment NOT NULL PRIMARY KEY,
  user_id int NOT NULL,
  description text,
  date_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)