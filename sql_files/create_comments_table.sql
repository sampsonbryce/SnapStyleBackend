CREATE TABLE comments (
  post_id int NOT NULL PRIMARY KEY,
  user_id int NOT NULL,
  comment text NOT NULL,
  date_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)