CREATE TABLE followers (
  user_id int NOT NULL,
  follower int NOT NULL,
  date_followed DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)